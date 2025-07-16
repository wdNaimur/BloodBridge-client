import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const PublishBlogModal = ({ isOpen, onClose, blogId, action = "publish" }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const statusText = action === "publish" ? "Publish" : "Unpublish";
  const newStatus = action === "publish" ? "published" : "draft";

  useEffect(() => {
    if (!isOpen) setIsUpdating(false);
  }, [isOpen]);

  const handleStatusUpdate = async () => {
    if (!blogId) {
      toast.error("No blog ID provided.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await axiosSecure.patch(`/blogs/${blogId}/status`, {
        status: newStatus,
      });

      if (res.status === 200) {
        toast.success(`Blog ${statusText.toLowerCase()}ed successfully.`);
        queryClient.invalidateQueries(["blogs"]);
        onClose();
      } else {
        toast.error("Failed to update blog status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Error updating blog status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 focus:outline-none"
        onClose={() => !isUpdating && onClose()}
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
                <Dialog.Title className="text-lg font-semibold text-warning">
                  Confirm {statusText}
                </Dialog.Title>

                <p className="mt-2 text-sm text-base-100/80">
                  Are you sure you want to {statusText.toLowerCase()} this blog?
                </p>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-xl flex-1 text-base-200 border-none shadow-none"
                    onClick={() => !isUpdating && onClose()}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary rounded-xl flex-1 text-base-200 border-none shadow-none"
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? `${statusText}ing...` : `Yes, ${statusText}`}
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

export default PublishBlogModal;
