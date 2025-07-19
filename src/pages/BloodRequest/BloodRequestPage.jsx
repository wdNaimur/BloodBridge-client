import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../UI/Loader";
import { BiDonateBlood } from "react-icons/bi";
import { format } from "date-fns";
import { Link } from "react-router";
import FeedbackMessage from "../../UI/FeedbackMessage ";
import PageHeader from "../../UI/PageHeader";
import ScrollFadeIn from "../../UI/ScrollFadeIn";
import Pagination from "../../UI/Pagination";

const BloodRequestPage = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    document.title = "BloodBridge | Blood Request";
    window.scrollTo(0, 0);
  }, [currentPage]);

  const {
    data: fullData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bloodDonations", currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bloodDonations?page=${currentPage}&limit=${12}`
      );
      return res.data;
    },
  });
  const [requests, setRequests] = useState([]);

  console.log(currentPage);
  const pageCount = fullData.pageCount;
  const pages = [...Array(pageCount).keys()];
  console.log(pages);
  useEffect(() => {
    if (fullData?.donations) {
      setRequests(fullData.donations);
    }
  }, [fullData]);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-red-500 text-center mt-8">
        Failed to load donation requests.
      </p>
    );

  return (
    <ScrollFadeIn>
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
                    <span className="font-medium">Location:</span>{" "}
                    {req.district}, {req.upazila}
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
            <Pagination
              pages={pages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </ScrollFadeIn>
  );
};

export default BloodRequestPage;
