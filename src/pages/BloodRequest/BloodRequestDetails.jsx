import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { format, parseISO } from "date-fns";
import { RxCross2 } from "react-icons/rx";
import Loader from "../../UI/Loader";
import FeedbackMessage from "../../UI/FeedbackMessage ";

const BloodRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
    <div className="container mx-auto p-4 font-poppins max-w-xl">
      <h1 className="text-3xl font-bold mb-4 text-primary">
        Blood Donation Request Details
      </h1>

      <div className="bg-base-200 p-6 rounded shadow-lg shadow-primary/5 space-y-3">
        <p>
          <strong>Recipient Name:</strong> {request.recipientName}
        </p>
        <p>
          <strong>Blood Group:</strong> {request.bloodGroup}
        </p>
        <p>
          <strong>District:</strong> {request.district}
        </p>
        <p>
          <strong>Upazila:</strong> {request.upazila}
        </p>
        <p>
          <strong>Hospital Name:</strong> {request.hospitalName}
        </p>
        <p>
          <strong>Address:</strong> {request.address}
        </p>
        <p>
          <strong>Donation Date:</strong>{" "}
          {format(parseISO(request.donationDateTime), "PP")}
        </p>
        <p>
          <strong>Donation Time:</strong> {request.donationTime}
        </p>
        <p>
          <strong>Request Message:</strong> {request.requestMessage}
        </p>
        <p>
          <strong>Requester Name:</strong> {request.requesterName}
        </p>
        <p>
          <strong>Requester Email:</strong> {request.requesterEmail}
        </p>
        <p className="flex items-center gap-2">
          <strong>Status:</strong>{" "}
          <span className="badge badge-primary text-base-200 pb-1">
            {request.status}
          </span>
        </p>
        <p>
          <strong>Added At:</strong>{" "}
          {format(parseISO(request.addedAt), "p, PP")}
        </p>

        {request.status === "pending" && !isRequester && (
          <div className="mt-6">
            <button
              onClick={openModal}
              className="btn btn-primary w-full text-base-100 shadow-none border-none"
            >
              Donate
            </button>
          </div>
        )}

        {isRequester && (
          <p className="mt-6 text-center text-red-600 font-semibold">
            You cannot donate to your own blood request.
          </p>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Confirm Donation</h2>

            <form>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Donor Name</label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">Donor Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
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
                  className="btn btn-primary text-base-200 border-none shadow-none w-full"
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
