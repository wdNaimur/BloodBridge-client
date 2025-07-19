import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

import DonationsTable from "../shared/DonationsTable";
import DonationDetailsModal from "../Modal/DonationDetailsModal";
import Loader from "../../UI/Loader";
import { Link } from "react-router";
import FeedbackMessage from "../../UI/FeedbackMessage ";

const DonorOverviewPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch latest 3 donation requests
  const {
    data: donations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-donations-request", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-donations-recent?email=${user.email}`
      );
      return res.data;
    },
  });

  const handleDetails = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loader />;

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
      {donations.length === 0 ? (
        <FeedbackMessage
          title="No Recent Donation Activity"
          message="It looks like you haven't made any donation requests yet. Start your first request and help save lives today."
          buttonText="Create Donation Request"
          to="/dashboard/create-donation-request"
        />
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6">
            🩸 Your Recent Donation Requests
          </h2>
          <DonationsTable
            donations={donations}
            onDetailsClick={handleDetails}
          />
          <Link
            to="/dashboard/my-donation-request"
            className="btn w-full btn-secondary rounded-b-xl text-base-200 uppercase"
          >
            View All Requests
          </Link>
        </>
      )}

      {/* Modal outside to avoid conditional mount issues */}
      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donation={selectedDonation}
      />
    </div>
  );
};

export default DonorOverviewPage;
