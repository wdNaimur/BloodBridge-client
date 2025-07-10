import React, { useEffect, useState } from "react";
import { FaDonate } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import FundingForm from "./FundingForm";

const FundingPage = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);
  const [fundings, setFundings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [admin, setAdmin] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (admin) {
      axiosSecure
        .get("/fundings")
        .then((res) => setFundings(res.data))
        .catch(() => toast.error("Failed to fetch fundings"));
    }
  }, [axiosSecure, admin]);

  const totalPages = Math.ceil(fundings.length / itemsPerPage);
  const paginatedData = fundings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Determine final donation amount
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

      {/* Donation Options */}
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
                className="radio radio-primary cursor-pointer"
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
            {/* Custom Radio */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="donation"
                value="custom"
                className="radio radio-primary cursor-pointer"
                checked={selectedAmount === "custom"}
                onChange={() => setSelectedAmount("custom")}
              />
              <span>Custom:</span>
            </label>
            {/* Custom Input Box */}
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

      {/* Trigger Donate Modal */}
      <div className="mb-8">
        <button
          onClick={handleDonateClick}
          className="btn btn-primary text-base-200 cursor-pointer shadow-none border-none"
        >
          Contribute to BloodBridge
        </button>
      </div>

      {/* Donation Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-lg font-semibold mb-4">Proceed to Donate</h3>
          <Elements stripe={stripePromise}>
            <FundingForm amount={getFinalAmount()} />
          </Elements>
        </div>
      </dialog>

      {/* ADMIN: Total Raised + Table */}
      {admin && (
        <div>
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-md mb-6 text-primary font-medium shadow">
            Total Raised: $
            {fundings
              .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
              .toFixed(2)}
          </div>

          {/* Table */}
          <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Donor Name</th>
                  <th className="px-6 py-4">Amount (USD)</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((fund, idx) => (
                  <tr key={fund._id} className="border-b text-sm">
                    <td className="px-6 py-3">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-3">
                      {fund.donorName || "Anonymous"}
                    </td>
                    <td className="px-6 py-3">${fund.amount}</td>
                    <td className="px-6 py-3">
                      {new Date(fund.date).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No funding records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === idx + 1
                      ? "bg-rose-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FundingPage;
