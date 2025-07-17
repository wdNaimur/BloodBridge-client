import React from "react";

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
        {title}
      </h2>
      <p className="text-base md:text-lg mx-auto text-secondary max-w-[80%] px-4 mb-6">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;
