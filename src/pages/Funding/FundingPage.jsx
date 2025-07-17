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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

const FundingPage = () => {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const axiosSecure = useAxiosSecure();
  const [role, isRoleLoading] = useRole();
  useEffect(() => {
    document.title = "BloodBridge | Funding";
    window.scrollTo(0, 0);
  }, []);

  // Fetch all fundings
  const { data: fundings = [], isLoading } = useQuery({
    queryKey: ["fundings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/fundings");
      return res.data;
    },
  });

  // Calculate total
  const totalFund = fundings.reduce((acc, curr) => acc + curr.amount, 0);

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
  if (isRoleLoading) {
    return <Loader />;
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 flex items-center gap-2">
        <FaDonate className="text-primary" /> Support BloodBridge
      </h1>
      <p className="text-secondary opacity-80 max-w-xl mb-6">
        Your donation helps us run blood donation campaigns, maintain emergency
        services, and save lives. Every dollar builds a bridge between giving
        and living.
      </p>

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
          <div className=" flex gap-2">
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
          className="btn rounded-xl btn-primary text-base-200"
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

      {/* Total Fund Summary */}
      {role == "admin" ||
        (role == "volunteer" && (
          <div className="text-right text-lg font-semibold mt-10 mb-3">
            Total Raised: <span className="text-primary">৳{totalFund}</span>
          </div>
        ))}

      {/* Funding Table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
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
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  Loading fundings...
                </td>
              </tr>
            ) : fundings.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  No donations yet.
                </td>
              </tr>
            ) : (
              fundings.map((fund, index) => (
                <tr key={fund._id}>
                  <td>{index + 1}</td>
                  <td>{fund.name}</td>
                  <td>৳{fund.amount}</td>
                  <td>{new Date(fund.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundingPage;
