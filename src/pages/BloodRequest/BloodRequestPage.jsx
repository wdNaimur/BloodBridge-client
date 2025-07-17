import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../UI/Loader";
import { BiDonateBlood } from "react-icons/bi";
import { format } from "date-fns";
import { Link } from "react-router";
import FeedbackMessage from "../../UI/FeedbackMessage ";
import PageHeader from "../../UI/PageHeader";

const BloodRequestPage = () => {
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    document.title = "BloodBridge | Blood Request";
    window.scrollTo(0, 0);
  }, []);

  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bloodDonations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bloodDonations");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-red-500 text-center mt-8">
        Failed to load donation requests.
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {requests.length === 0 ? (
        <FeedbackMessage
          title="No Donation Requests Found"
          message="There are currently no donation requests available. Please check back later or explore other options."
        />
      ) : (
        <div>
          <PageHeader
            icon={BiDonateBlood}
            title="Blood Donation Requests"
            subtitle="View urgent blood donation requests and help save lives."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-primary/5 rounded-xl p-5 space-y-2 relative overflow-hidden"
              >
                <p className="text-lg font-bold text-primary">
                  {req.recipientName}
                </p>
                <p>
                  <span className="font-medium">Blood Group:</span>{" "}
                  <span className="text-red-500">{req.bloodGroup}</span>
                </p>
                <p className="absolute -top-12 -right-6 text-9xl text-primary opacity-20 font-black tracking-tighter font-Sora">
                  {req.bloodGroup}
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
                    className="btn btn-sm rounded-xl text-secondary/80 shadow-none border-none hover:bg-primary/10"
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
