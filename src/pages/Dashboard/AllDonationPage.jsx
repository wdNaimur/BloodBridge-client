import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DonationDetailsModal from "../../components/Modal/DonationDetailsModal";
import DonationsTable from "../../components/shared/DonationsTable";
import { RiArrowDropDownLine } from "react-icons/ri";
import DashboardHeader from "../../UI/DashboardHeader";
import { FaTint } from "react-icons/fa";
import Pagination from "../../UI/Pagination";
import DashBoardLoader from "../../UI/DashBoardLoader";

const AllDonationPage = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    document.title = "BloodBridge | All Donation";
    window.scrollTo(0, 0);
    setCurrentPage(0); // reset page when status filter changes
  }, [selectedStatus]);

  const {
    data = { donations: [], totalCount: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-donations-request", selectedStatus, currentPage],
    queryFn: async () => {
      const statusQuery = selectedStatus ? `&status=${selectedStatus}` : "";
      const res = await axiosSecure.get(
        `/all-donations-request?page=${currentPage}&limit=${itemsPerPage}${statusQuery}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(data.totalCount / itemsPerPage);
  const pages = [...Array(totalPages).keys()];

  const handleDetails = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <DashBoardLoader />;
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
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <DashboardHeader
          title="All Blood Donations"
          subtitle="Track, manage, and oversee all blood donation requests across the platform."
          icon={<FaTint />}
        />

        {/* Status Filter */}
        <div className="relative w-fit select-none ms-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-fit appearance-none rounded-lg bg-secondary px-4 py-2 pr-10 text-sm text-base-100 focus:outline-none focus:ring-0 cursor-pointer select-none"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Cancelled</option>
          </select>

          {/* Arrow Icon Overlay */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base-200 text-2xl">
            <RiArrowDropDownLine />
          </div>
        </div>
      </div>

      <DonationsTable
        donations={data.donations}
        onDetailsClick={handleDetails}
      />

      {/* Pagination */}
      <Pagination
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donation={selectedDonation}
      />
    </div>
  );
};

export default AllDonationPage;
