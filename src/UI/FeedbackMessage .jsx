import React from "react";

const FeedbackMessage = ({ title, message }) => {
  return (
    <div className="container mx-auto px-4 font-poppins">
      <div className="p-10 space-y-2 my-10 rounded-box bg-base-100">
        <h1 className="text-4xl font-grand-hotel text-center text-primary">
          {title}
        </h1>
        <p className="text-center opacity-80">{message}</p>
      </div>
    </div>
  );
};

export default FeedbackMessage;
