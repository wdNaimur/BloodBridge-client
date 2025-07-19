import React from "react";
import { Link } from "react-router";

const FeedbackMessage = ({ title, message, buttonText, to }) => {
  return (
    <div className="container mx-auto px-4 font-poppins">
      <div className="p-10 space-y-4 my-10 rounded-box bg-base-100">
        <h1 className="text-4xl font-grand-hotel text-center text-primary">
          {title}
        </h1>
        <p className="text-center opacity-80">{message}</p>

        {buttonText && to && (
          <div className="text-center mt-2">
            <Link
              to={to}
              className="btn rounded-xl px-6 py-2 btn-secondary text-base-200 border-none shadow-none"
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackMessage;
