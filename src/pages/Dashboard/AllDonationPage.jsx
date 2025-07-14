import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DonationDetailsModal from "../../components/Modal/DonationDetailsModal";
import DonationsTable from "../../components/shared/DonationsTable";
import { RiArrowDropDownLine } from "react-icons/ri";

const AllDonationPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const {
    data: donations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-donations-request", user?.email, selectedStatus],
    enabled: !!user?.email,
    queryFn: async () => {
      const statusQuery = selectedStatus ? `&status=${selectedStatus}` : "";
      const res = await axiosSecure.get(
        `/all-donations-request?${statusQuery}`
      );
      return res.data;
    },
  });

  console.log(selectedStatus);
  const handleDetails = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-primary text-lg">
          Loading your donation requests...
        </p>
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to fetch donations");
    console.error(error);
    return (
      <div className="p-6">
        <p className="text-red-500">Error loading donation requests.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">All Donations</h2>

        {/* Status Filter */}
        <div className="relative w-fit select-none">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-fit appearance-none rounded-lg bg-secondary px-4 py-2 pr-10 text-sm text-base-100 focus:outline-none focus:ring-0 cursor-pointer select-none"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Arrow Icon Overlay */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base-200 text-2xl">
            <RiArrowDropDownLine />
          </div>
        </div>
      </div>

      <DonationsTable donations={donations} onDetailsClick={handleDetails} />

      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donation={selectedDonation}
      />
    </div>
  );
};

export default AllDonationPage;
