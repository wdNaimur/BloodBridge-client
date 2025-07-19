import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../UI/Loader";
import UpdateRoleModal from "../../components/Modal/UpdateRoleModal";
import ManageUsersTable from "../../components/ManageUsers/ManageUsersTable";
import { FaUsersCog } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import DashboardHeader from "../../UI/DashboardHeader";
import TableLoader from "../../UI/TableLoader";
import Pagination from "../../UI/Pagination";

const ManageUsersPage = () => {
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    document.title = "BloodBridge | Manage Users";
    window.scrollTo(0, 0);
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatus]);

  function open(user) {
    setSelectedUser(user);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setSelectedUser(null);
  }

  const {
    data = { users: [], totalCount: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", selectedStatus, currentPage],
    queryFn: async () => {
      const statusQuery = selectedStatus ? `&status=${selectedStatus}` : "";
      const res = await axiosSecure.get(
        `/users?page=${currentPage}&limit=${itemsPerPage}${statusQuery}`
      );
      return res.data; // Expecting { users: [], totalCount: number }
    },
  });

  const totalPages = Math.ceil(data.totalCount / itemsPerPage);
  const pages = [...Array(totalPages).keys()];

  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <DashboardHeader
        title="User Management"
        subtitle="View, manage, and control user roles and permissions across the platform."
        icon={<FaUsersCog />}
      />
      {/* Filter */}
      <div className="relative w-fit select-none mb-4 ms-auto">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="block w-fit appearance-none rounded-lg bg-secondary px-4 py-2 pr-10 text-sm text-base-100 focus:outline-none focus:ring-0 cursor-pointer select-none"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>

        {/* Arrow Icon Overlay */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base-200 text-2xl">
          <RiArrowDropDownLine />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-primary/10">
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="table table-zebra rounded-2xl w-full">
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
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={7} className="text-center">
                    <TableLoader />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {data.users.length ? (
                  data.users.map((user) => (
                    <ManageUsersTable
                      key={user._id}
                      user={user}
                      onOpen={() => open(user)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-secondary py-6">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* Modal */}
        {selectedUser && (
          <UpdateRoleModal isOpen={isOpen} close={close} user={selectedUser} />
        )}
      </div>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ManageUsersPage;
