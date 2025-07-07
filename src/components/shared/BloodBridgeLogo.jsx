import React from "react";
import { Link } from "react-router";

const BloodBridgeLogo = () => {
  return (
    <Link to="/" className="select-none flex items-center">
      <img
        className="h-12"
        src="/images/logo/BloodBridgeLogo.png"
        alt="BloodBridgeLogo"
      />
      <h6 className="font-black font-Sora text-4xl relative z-10 sm:block hidden">
        BloodBridge
      </h6>
    </Link>
  );
};

export default BloodBridgeLogo;
