import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./card.css";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const FundingForm = ({ amount }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // ✅ Get clientSecret from backend when amount changes
  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
          toast.error("Invalid amount for donation.");
          return;
        }

        const { data } = await axiosSecure.post("/create-payment-intent", {
          amount: numericAmount,
        });

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          toast.error("No client secret received from server.");
        }
      } catch (err) {
        console.error("Client secret error:", err);
        toast.error("Failed to initialize payment.");
      }
    };

    if (amount) {
      getClientSecret();
    }
  }, [axiosSecure, amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet.");
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Card element not found.");
      setProcessing(false);
      return;
    }

    const { error: methodError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (methodError) {
      console.error("Payment method error:", methodError);
      setCardError(methodError.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

    if (confirmError) {
      console.error("Payment failed:", confirmError);
      setCardError(confirmError.message);
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      toast.success("Thank you for your donation!");
      console.log("✅ Payment successful:", paymentIntent);

      // ✅ Save donation data to backend
      const donationData = {
        name: user?.displayName || "Anonymous",
        email: user?.email,
        amount: Number(amount),
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
        createdAt: new Date().toISOString(),
      };

      try {
        const res = await axiosSecure.post("/funding-donations", donationData);
        if (res.data.insertedId) {
          toast.success("Donation recorded successfully!");
        } else {
          toast.error("Payment succeeded, but failed to record donation.");
        }
      } catch (err) {
        console.error("❌ Failed to save donation to server:", err);
        toast.error("Payment succeeded, but donation save failed.");
      }

      // ✅ Reset form and close modal
      document.getElementById("my_modal_3")?.close();
      card.clear();
      setCardError(null);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />

      {cardError && <p className="text-sm text-red-600 mt-1">{cardError}</p>}

      <button
        type="submit"
        className="btn btn-primary w-full text-base-200 mt-4 text-base"
        disabled={!stripe || !clientSecret || processing}
      >
        {processing ? (
          <span className="loading loading-spinner text-primary"></span>
        ) : (
          `Donate ৳ ${amount}`
        )}
      </button>
    </form>
  );
};

export default FundingForm;
