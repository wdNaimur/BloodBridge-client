import React from "react";
import {
  FaUsers,
  FaUserShield,
  FaHandsHelping,
  FaTint,
  FaHandHoldingUsd,
  FaBriefcaseMedical,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/overview");
      return res.data;
    },
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "bdt",
      minimumFractionDigits: 0,
    }).format(amount);

  const statCards = [
    {
      title: "Total Users",
      count: data?.totalUsers || 0,
      icon: <FaUsers className="text-4xl text-primary" />,
    },
    {
      title: "Blood Requests",
      count: data?.totalRequests || 0,
      icon: <FaBriefcaseMedical className="text-4xl text-primary" />,
    },
    {
      title: "Total Funding",
      count: formatCurrency(data?.totalFunding || 0),
      icon: <FaHandHoldingUsd className="text-4xl text-primary" />,
    },
    {
      title: "Total Admins",
      count: data?.totalAdmins || 0,
      icon: <FaUserShield className="text-4xl text-primary" />,
    },
    {
      title: "Total Volunteers",
      count: data?.totalVolunteers || 0,
      icon: <FaHandsHelping className="text-4xl text-primary" />,
    },
    {
      title: "Total Donors",
      count: data?.totalDonors || 0,
      icon: <FaTint className="text-4xl text-primary" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center py-4">
        Failed to load overview stats.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-xl shadow-lg shadow-primary/5 p-6 flex items-center gap-5 bg-base-200"
          >
            <div className="shrink-0">{card.icon}</div>
            <div>
              <p className="text-3xl font-bold text-secondary">{card.count}</p>
              <p className="text-sm font-medium text-secondary/70 mt-1">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
