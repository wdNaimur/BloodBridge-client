import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DonationDetailsModal from "../../components/Modal/DonationDetailsModal";

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

      {donations.length === 0 ? (
        <p className="text-secondary">
          You haven't submitted any donations yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-xl shadow-primary/5">
          <table className="table table-zebra w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th className="min-w-32">Recipient</th>
                <th>District</th>
                <th>Upazila</th>
                <th className="min-w-32">Hospital</th>
                <th className="text-center">Blood Group</th>
                <th className="text-center min-w-32">Date</th>
                <th className="text-center min-w-24">Time</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => {
                const dateTime = new Date(donation.donationDateTime);
                const dateStr = dateTime.toLocaleDateString("en-BD", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const timeStr = dateTime.toLocaleTimeString("en-BD", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <tr key={donation._id} className="text-secondary">
                    <td>{index + 1}</td>
                    <td>{donation.recipientName}</td>
                    <td>{donation.district}</td>
                    <td>{donation.upazila}</td>
                    <td>{donation.hospitalName}</td>
                    <td className="text-center">{donation.bloodGroup}</td>
                    <td className="text-center">{dateStr}</td>
                    <td className="text-center">{timeStr}</td>
                    <td className="text-center">
                      <span
                        className={`badge uppercase font-medium scale-90 ${
                          donation.status === "Approved"
                            ? "badge-success"
                            : donation.status === "Rejected"
                            ? "badge-error"
                            : "badge-warning"
                        }`}
                      >
                        {donation.status || "Not Found"}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDetails(donation)}
                        className="btn rounded-xl btn-xs btn-outline btn-primary"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donation={selectedDonation}
      />
    </div>
  );
};

export default MyDonationRequestPage;
