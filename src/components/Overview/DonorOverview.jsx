import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

import DonationsTable from "../shared/DonationsTable";
import DonationDetailsModal from "../Modal/DonationDetailsModal";
import Loader from "../../UI/Loader";
import { Link } from "react-router";

const DonorOverviewPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch only latest 3 donation requests for the donor
  const {
    data: rawDonations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-donations-request", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-donations-request?email=${user.email}&limit=3`
      );
      return res.data;
    },
  });

  const donations = rawDonations.slice(0, 3);
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
    <div>
      <div className="mb-6 text-primary max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-secondary">Welcome back,</span> <br />{" "}
          {user.displayName}!
        </h1>
        <p className="text-lg opacity-80 text-secondary">
          Here’s a quick overview of your recent blood donation activities.
        </p>
      </div>
      <h2 className="text-2xl font-semibold mb-6">
        🩸 Your Recent Donation Requests
      </h2>

      {donations.length === 0 ? (
        <p className="text-secondary">You have no recent donation requests.</p>
      ) : (
        <DonationsTable donations={donations} onDetailsClick={handleDetails} />
      )}
      <Link
        to={`my-donation-request`}
        className="btn w-full btn-secondary rounded-b-xl text-base-200 uppercase"
      >
        view my all request
      </Link>
      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donation={selectedDonation}
      />
    </div>
  );
};

export default DonorOverviewPage;
