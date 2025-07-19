import React, { useState } from "react";
import { Link } from "react-router";
import DeleteDonationModal from "../Modal/DeleteDonationModal";
import useRole from "../../hooks/useRole";
import FeedbackMessage from "../../UI/FeedbackMessage ";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

const DonationsTable = ({ donations, onDetailsClick }) => {
  // Correct state variable names for modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [role, isRoleLoading] = useRole();

  const statusClassMap = {
    pending: "badge-warning",
    inprogress: "badge-info",
    done: "badge-success",
    canceled: "badge-error",
  };

  const handleDeleteClick = (donation) => {
    setSelectedId(donation._id);
    setModalOpen(true);
  };

  if (!donations || donations.length === 0) {
    return (
      <FeedbackMessage
        title="No Donation Requests Found"
        message="There are no donation requests to display at the moment. They will appear here when available."
        buttonText="Create Donation Request"
        to="/dashboard/create-donation-request"
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl shadow-xl shadow-primary/5">
        <table className="table table-zebra w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th className="min-w-40">Recipient</th>
              <th className="min-w-48">Location</th>
              <th className="text-center min-w-32">Date</th>
              <th className="text-center min-w-24">Time</th>
              <th className="text-center">Blood Group</th>
              <th className="text-center min-w-32">Donor Info</th>
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
                  <td className="font-medium text-base">
                    {donation.recipientName}
                  </td>
                  <td>
                    <span className="flex flex-col">
                      <span className="inline-flex">
                        {donation.hospitalName},
                      </span>
                      <span className="font-bold opacity-80">
                        {donation.upazila}, {donation.district}
                      </span>
                    </span>
                  </td>
                  <td className="text-center">{dateStr}</td>
                  <td className="text-center">{timeStr}</td>
                  <td className="text-center">{donation.bloodGroup}</td>
                  <td className="text-center">
                    {donation.status === "done" ||
                    donation.status === "inprogress" ? (
                      <span className="flex flex-col">
                        <span className="font-bold opacity-80 text-center">
                          {donation.donator?.donorName}
                        </span>
                        <span className="text-center">
                          {donation.donator?.donorEmail}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex">unavailable</span>
                    )}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge uppercase font-medium scale-90 ${
                        statusClassMap[donation.status] || "badge-ghost"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="flex gap-2">
                      <button
                        onClick={() => onDetailsClick(donation)}
                        className="btn rounded-xl btn-xs btn-outline btn-primary hover:text-base-200"
                      >
                        <BsThreeDots />
                      </button>
                      {(role === "admin" || role === "donor") && (
                        <Link
                          to={`/dashboard/update-donation-request/${donation._id}`}
                          className="btn rounded-xl btn-xs btn-outline btn-primary hover:text-base-200"
                        >
                          <MdEdit />
                        </Link>
                      )}

                      {(role === "admin" || role === "donor") && (
                        <button
                          onClick={() => handleDeleteClick(donation)}
                          className="btn rounded-xl btn-xs btn-outline btn-primary"
                        >
                          <MdDelete />
                        </button>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal receives modalOpen and selectedId properly */}
      <DeleteDonationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        donationId={selectedId}
      />
    </>
  );
};

export default DonationsTable;
