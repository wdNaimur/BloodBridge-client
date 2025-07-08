import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyDonationRequestPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedDonation, setSelectedDonation] = useState(null);

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
    document.getElementById("donation_details_modal").showModal();
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
                <th>Recipient</th>
                <th>District</th>
                <th>Upazila</th>
                <th>Hospital</th>
                <th className="text-center">Blood Group</th>
                <th className="text-center">Date</th>
                <th className="text-center">Time</th>
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
                    <td className="min-w-30">{donation.recipientName}</td>
                    <td className="min-w-30">{donation.district}</td>
                    <td className="min-w-36">{donation.upazila}</td>
                    <td className="min-w-30">{donation.hospitalName}</td>
                    <td className="text-center">{donation.bloodGroup}</td>
                    <td className="min-w-28 text-center">{dateStr}</td>
                    <td className="min-w-28 text-center">{timeStr}</td>
                    <td className="min-w-28 text-center">
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
                    <td className="min-w-28 text-center">
                      <button
                        onClick={() => handleDetails(donation)}
                        className="btn btn-xs btn-outline btn-primary"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Donation Details Modal */}
          <dialog id="donation_details_modal" className="modal">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-2 text-primary">
                🩸 Donation Request Details
              </h3>
              {selectedDonation && (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-base-content">
                      Recipient:
                    </span>{" "}
                    {selectedDonation.recipientName}
                  </p>
                  <p>
                    <span className="font-medium text-base-content">
                      District:
                    </span>{" "}
                    {selectedDonation.district}
                  </p>
                  <p>
                    <span className="font-medium text-base-content">
                      Upazila:
                    </span>{" "}
                    {selectedDonation.upazila}
                  </p>
                  <p>
                    <span className="font-medium text-base-content">
                      Hospital:
                    </span>{" "}
                    {selectedDonation.hospitalName}
                  </p>
                  <p>
                    <span className="font-medium text-base-content">
                      Blood Group:
                    </span>{" "}
                    {selectedDonation.bloodGroup}
                  </p>
                  <p>
                    <span className="font-medium text-base-content">Date:</span>{" "}
                    {new Date(
                      selectedDonation.donationDateTime
                    ).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <span className="font-medium text-base-content">Time:</span>{" "}
                    {new Date(
                      selectedDonation.donationDateTime
                    ).toLocaleTimeString("en-BD", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <p>
                    <span className="font-medium text-base-content">
                      Status:
                    </span>{" "}
                    {selectedDonation.status || "Pending"}
                  </p>
                  <p>
                    <span className="font-medium text-base-content">
                      Message:
                    </span>{" "}
                    {selectedDonation.requestMessage || "No message"}
                  </p>
                </div>
              )}
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default MyDonationRequestPage;
