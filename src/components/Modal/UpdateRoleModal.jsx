import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import { RiArrowDropDownLine } from "react-icons/ri";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const UpdateRoleModal = ({ isOpen, close, user }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "donor");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    try {
      const res = await axiosSecure.patch(`/users/role/${user._id}`, {
        role: selectedRole,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(`${user.name}'s role updated to ${selectedRole}`);
        close();
        queryClient.invalidateQueries(["users"]);
      } else {
        toast.error("No changes were made.");
      }
    } catch (error) {
      toast.error("Failed to update role");
      console.error(error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-secondary/90 p-6 backdrop-blur-2xl">
            <DialogTitle
              as="h3"
              className="text-base font-medium text-base-100"
            >
              Update{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-bold">
                {user?.name}
              </span>
              's Role
            </DialogTitle>
            <div className="relative mt-3">
              <select
                className={clsx(
                  "block w-full appearance-none rounded-lg bg-secondary px-4 py-2 pr-10 text-sm text-base-100",
                  "focus:outline-none focus:ring-0"
                )}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
              </select>
              <RiArrowDropDownLine
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base-100 text-xl"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                className="btn btn-primary rounded-xl text-base-200 shadow-none border-none flex-1"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="btn btn-secondary rounded-xl text-base-200 shadow-none border-none flex-1"
                onClick={close}
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

export default UpdateRoleModal;
