import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-40 bg-base-100">
      <span className="loading loading-spinner text-primary scale-200"></span>
    </div>
  );
};

export default Loader;
