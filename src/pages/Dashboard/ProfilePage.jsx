import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../UI/Loader";
import toast from "react-hot-toast";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import DistrictUpazilaSelect from "../../components/shared/DistrictUpazilaSelect";
import useDistrictName from "../../hooks/useDistrictName";
import { motion } from "motion/react";
import uploadImageToImgBB from "../../utils/uploadImageToImgBB";
import DashboardHeader from "../../UI/DashboardHeader";

const ProfilePage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editable, setEditable] = useState(false);
  const [districtId, setDistrictId] = useState("");
  const [upazila, setUpazila] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef();

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

  const districtName = useDistrictName(profileData?.districtId);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name,
        email: profileData.email,
        bloodGroup: profileData.bloodGroup,
      });
      setDistrictId(profileData.districtId || "");
      setUpazila(profileData.upazila || "");
      setImageUrl(profileData.image || "");
    }
  }, [profileData, reset]);

  const handleDistrictChange = (id) => {
    setDistrictId(id);
    setUpazila("");
  };

  const handleUpazilaChange = (value) => {
    setUpazila(value);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImageToImgBB(file);
    setUploading(false);
    if (url) {
      setImageUrl(url);
      toast.success("Image uploaded successfully");
    } else {
      toast.error("Image upload failed");
    }
  };

  const onSubmit = async (updatedData) => {
    const fullData = {
      ...updatedData,
      districtId,
      districtName,
      upazila,
      image: imageUrl,
    };
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
  if (error) return null;

  return (
    <div>
      <DashboardHeader
        title="My Profile"
        subtitle="View and manage your personal information securely."
        icon={<FaUserCircle />}
      />

      <motion.form
        layout
        onSubmit={handleSubmit(onSubmit)}
        className="grid 2xl:grid-cols-3 gap-4"
      >
        {/* PROFILE IMAGE AREA */}
        <div className="2xl:col-span-1 bg-base-200 p-5 rounded-2xl flex flex-col gap-2 justify-center items-center shadow-xl shadow-primary/5 relative">
          <h3 className="text-3xl font-Sora font-bold text-center mt-2">
            {profileData.name}
          </h3>
          <p className="uppercase font-medium text-primary leading-2">
            {profileData.role}
          </p>

          {/* Image container */}
          <div className="relative w-60 h-60">
            <img
              className="rounded-full w-full h-full object-cover border-4 border-secondary/40"
              src={imageUrl || profileData.image}
              alt={profileData.name}
            />

            {uploading && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                <span className="loading loading-spinner text-white"></span>
              </div>
            )}

            {editable && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-white text-primary p-2 rounded-full shadow hover:bg-primary hover:text-white transition"
                  title="Change Photo"
                >
                  <FiCamera className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}

            <p className="badge badge-primary uppercase text-base-100 text-xs font-medium absolute bottom-2 translate-y-1/2 right-1/2 translate-x-1/2">
              {profileData.status}
            </p>
          </div>
        </div>

        {/* PROFILE FORM AREA */}
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
                  className="text-secondary cursor-pointer opacity-60 hover:opacity-100 hover:bg-secondary/20 p-2 rounded-full duration-300"
                >
                  <FaEdit />
                </button>
              )}
            </div>
          </div>

          <div className="px-4 space-y-2">
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

            {!editable && (
              <div>
                <label className="label text-primary">Address</label>
                <input
                  type="text"
                  readOnly
                  className="input border-none w-full shadow-none bg-transparent p-0 text-secondary font-medium focus:outline-0 focus:shadow-none cursor-default text-xl -mt-1"
                  value={
                    upazila && districtName
                      ? `${upazila}, ${districtName}`
                      : "Not Provided"
                  }
                />
              </div>
            )}

            {editable && (
              <DistrictUpazilaSelect
                selectedDistrictId={districtId}
                setSelectedDistrictId={handleDistrictChange}
                upazila={upazila}
                setUpazila={handleUpazilaChange}
                requiredDistrict={true}
                requiredUpazila={true}
              />
            )}

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
            {editable && (
              <div>
                <button
                  type="submit"
                  className="btn rounded-xl  text-base-200 shadow-none border-none btn-primary"
                  disabled={uploading}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn rounded-xl  btn-secondary text-base-200 shadow-none border-none  ml-2"
                  onClick={() => {
                    setEditable(false);
                    reset(profileData);
                    setDistrictId(profileData.districtId || "");
                    setUpazila(profileData.upazila || "");
                    setImageUrl(profileData.image || "");
                  }}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default ProfilePage;
