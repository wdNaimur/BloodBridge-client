import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useStatus from "../../hooks/useStatus";
import ScrollFadeIn from "../../UI/ScrollFadeIn";
import DashBoardLoader from "../../UI/DashBoardLoader";
import { useNavigate } from "react-router";

const CreateDonationPage = () => {
  const axiosSecure = useAxiosSecure();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [upazilas, setUpazilas] = useState([]);
  const [status, isStatusLoading] = useStatus();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "BloodBridge | Create Donation";
    window.scrollTo(0, 0);
  }, []);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const watchDonationDate = watch("donationDate");

  // Fetch districts
  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
          setDistricts(sorted);
        }
      })
      .catch((err) => console.error("Districts fetch error:", err));
  }, []);

  // Fetch upazilas on district change
  useEffect(() => {
    if (!selectedDistrictId) {
      setUpazilas([]);
      return;
    }

    fetch("/data/upazilas.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data
            .filter((u) => u.district_id === selectedDistrictId)
            .map((u) => u.name);
          setUpazilas(filtered.sort((a, b) => a.localeCompare(b)));
        }
      })
      .catch((err) => console.error("Upazilas fetch error:", err));
  }, [selectedDistrictId]);

  const onSubmit = async (data) => {
    if (status !== "active") {
      return toast.error(
        "Your account is currently blocked and cannot create donation requests. Please contact support for assistance."
      );
    }
    const selectedDistrict = districts.find((d) => d.id === data.district);

    const donationDateTime = new Date(
      `${data.donationDate}T${data.donationTime}`
    );
    const addedAt = new Date();

    const donationData = {
      ...data,
      districtId: data.district,
      district: selectedDistrict?.name || "",
      requesterName: user?.displayName || "",
      requesterEmail: user?.email || "",
      status: "pending",
      donationDateTime: donationDateTime.toISOString(), // Used for sorting urgency
      addedAt: addedAt.toISOString(), // Useful for tracking when it was created
    };

    try {
      const response = await axiosSecure.post("/bloodDonations", donationData);

      if (response.data.insertedId) {
        toast.success("Donation request created!");
        reset();
        setSelectedDistrictId("");
        setUpazilas([]);
        navigate("/dashboard/my-donation-request");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error posting donation request:", error);
      toast.error("Failed to create donation request.");
    }
  };
  if (isStatusLoading) {
    return <DashBoardLoader />;
  }
  return (
    <ScrollFadeIn>
      <div className="mx-auto bg-base-200 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
        <div className="text-center text-base-100 py-6 px-6 bg-primary">
          <h2 className="text-4xl font-bold pb-1">Create Donation Request</h2>
          <p className="opacity-80">
            Fill out the form below to request blood for someone in urgent need.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 fieldset p-6"
        >
          {/* Requester Name */}
          <div className="fieldset">
            <label className="label text-primary">Requester Name</label>
            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
            />
          </div>

          {/* Requester Email */}
          <div className="fieldset">
            <label className="label text-primary">Requester Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
            />
          </div>

          {/* Recipient Name */}
          <div className="fieldset">
            <label className="label text-primary">Recipient Name</label>
            <input
              type="text"
              {...register("recipientName", {
                required: "Recipient name is required",
              })}
              placeholder="Enter recipient name"
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
            />
            {errors.recipientName && (
              <p className="text-red-500 text-sm">
                {errors.recipientName.message}
              </p>
            )}
          </div>

          {/* District */}
          <div className="fieldset">
            <label className="label text-primary">Recipient District</label>
            <select
              {...register("district", { required: "District is required" })}
              onChange={(e) => {
                const districtId = e.target.value;
                setSelectedDistrictId(districtId);
                setValue("upazila", ""); // reset upazila when district changes
              }}
              className="input border-none bg-primary/10 w-full focus:outline-primary/40 cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                Select District
              </option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district.message}</p>
            )}
          </div>

          {/* Upazila */}
          <div className="fieldset">
            <label className="label text-primary">Recipient Upazila</label>
            <select
              {...register("upazila", { required: "Upazila is required" })}
              className="input border-none bg-primary/10 w-full focus:outline-primary/40 cursor-pointer"
              disabled={!selectedDistrictId}
            >
              <option value="">Select Upazila</option>
              {upazilas.map((u, idx) => (
                <option key={idx} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {errors.upazila && (
              <p className="text-red-500 text-sm">{errors.upazila.message}</p>
            )}
          </div>

          {/* Hospital Name */}
          <div className="fieldset">
            <label className="label text-primary">Hospital Name</label>
            <input
              type="text"
              {...register("hospitalName", {
                required: "Hospital name is required",
              })}
              placeholder="Enter hospital name"
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
            />
            {errors.hospitalName && (
              <p className="text-red-500 text-sm">
                {errors.hospitalName.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2 fieldset">
            <label className="label text-primary">Full Address</label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              placeholder="Enter full address"
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Blood Group */}
          <div className="fieldset">
            <label className="label text-primary">Blood Group</label>
            <select
              {...register("bloodGroup", {
                required: "Blood group is required",
              })}
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.bloodGroup && (
              <p className="text-red-500 text-sm">
                {errors.bloodGroup.message}
              </p>
            )}
          </div>

          {/* Donation Date */}
          <div className="fieldset">
            <label className="label text-primary">Donation Date</label>
            <input
              type="date"
              {...register("donationDate", {
                required: "Donation date is required",
                validate: (value) => {
                  const today = new Date();
                  const selectedDate = new Date(value + "T00:00:00"); // Normalize to midnight
                  if (selectedDate < today.setHours(0, 0, 0, 0)) {
                    return "Donation date must be today or in the future";
                  }
                  return true;
                },
              })}
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
            />
            {errors.donationDate && (
              <p className="text-red-500 text-sm">
                {errors.donationDate.message}
              </p>
            )}
          </div>

          {/* Donation Time */}
          <div className="fieldset">
            <label className="label text-primary">Donation Time</label>
            <input
              type="time"
              {...register("donationTime", {
                required: "Donation time is required",
                validate: (value) => {
                  if (!watchDonationDate) {
                    return true; // no date selected yet
                  }
                  const now = new Date();
                  const selectedDateTime = new Date(
                    `${watchDonationDate}T${value}`
                  );

                  const todayStr = now.toISOString().split("T")[0];
                  if (
                    watchDonationDate === todayStr &&
                    selectedDateTime <= now
                  ) {
                    return "Donation time must be later than current time";
                  }
                  return true;
                },
              })}
              className="input border-none bg-primary/10 w-full focus:outline-primary/40"
            />
            {errors.donationTime && (
              <p className="text-red-500 text-sm">
                {errors.donationTime.message}
              </p>
            )}
          </div>

          {/* Request Message */}
          <div className="md:col-span-2 fieldset">
            <label className="label text-primary">Request Message</label>
            <textarea
              {...register("requestMessage", {
                required: "Message is required",
              })}
              placeholder="Explain why you need the blood"
              className="textarea border-none bg-primary/10 w-full focus:outline-primary/40 min-h-[120px]"
            ></textarea>
            {errors.requestMessage && (
              <p className="text-red-500 text-sm">
                {errors.requestMessage.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center pt-4">
            <button
              type="submit"
              className="btn rounded-xl btn-primary shadow-none border-none w-full text-base-200"
            >
              Create Request
            </button>
          </div>
        </form>
      </div>
    </ScrollFadeIn>
  );
};

export default CreateDonationPage;
