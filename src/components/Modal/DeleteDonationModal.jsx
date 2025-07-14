import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const DeleteDonationModal = ({ isOpen, onClose, donationId }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!donationId) {
      toast.error("No donation ID provided.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await axiosSecure.delete(
        `/my-donations-request/${donationId}`
      );
      if (res.status === 200) {
        toast.success("Donation request deleted successfully.");
        queryClient.invalidateQueries(["my-donations-request"]);
        onClose();
      } else {
        toast.error("Failed to delete donation request.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting donation request.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 focus:outline-none"
        onClose={() => !isDeleting && onClose()}
      >
        <div className="fixed inset-0 bg-black/10 bg-opacity-30" />

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
                  Confirm Deletion
                </Dialog.Title>

                <p className="mt-2 text-sm text-base-100/80">
                  Are you sure you want to delete this donation request? This
                  action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-xl flex-1 text-base-200 shadow-none border-none"
                    onClick={() => !isDeleting && onClose()}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-error rounded-xl flex-1 text-base-200 shadow-none border-none"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteDonationModal;
