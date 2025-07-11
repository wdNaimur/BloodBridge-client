import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../UI/Loader";
import { FaTint } from "react-icons/fa";
import { format } from "date-fns";
import { Link } from "react-router";
import toast from "react-hot-toast";
import FeedbackMessage from "../../UI/FeedbackMessage ";

const BloodRequestPage = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["bloodDonations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bloodDonations");
      return res.data;
    },
  });

  const handleGiveBlood = async (id) => {
    try {
      const res = await axiosSecure.post(`/donations/accept/${id}`);
      if (res.data?.insertedId || res.data?.success) {
        toast.success("You have committed to donate!");
        refetch();
      } else {
        toast.error(res.data?.message || "Could not accept the request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-red-500 text-center mt-8">
        Failed to load donation requests.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {requests.length === 0 ? (
        <FeedbackMessage
          title="No Donation Requests Found"
          message="There are currently no donation requests available. Please check back later or explore other options."
        />
      ) : (
        <div>
          <h1 className="text-3xl font-semibold text-primary flex items-center gap-2 mb-8">
            <FaTint className="text-red-500" /> Blood Donation Requests
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-primary/5 rounded-2xl p-5 space-y-2 backdrop-blur"
              >
                <p className="text-lg font-bold text-primary">
                  {req.recipientName}
                </p>
                <p>
                  <span className="font-medium">Blood Group:</span>{" "}
                  <span className="text-red-500">{req.bloodGroup}</span>
                </p>
                <p>
                  <span className="font-medium">Location:</span> {req.district},{" "}
                  {req.upazila}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {format(new Date(req.donationDateTime), "PPP")}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {format(new Date(req.donationDateTime), "p")}
                </p>
                <p>
                  <span className="font-medium">Requested by:</span>{" "}
                  {req.requesterName}
                </p>

                <div className="pt-1">
                  <Link
                    to={`${req._id}`}
                    className="btn btn-xs btn-primary rounded-full text-base-200 shadow-none border-none"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequestPage;
