import React, { useEffect } from "react";
import DonorOverview from "../../components/Overview/DonorOverview";
import useRole from "../../hooks/useRole";
import Loader from "../../UI/Loader";
import AdminOverview from "../../components/Overview/AdminOverview";
import useAuth from "../../hooks/useAuth";
import ScrollFadeIn from "../../UI/ScrollFadeIn";

const OverViewPage = () => {
  const [role, isRoleLoading] = useRole();
  useEffect(() => {
    document.title = "BloodBridge | Overview";
    window.scrollTo(0, 0);
  }, []);
  const { user } = useAuth();
  if (isRoleLoading) {
    return <Loader />;
  }
  return (
    <ScrollFadeIn>
      <div className="mb-6 text-primary max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-secondary">Welcome back,</span> <br />{" "}
          {user.displayName}!
        </h1>
      </div>
      {role === "donor" && <DonorOverview />}
      {role === "admin" && <AdminOverview />}
      {role === "volunteer" && <AdminOverview />}
    </ScrollFadeIn>
  );
};

export default OverViewPage;
