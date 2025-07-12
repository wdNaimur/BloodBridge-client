import React from "react";

const PageHeader = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="mb-4">
      <h1 className="text-3xl font-semibold text-primary flex items-center gap-2">
        {Icon && <Icon className="text-primary" />}
        {title}
      </h1>
      {subtitle && (
        <p className="text-secondary opacity-70 mt-2 max-w-xl">{subtitle}</p>
      )}
    </div>
  );
};

export default PageHeader;

// use
// <PageHeader icon={FaTint} title="Blood Donation Requests" subtitle="View urgent blood donation requests and help save lives." />
// need to import the icon in used page.
