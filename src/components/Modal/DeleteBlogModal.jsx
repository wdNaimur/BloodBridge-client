import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const DeleteBlogModal = ({ isOpen, onClose, blogId }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!blogId) {
      toast.error("No blog ID provided.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await axiosSecure.delete(`/blogs/${blogId}`);
      if (res.status === 200) {
        toast.success("Blog deleted successfully.");
        queryClient.invalidateQueries(["blogs"]);
        onClose();
        navigate("/dashboard/content-management");
      } else {
        toast.error("Failed to delete blog.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting blog.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-50 focus:outline-none"
      onClose={() => !isDeleting && onClose()}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
        <div className="flex min-h-full items-center justify-center p-4 ">
          <DialogPanel className="w-full max-w-md rounded-xl bg-secondary/90 backdrop-blur-sm p-6 ">
            <DialogTitle
              as="h3"
              className="text-base font-medium text-base-100"
            >
              Delete Blog
            </DialogTitle>

            <p className="mt-2 text-sm text-base-100/80">
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </p>

            <div className="mt-4 flex gap-4">
              <button
                className="btn btn-primary rounded-xl text-base-200 shadow-none border-none flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>

              <button
                className="btn rounded-xl text-secondary shadow-none border-none flex-1"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteBlogModal;
