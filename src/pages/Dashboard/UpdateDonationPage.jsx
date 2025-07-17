import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import useRole from "../../hooks/useRole";
import Loader from "../../UI/Loader";

const UpdateDonationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [role, isRoleLoading] = useRole();
  useEffect(() => {
    document.title = "BloodBridge | Update Donation";
    window.scrollTo(0, 0);
  }, []);

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const watchDonationDate = watch("donationDate");

  // Fetch districts once on mount
  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
          setDistricts(sorted);
        }
      });
  }, []);

  // Fetch donation data by id with react-query
  const {
    data: formData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["donation-request", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donations-request/${id}?role=${role}`
      );
      return res.data;
    },
  });

  // When formData loads, set district id for fetching upazilas
  useEffect(() => {
    if (formData) {
      setSelectedDistrictId(formData.districtId);
    }
  }, [formData]);

  // Load upazilas for selected district
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
            .map((u) => u.name)
            .sort((a, b) => a.localeCompare(b));
          setUpazilas(filtered);
        }
      });
  }, [selectedDistrictId]);

  // Reset form only after formData and upazilas are ready to ensure upazila default is set correctly
  useEffect(() => {
    if (formData && (upazilas.length > 0 || !selectedDistrictId)) {
      reset({
        recipientName: formData.recipientName,
        district: formData.districtId,
        upazila: formData.upazila,
        hospitalName: formData.hospitalName,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        donationDate: formData.donationDateTime?.split("T")[0],
        donationTime: formData.donationDateTime?.split("T")[1]?.slice(0, 5),
        requestMessage: formData.requestMessage,
      });
    }
  }, [formData, upazilas, selectedDistrictId, reset]);
  const onSubmit = async (data) => {
    const selectedDistrict = districts.find((d) => d.id === data.district);
    const donationDateTime = new Date(
      `${data.donationDate}T${data.donationTime}`
    ).toISOString();

    const updatedData = {
      ...data,
      districtId: data.district,
      district: selectedDistrict?.name || "",
      requesterName: user?.displayName || "",
      requesterEmail: user?.email || "",
      donationDateTime,
    };
    try {
      const res = await axiosSecure.patch(
        `/donations-request/${id}?role=${role}`,
        updatedData
      );
      if (res.data.modifiedCount > 0) {
        toast.success("Donation request updated");
        {
          role === "donor" && navigate("/dashboard/my-donation-request");
        }
        {
          role === "admin" && navigate("/dashboard/all-blood-donation-request");
        }
      } else {
        toast.error("No changes were made.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update donation request.");
    }
  };

  if (isLoading || isRoleLoading) {
    return <Loader />;
  }

  if (isError || !formData) {
    return (
      <div className="text-center py-20 text-lg font-semibold text-red-500">
        {error?.message || "Donation not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto bg-base-200 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
      <div className="text-center text-base-100 py-6 px-6 bg-primary">
        <h2 className="text-4xl font-bold pb-1">Update Donation Request</h2>
        <p className="opacity-80">Modify details of your existing request.</p>
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
            onChange={(e) => setSelectedDistrictId(e.target.value)}
            className="input border-none bg-primary/10 w-full focus:outline-primary/40 cursor-pointer"
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
            {...register("bloodGroup", { required: "Blood group is required" })}
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
            <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>
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
                const selectedDate = new Date(value + "T00:00:00");
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
                if (!watchDonationDate) return true;
                const now = new Date();
                const selectedDateTime = new Date(
                  `${watchDonationDate}T${value}`
                );
                const todayStr = now.toISOString().split("T")[0];
                if (watchDonationDate === todayStr && selectedDateTime <= now) {
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
            {...register("requestMessage", { required: "Message is required" })}
            placeholder="Explain why you need the blood"
            className="textarea border-none bg-primary/10 w-full focus:outline-primary/40 min-h-[120px]"
          />
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
            Update Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDonationPage;
