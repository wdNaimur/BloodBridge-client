import React from "react";
import {
  FaHeartbeat,
  FaUserInjured,
  FaClock,
  FaUserPlus,
} from "react-icons/fa";
import SectionHeader from "../../../UI/SectionHeader";

const FeaturedStatsSection = () => {
  const stats = [
    {
      id: 1,
      icon: <FaHeartbeat className="text-4xl text-primary mb-4" />,
      number: "25,000+",
      label: "People need blood annually in Bangladesh",
    },
    {
      id: 2,
      icon: <FaUserInjured className="text-4xl text-primary mb-4" />,
      number: "Thousands",
      label: "Of urgent blood requests go unmet daily",
    },
    {
      id: 3,
      icon: <FaClock className="text-4xl text-primary mb-4" />,
      number: "Lives",
      label: "Are at risk due to blood shortages",
    },
    {
      id: 4,
      icon: <FaUserPlus className="text-4xl text-primary mb-4" />,
      number: "Few minutes",
      label: "To register and become a lifesaving donor",
    },
  ];

  return (
    <section className="container mx-auto py-16 px-4 text-center text-secondary">
      <SectionHeader
        title="Why Register as a Donor?"
        subtitle="Thousands need your help. Join BloodBridge and save lives."
      />

      <div className="flex flex-wrap w-full gap-5 justify-center">
        {stats.map(({ id, icon, number, label }) => (
          <div
            key={id}
            className="bg-base-200 p-6 rounded-2xl shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 transition flex flex-col justify-center items-center cursor-default flex-1 sm:min-w-[18rem] min-w-full"
          >
            <span>{icon}</span>
            <h3 className="text-3xl font-bold mb-1">{number}</h3>
            <p className="text-base max-w-xs">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedStatsSection;
