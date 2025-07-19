import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DonationDetailsModal from "../../components/Modal/DonationDetailsModal";
import DonationsTable from "../../components/shared/DonationsTable";
import { RiArrowDropDownLine } from "react-icons/ri";
import Loader from "../../UI/Loader";
import ScrollFadeIn from "../../UI/ScrollFadeIn";
import DashboardHeader from "../../UI/DashboardHeader";
import { FaTint } from "react-icons/fa";
import Pagination from "../../UI/Pagination";

const MyDonationRequestPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  useEffect(() => {
    document.title = "BloodBridge | My Donation Request";
    window.scrollTo(0, 0);
    setCurrentPage(0);
  }, [selectedStatus]);

  const {
    data = { donations: [], totalCount: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "my-donations-request",
      user?.email,
      selectedStatus,
      currentPage,
    ],
    enabled: !!user?.email,
    queryFn: async () => {
      const statusQuery = selectedStatus ? `&status=${selectedStatus}` : "";
      const res = await axiosSecure.get(
        `/my-donations-request?email=${user.email}&page=${currentPage}&limit=${itemsPerPage}${statusQuery}`
      );
      return res.data;
    },
  });
  const totalPages = Math.ceil(data.totalCount / itemsPerPage);
  const pages = [...Array(totalPages).keys()];
  const handleDetails = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <Loader />;
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
    <ScrollFadeIn>
      <div className="flex items-center justify-between mb-6">
        <DashboardHeader
          title="My Donation Requests"
          subtitle="Stay informed about your donation activities and support those in need."
          icon={<FaTint />}
        />

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

      <DonationsTable
        donations={data.donations}
        onDetailsClick={handleDetails}
      />

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
    </ScrollFadeIn>
  );
};

export default MyDonationRequestPage;
