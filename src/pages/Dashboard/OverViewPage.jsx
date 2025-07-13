import React from "react";
import DonorOverview from "../../components/Overview/DonorOverview";
import useRole from "../../hooks/useRole";
import Loader from "../../UI/Loader";
import AdminOverview from "../../components/Overview/AdminOverview";

const OverViewPage = () => {
  const [role, isRoleLoading] = useRole();
  if (isRoleLoading) {
    return <Loader />;
  }
  return (
    <div>
      {role === "donor" && <DonorOverview />}
      {role === "admin" && <AdminOverview />}
    </div>
  );
};

export default OverViewPage;
