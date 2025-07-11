import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../UI/Loader";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import DistrictUpazilaSelect from "../../components/shared/DistrictUpazilaSelect";
import useDistrictName from "../../hooks/useDistrictName";

const ProfilePage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editable, setEditable] = useState(false);
  // Local state for district/upazila

  const [districtId, setDistrictId] = useState("");
  const [upazila, setUpazila] = useState("");

  // Fetch user profile
  const fetchUser = async () => {
    const { data } = await axiosSecure.get(`/user/${user.email}`);
    return data;
  };

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", user.email],
    queryFn: fetchUser,
  });
  console.log(profileData);
  console.log(profileData?.districtId);
  const districtName = useDistrictName(profileData?.districtId);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Set default form values when data is available
  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name,
        email: profileData.email,
        address: profileData.address,
        bloodGroup: profileData.bloodGroup,
      });
      setDistrictId(profileData.districtId || "");
      setUpazila(profileData.upazila || "");
    }
  }, [profileData, reset]);

  // Handle district/upazila change
  const handleDistrictChange = (id) => {
    setDistrictId(id);
    setUpazila(""); // reset upazila
  };

  const handleUpazilaChange = (value) => {
    setUpazila(value);
  };

  // Form submission
  const onSubmit = async (updatedData) => {
    const fullData = {
      ...updatedData,
      districtId,
      upazila,
    };

    console.log("Submitted Profile Data:", fullData);

    try {
      await axiosSecure.put(`/user/${user.email}`, fullData);
      toast.success("Profile updated successfully");
      setEditable(false);
      refetch();
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return;

  return (
    <div>
      {/* Heading */}
      <div className="mb-6 border-b-2 border-dashed border-secondary/20">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 flex items-center gap-2">
          My Profile
        </h1>
        <p className="text-secondary opacity-80 max-w-xl mb-4">
          View and manage your personal information securely.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid 2xl:grid-cols-3 gap-4"
      >
        {/* Profile Card */}
        <div className="2xl:col-span-1 bg-base-200 p-4 rounded-2xl flex flex-col gap-2 justify-center items-center shadow-xl shadow-primary/5 relative">
          <h3 className="text-3xl font-Sora font-bold">{profileData.name}</h3>
          <p className="uppercase font-medium text-primary leading-2">
            {profileData.role}
          </p>
          <img
            className="rounded-full w-60 h-60 object-cover border-4 border-secondary/40 mt-2"
            src={profileData.image}
            alt={profileData.name}
          />
          <p className="badge badge-primary uppercase text-base-100 text-xs font-medium absolute top-4 right-4">
            {profileData.status}
          </p>
        </div>

        {/* Editable Info */}
        <div className="2xl:col-span-2 bg-base-200 p-4 rounded-2xl shadow-xl shadow-primary/5 font-Poppins">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-medium pb-2 mb-4 border-b-2 border-dashed border-secondary/20">
              Profile Summary
            </h3>
            <div>
              {!editable && (
                <button
                  type="button"
                  onClick={() => setEditable(true)}
                  className="text-secondary cursor-pointer opacity-60 hover:opacity-100"
                >
                  <FaEdit />
                </button>
              )}
              {editable && (
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary text-base-200 shadow-none border-none btn-xs"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary text-base-200 shadow-none border-none btn-xs ml-1 "
                    onClick={() => {
                      setEditable(false);
                      reset(profileData);
                      setDistrictId(profileData.districtId || "");
                      setUpazila(profileData.upazila || "");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 space-y-2">
            {/* Name */}
            <div>
              <label className="label text-primary">Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                readOnly={!editable}
                className={`input border-none w-full shadow-none ${
                  !editable
                    ? "bg-transparent p-0 text-secondary font-medium focus:outline-0 focus:shadow-none cursor-default text-xl -mt-1"
                    : "text-secondary/80 focus:outline-primary/40 bg-primary/10"
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">Name is required</span>
              )}
            </div>

            {/* Email (view-only) */}
            {!editable && (
              <div>
                <label className="label text-primary">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  readOnly
                  className="input border-none w-full shadow-none bg-transparent p-0 text-secondary font-medium focus:outline-0 focus:shadow-none cursor-default text-xl -mt-1"
                />
              </div>
            )}

            {/* Address (view-only) */}
            {!editable && districtName && (
              <div>
                <label className="label text-primary">Address</label>
                <input
                  type="text"
                  readOnly
                  className="input border-none w-full shadow-none bg-transparent p-0 text-secondary font-medium focus:outline-0 focus:shadow-none cursor-default text-xl -mt-1"
                  defaultValue={`${upazila}, ${districtName}`}
                />
              </div>
            )}

            {/* District/Upazila Select in Edit Mode */}
            {editable && (
              <>
                {!editable && (
                  <div className="mt-2">
                    <label className="label text-primary">Address</label>

                    <input
                      type="text"
                      {...register("address")}
                      className="input input-bordered w-full"
                    />
                  </div>
                )}
                <DistrictUpazilaSelect
                  selectedDistrictId={districtId}
                  setSelectedDistrictId={handleDistrictChange}
                  upazila={upazila}
                  setUpazila={handleUpazilaChange}
                />
              </>
            )}
            {/* Blood Group */}

            <div>
              <label className="label text-primary">Blood Group</label>
              {editable ? (
                <>
                  <select
                    {...register("bloodGroup", { required: true })}
                    className="input bg-primary/10 border-none w-full focus:outline-primary/40 cursor-pointer"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p className="text-sm text-red-500">
                      Blood Group is required
                    </p>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  readOnly
                  className="input border-none w-full shadow-none bg-transparent p-0 text-secondary font-medium focus:outline-0 focus:shadow-none cursor-default text-xl -mt-1"
                  value={profileData?.bloodGroup || "Not Provided"}
                />
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Save / Cancel Buttons */}
    </div>
  );
};

export default ProfilePage;
