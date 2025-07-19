import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { format, parseISO } from "date-fns";
import { RxCross2 } from "react-icons/rx";
import Loader from "../../UI/Loader";

import {
  FaInfoCircle,
  FaTint,
  FaMapMarkerAlt,
  FaHospital,
  FaCalendarAlt,
  FaUserAlt,
  FaEnvelope,
  FaCommentAlt,
} from "react-icons/fa";
import PageHeader from "../../UI/PageHeader";
import FeedbackMessage from "../../UI/FeedbackMessage ";

const BloodRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  useEffect(() => {
    document.title = "BloodBridge | Blood Request";
    window.scrollTo(0, 0);
  }, []);

  const {
    data: request,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["bloodRequest", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bloodDonations/${id}`);
      return res.data;
    },
    enabled: !!id,
    onError: (err) => {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "Error loading request details"
      );
    },
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleConfirmDonation = async () => {
    if (!request) return;

    setUpdatingStatus(true);

    try {
      await axiosSecure.patch(`/bloodDonations/${id}`, {
        status: "inprogress",
        donator: {
          donorName: user?.displayName,
          donorEmail: user?.email,
          confirmedAt: new Date().toISOString(),
        },
      });

      toast.success("Donation confirmed! Status updated to in progress.");

      closeModal();
      navigate("/");
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update donation status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (isLoading) return <Loader />;

  if (isError || !request)
    return (
      <FeedbackMessage
        title="No Active Blood Requests Found"
        message="It looks like there are no current blood requests matching your criteria. The requests might have already been fulfilled, canceled, or are still being processed. Please check back later or explore existing requests."
        buttonText="View Blood Requests"
        to="/blood-requests"
      />
    );

  const isRequester = user?.email === request?.requesterEmail;

  return (
    <div className="container mx-auto px-4 font-poppins mt-10">
      <PageHeader
        icon={FaInfoCircle}
        title="Blood Request Details"
        subtitle="Review the request and take action to help someone in urgent need."
      />

      <div className="bg-base-200 p-4 md:p-6 rounded-xl border border-primary/10 shadow-lg shadow-primary/5 text-secondary space-y-6">
        {/* Info grid */}
        <div className="grid 2xl:grid-cols-3 sm:grid-cols-2 gap-6 sm:justify-center items-start">
          {/* Recipient Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
              <FaTint />
              Recipient Info
            </h3>
            <p>
              <span className="font-medium">Name:</span> {request.recipientName}
            </p>
            <p>
              <span className="font-medium">Blood Group:</span>{" "}
              <span className="badge badge-error">{request.bloodGroup}</span>
            </p>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
              <FaMapMarkerAlt />
              Location
            </h3>
            <p>
              <span className="font-medium">District:</span> {request.district}
            </p>
            <p>
              <span className="font-medium">Upazila:</span> {request.upazila}
            </p>
          </div>

          {/* Hospital Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
              <FaHospital />
              Hospital
            </h3>
            <p>
              <span className="font-medium">Hospital Name:</span>{" "}
              {request.hospitalName}
            </p>
            <p>
              <span className="font-medium">Address:</span> {request.address}
            </p>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
              <FaCalendarAlt />
              Schedule
            </h3>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {format(parseISO(request.donationDateTime), "PP")}
            </p>
            <p>
              <span className="font-medium">Time:</span> {request.donationTime}
            </p>
            <p>
              <span className="font-medium">Added:</span>{" "}
              {format(parseISO(request.addedAt), "p, PP")}
            </p>
          </div>

          {/* Requester */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
              <FaUserAlt />
              Requester
            </h3>
            <p>
              <span className="font-medium">Name:</span> {request.requesterName}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {request.requesterEmail}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className="badge badge-primary uppercase pb-0.5 text-white">
                {request.status}
              </span>
            </p>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
              <FaCommentAlt />
              Message
            </h3>
            <p>{request.requestMessage || "No message provided."}</p>
          </div>
        </div>

        {/* Action Button */}
        {request.status === "pending" && !isRequester && (
          <button
            onClick={openModal}
            className="btn rounded-xl btn-primary   w-full mt-4 text-base-200 shadow-none border-none uppercase"
          >
            Donate
          </button>
        )}

        {/* Self-Request Warning */}
        {isRequester && (
          <p className="text-center mt-4 text-red-600 font-medium">
            You cannot donate to your own blood request.
          </p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-primary font-bold mb-4">
              Confirm Donation
            </h2>

            <form>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Donor Name</label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="cursor-not-allowed input border-none bg-primary/10 w-full focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">Donor Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="cursor-not-allowed input border-none bg-primary/10 w-full focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 right-4 hover:bg-secondary/20 p-2 rounded-full cursor-pointer"
                  disabled={updatingStatus}
                >
                  <RxCross2 />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDonation}
                  className="btn rounded-xl btn-primary text-base-200 border-none shadow-none w-full uppercase"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? "Confirming..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequestDetails;
