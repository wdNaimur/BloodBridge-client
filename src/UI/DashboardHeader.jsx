import React from "react";

const DashboardHeader = ({ title, subtitle, icon }) => {
  return (
    <div className="mb-6 border-b-4 border-dashed border-secondary/20">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 flex items-center gap-2">
        {icon && <span className="text-primary text-4xl">{icon}</span>}
        {title}
      </h1>
      {subtitle && (
        <p className="text-secondary opacity-80 max-w-xl mb-4">{subtitle}</p>
      )}
    </div>
  );
};

export default DashboardHeader;

// Use
// import icon
// import component
/* 
<DashboardHeader
        title="My Profile"
        subtitle="View and manage your personal information securely."
        icon={<FaUserCircle />}
      />
      */
