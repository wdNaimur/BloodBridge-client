import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DonationDetailsModal from "../../components/Modal/DonationDetailsModal";
import DonationsTable from "../../components/shared/DonationsTable";

const MyDonationRequestPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        `/my-donations-request?email=${user.email}`
      );
      return res.data;
    },
  });

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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">🩸 My Donations</h2>

      <DonationsTable donations={donations} onDetailsClick={handleDetails} />

      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donation={selectedDonation}
      />
    </div>
  );
};

export default MyDonationRequestPage;
