import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../UI/Loader";
import UpdateRoleModal from "../../components/Modal/UpdateRoleModal";
import ManageUsersTable from "../../components/ManageUsers/ManageUsersTable";

const ManageUsersPage = () => {
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function open(user) {
    setSelectedUser(user);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setSelectedUser(null);
  }

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error.message}
      </div>
    );

  return (
    <div className="rounded-2xl overflow-hidden bg-primary/10">
      <div className="overflow-x-auto">
        <table className="table table-zebra rounded-2xl">
          <thead className="bg-primary text-base-200">
            <tr>
              <th>User</th>
              <th>Location</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Block/Unblock</th>
              <th className="text-center">Promote/Demote</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <ManageUsersTable
                user={user}
                key={user._id}
                onOpen={() => open(user)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Only one modal for selected user */}
      {selectedUser && (
        <UpdateRoleModal isOpen={isOpen} close={close} user={selectedUser} />
      )}
    </div>
  );
};

export default ManageUsersPage;
