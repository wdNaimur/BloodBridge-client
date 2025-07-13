import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmBlockModal from "../Modal/ConfirmBlockModal";

const ManageUsersTable = ({ user, onOpen }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await axiosSecure.patch(`/users/status/${user._id}`, {
        status: user.status === "active" ? "blocked" : "active",
      });

      if (res.data.modifiedCount > 0) {
        toast.success(
          `${user.name} has been ${
            user.status === "active" ? "blocked" : "unblocked"
          }`
        );
        queryClient.invalidateQueries(["users"]);
      } else {
        toast.error("No changes made.");
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <tr>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img
                  src={user.image || "https://ibb.co/WW3mZGnd"}
                  alt={user.name}
                />
              </div>
            </div>
            <div>
              <div className="font-bold">{user.name}</div>
              <div className="text-sm opacity-50">{user.email}</div>
            </div>
          </div>
        </td>

        {/* Location */}
        <td className="min-w-40">
          <div className="text-sm">
            {user.upazila ? `${user.upazila}, ` : ""}
            {user.districtName || "Unknown"}
          </div>
        </td>

        {/* Role */}
        <td>{user.role || "Unknown"}</td>

        {/* Status */}
        <td>
          <span
            className={`badge pb-1 text-base-200 ${
              user.status === "active" ? "badge-primary" : "badge-secondary"
            }`}
          >
            {user.status || "Unknown"}
          </span>
        </td>

        {/* Block/Unblock */}
        <td className="text-center">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="btn border-none shadow-none text-base-200 btn-xs btn-secondary"
          >
            {user.status === "active" ? "Block User" : "Unblock User"}
          </button>
        </td>

        {/* Update Role */}
        <td className="text-center">
          <button
            onClick={onOpen}
            className="btn border-none shadow-none text-base-200 btn-xs btn-secondary"
          >
            Update Role
          </button>
        </td>
      </tr>

      {/* ✅ Confirmation Modal – correctly placed */}
      <ConfirmBlockModal
        isOpen={isConfirmOpen}
        close={() => setIsConfirmOpen(false)}
        onConfirm={handleStatusUpdate}
        user={user}
        isLoading={isLoading}
      />
    </>
  );
};

export default ManageUsersTable;
