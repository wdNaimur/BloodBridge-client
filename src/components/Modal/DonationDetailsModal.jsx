import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  FaTint,
  FaMapMarkerAlt,
  FaHospital,
  FaCalendarAlt,
  FaUserAlt,
  FaCommentAlt,
  FaHeartbeat,
} from "react-icons/fa";
import { format, parseISO } from "date-fns";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DonationDetailsModal = ({ isOpen, onClose, donation }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [confirmStatus, setConfirmStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { mutate: updateStatus, isLoading: updating } = useMutation({
    mutationFn: async (newStatus) => {
      const { data } = await axiosSecure.patch(
        `/bloodDonations/${donation._id}/status`,
        {
          status: newStatus,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["donations"]);
      onClose();
    },
    onError: (err) => {
      console.error("Status update failed:", err);
    },
  });

  const handleStatusChange = (status) => {
    setConfirmStatus(status);
    setShowConfirmModal(true);
  };

  const confirmAndUpdate = () => {
    if (confirmStatus) {
      updateStatus(confirmStatus);
      setShowConfirmModal(false);
    }
  };

  if (!donation) return null;

  return (
    <>
      {/* Main Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-base-200 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-xl font-bold text-primary border-b-4 pb-4 w-fit border-dashed border-b-primary/40">
                    🩸 Donation Request Details
                  </Dialog.Title>

                  <div className="p-4 md:p-6 text-secondary space-y-6">
                    <div className="grid 2xl:grid-cols-3 md:grid-cols-2 gap-6 justify-center items-start">
                      {/* Donor Info */}
                      {donation.status !== "pending" && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
                            <FaHeartbeat />
                            Donor Info
                          </h3>
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {donation.donator.donorName}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {donation.donator.donorEmail}
                          </p>
                        </div>
                      )}

                      {/* Recipient Info */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
                          <FaTint />
                          Recipient Info
                        </h3>
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {donation.recipientName}
                        </p>
                        <p>
                          <span className="font-medium">Blood Group:</span>{" "}
                          <span className="badge badge-error">
                            {donation.bloodGroup}
                          </span>
                        </p>
                      </div>

                      {/* Location */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
                          <FaMapMarkerAlt />
                          Location
                        </h3>
                        <p>
                          <span className="font-medium">District:</span>{" "}
                          {donation.district}
                        </p>
                        <p>
                          <span className="font-medium">Upazila:</span>{" "}
                          {donation.upazila}
                        </p>
                      </div>

                      {/* Hospital */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
                          <FaHospital />
                          Hospital
                        </h3>
                        <p>
                          <span className="font-medium">Hospital Name:</span>{" "}
                          {donation.hospitalName}
                        </p>
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {donation.address}
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
                          {format(parseISO(donation.donationDateTime), "PP")}
                        </p>
                        <p>
                          <span className="font-medium">Time:</span>{" "}
                          {donation.donationTime}
                        </p>
                        <p>
                          <span className="font-medium">Added:</span>{" "}
                          {format(parseISO(donation.addedAt), "p, PP")}
                        </p>
                      </div>

                      {/* Requester */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
                          <FaUserAlt />
                          Requester
                        </h3>
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {donation.requesterName}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {donation.requesterEmail}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          <span className="badge badge-primary uppercase pb-0.5 text-white">
                            {donation.status}
                          </span>
                        </p>
                      </div>

                      {/* Message */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary opacity-80">
                          <FaCommentAlt />
                          Message
                        </h3>
                        <p>
                          {donation.requestMessage || "No message provided."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-3">
                    {donation.status === "inprogress" && (
                      <>
                        <button
                          onClick={() => handleStatusChange("done")}
                          disabled={updating}
                          className="btn btn-primary text-base-200 btn-sm rounded-xl flex-1"
                        >
                          Request Done
                        </button>
                        <button
                          onClick={() => handleStatusChange("canceled")}
                          disabled={updating}
                          className="btn btn-secondary text-base-200 btn-sm rounded-xl flex-1"
                        >
                          Cancel Request
                        </button>
                      </>
                    )}
                    <button
                      onClick={onClose}
                      className="btn text-secondary bg-secondary/20 btn-sm rounded-xl flex-1"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Confirmation Modal */}
      <Transition appear show={showConfirmModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 focus:outline-none"
          onClose={() => !updating && setShowConfirmModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md rounded-xl bg-secondary/90 p-6 backdrop-blur-2xl shadow-xl text-left align-middle">
                  <Dialog.Title className="text-lg font-semibold text-error">
                    Confirm{" "}
                    {confirmStatus === "done" ? "Completion" : "Cancellation"}
                  </Dialog.Title>

                  <p className="mt-4 text-sm text-base-100/80">
                    Are you sure you want to{" "}
                    <span className="font-semibold text-error">
                      {confirmStatus === "done"
                        ? "mark this request as done"
                        : "cancel this request"}
                    </span>
                    ?
                  </p>

                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      className="btn btn-secondary rounded-xl flex-1 text-base-200 shadow-none border-none btn-sm"
                      onClick={() => !updating && setShowConfirmModal(false)}
                      disabled={updating}
                    >
                      No, Go Back
                    </button>
                    <button
                      onClick={confirmAndUpdate}
                      disabled={updating}
                      className="btn btn-error rounded-xl flex-1 text-base-200 shadow-none border-none btn-sm"
                    >
                      {updating ? "Processing..." : "Yes, Confirm"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DonationDetailsModal;
