import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center scale-200 -mt-20">
      <span className="loading loading-spinner text-primary"></span>
    </div>
  );
};

export default Loader;
