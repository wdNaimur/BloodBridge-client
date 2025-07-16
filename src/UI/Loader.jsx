import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center scale-200  z-50 bg-base-100 top-0 left-0">
      <span className="loading loading-spinner text-primary"></span>
    </div>
  );
};

export default Loader;
