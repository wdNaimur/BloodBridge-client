import React from "react";
import { FaTint } from "react-icons/fa";
import SectionHeader from "../../../UI/SectionHeader";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchRecentRequests = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/recentBloodDonation`
  );
  return res.data;
};

const RecentBloodRequests = () => {
  const navigate = useNavigate();

  const {
    data: requests,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recentBloodRequests"],
    queryFn: fetchRecentRequests,
  });

  if (isLoading) {
    return (
      <section className="container py-16 mx-auto px-4 text-secondary">
        <SectionHeader
          title="Recent Blood Requests"
          subtitle="See urgent blood needs in your community and help save lives."
        />
        <p className="text-center">Loading requests...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto py-16 px-4 text-secondary">
        <SectionHeader
          title="Recent Blood Requests"
          subtitle="See urgent blood needs in your community and help save lives."
        />
        <p className="text-center text-primary">Failed to load requests.</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 text-secondary bg-gradient-to-tl from-secondary/5 to-base-200 rounded-xl border-4 border-base-200">
      <div className="container mx-auto">
        <SectionHeader
          title="Recent Blood Requests"
          subtitle="See urgent blood needs in your community and help save lives."
        />

        <div className="flex flex-wrap w-full gap-5 justify-center">
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="bg-base-200 p-6 rounded-xl shadow hover:shadow-lg shadow-primary/5 transition cursor-pointer sm:min-w-80 min-w-full flex-1 relative overflow-hidden"
              >
                <div className="flex items-center mb-4">
                  <FaTint className="text-3xl text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold">
                    {request.recipientName}
                  </h3>
                </div>
                <p className="mb-1">
                  <strong>Blood Group:</strong> {request.bloodGroup}
                </p>
                <p className="mb-1">
                  <strong>Location:</strong> {request.upazila},{" "}
                  {request.district}
                </p>
                <p className="mb-4">
                  <strong>Date & Time:</strong>{" "}
                  {new Date(request.donationDateTime).toLocaleDateString()} at{" "}
                  {new Date(request.donationDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="absolute -top-12 -right-6 text-9xl text-primary opacity-20 font-black tracking-tighter font-Sora">
                  {request.bloodGroup}
                </p>
                <div className="pt-1">
                  <Link
                    to={`/blood-requests/${request._id}`}
                    className="btn btn-sm rounded-xl text-secondary/80 shadow-none border-none bg-secondary/20"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">
              No recent blood requests found.
            </p>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/blood-requests")}
            className="btn btn-outline rounded-xl text-primary hover:text-base-200 shadow-none btn-primary"
          >
            View All Requests
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecentBloodRequests;
