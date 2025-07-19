import React, { useEffect, useState } from "react";
import { FaDonate } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import FundingForm from "./FundingForm";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../hooks/useRole";
import Loader from "../../UI/Loader";
import PageHeader from "../../UI/PageHeader";
import ScrollFadeIn from "../../UI/ScrollFadeIn";
import FeedbackMessage from "../../UI/FeedbackMessage ";
import useAuth from "../../hooks/useAuth";
import Pagination from "../../UI/Pagination";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

const FundingPage = () => {
  const [selectedAmount, setSelectedAmount] = useState("");
  const { user } = useAuth();
  const [customAmount, setCustomAmount] = useState("");
  const axiosSecure = useAxiosSecure();
  const [role, isRoleLoading] = useRole();

  // Pagination state (0-based)
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    document.title = "BloodBridge | Funding";
    window.scrollTo(0, 0);
  }, [role, user?.email, page]);

  // Fetch fundings with pagination
  const { data, isLoading } = useQuery({
    queryKey: ["fundings", role, user?.email, page],
    queryFn: async () => {
      if (!role || !user?.email)
        return {
          fundings: [],
          totalPages: 0,
          totalItems: 0,
          totalDonationAmount: 0,
        };
      const res = await axiosSecure.get(
        `/fundings?role=${role}&email=${user.email}&page=${
          page + 1
        }&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const fundings = data?.fundings || [];
  const totalPages = data?.totalPages || 0;
  const totalDonationAmount = data?.totalDonationAmount || 0;

  const getFinalAmount = () => {
    if (selectedAmount === "custom") {
      return customAmount ? parseFloat(customAmount) : "";
    }
    return parseFloat(selectedAmount);
  };

  const handleDonateClick = () => {
    const amount = getFinalAmount();
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please select a valid donation amount first.");
    } else {
      document.getElementById("my_modal_3").showModal();
    }
  };

  if (isRoleLoading || isLoading) {
    return <Loader />;
  }

  return (
    <ScrollFadeIn>
      <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen">
        <PageHeader
          icon={FaDonate}
          title={`Support BloodBridge`}
          subtitle={`Your donation helps us run blood donation campaigns, maintain emergency
          services, and save lives. Every dollar builds a bridge between giving
          and living.`}
        />

        {/* Donation UI */}
        <div className="mb-4">
          <p className="font-medium text-secondary mb-2 text-xl">
            Choose a donation amount:
          </p>
          <div className="flex flex-wrap sm:flex-row gap-4 text-md items-center min-h-10">
            {[100, 200, 500].map((amount) => (
              <label
                key={amount}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="donation"
                  value={amount}
                  className="radio radio-primary"
                  checked={selectedAmount === `${amount}`}
                  onChange={(e) => {
                    setSelectedAmount(e.target.value);
                    setCustomAmount("");
                  }}
                />
                <span>৳{amount}</span>
              </label>
            ))}
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="donation"
                  value="custom"
                  className="radio radio-primary"
                  checked={selectedAmount === "custom"}
                  onChange={() => setSelectedAmount("custom")}
                />
                <span>Custom:</span>
              </label>
              {selectedAmount === "custom" && (
                <input
                  type="number"
                  className="input bg-primary/10 border-primary/20 w-24 text-lg focus:ring-0 focus:outline-primary/40"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="৳"
                  min={1}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <button
            onClick={handleDonateClick}
            className="btn rounded-xl btn-primary text-base-200 shadow-none border-none"
          >
            Contribute to BloodBridge
          </button>
        </div>

        {/* Stripe Modal */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-semibold mb-4">Proceed to Donate</h3>
            <Elements stripe={stripePromise}>
              <FundingForm amount={getFinalAmount()} />
            </Elements>
          </div>
        </dialog>

        {/* Total Fund Summary from backend (for admin/volunteer) */}
        {(role === "admin" || role === "volunteer") && (
          <div className="text-right text-lg font-semibold mt-10 mb-3">
            Total Raised:{" "}
            <span className="text-primary">৳{totalDonationAmount}</span>
          </div>
        )}

        {/* Funding Table */}
        {isLoading ? (
          <Loader />
        ) : fundings.length === 0 ? (
          <FeedbackMessage
            title="No Donations Yet"
            message="You haven't made any donations so far. Donate to BloodBridge and make a life-saving impact today."
          />
        ) : (
          <>
            <div className="overflow-x-auto bg-base-100 rounded-xl shadow-primary/5 shadow-xl">
              <table className="table">
                <thead>
                  <tr className="bg-primary text-base-100">
                    <th>#</th>
                    <th>Donor Name</th>
                    <th>Amount (৳)</th>
                    <th>Funding Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fundings.map((fund, index) => (
                    <tr key={fund._id}>
                      <td>{page * limit + index + 1}</td>
                      <td>{fund.name}</td>
                      <td>৳{fund.amount}</td>
                      <td>{new Date(fund.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              pages={[...Array(totalPages).keys()]}
              currentPage={page}
              setCurrentPage={setPage}
            />
          </>
        )}
      </div>
    </ScrollFadeIn>
  );
};

export default FundingPage;
