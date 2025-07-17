import React from "react";
import {
  FaSearchLocation,
  FaUserCheck,
  FaHandHoldingHeart,
  FaUsers,
} from "react-icons/fa";
import SectionHeader from "../../../UI/SectionHeader";

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      icon: <FaSearchLocation className="text-4xl text-primary mb-4" />,
      title: "Find Donors",
      description:
        "Select your blood group and location to search for active and nearby donors instantly.",
    },
    {
      id: 2,
      icon: <FaUserCheck className="text-4xl text-primary mb-4" />,
      title: "Send Request",
      description:
        "Choose a matching donor and send a blood donation request directly from your dashboard.",
    },
    {
      id: 3,
      icon: <FaHandHoldingHeart className="text-4xl text-primary mb-4" />,
      title: "Donate & Save Lives",
      description:
        "Meet at the hospital, complete the donation, and make a life-saving difference.",
    },
    {
      id: 4,
      icon: <FaUsers className="text-4xl text-primary mb-4" />,
      title: "Join the Movement",
      description:
        "Be part of a growing community of life-savers. Register as a donor and make an impact when it’s needed most.",
    },
  ];

  return (
    <section className="container mx-auto py-16 px-4 text-center text-secondary">
      <SectionHeader
        title="How BloodBridge Works"
        subtitle="Find donors, request blood, and save lives — all in a few simple steps."
      />

      <div className="flex flex-wrap w-full gap-5">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-base-200 p-6 rounded-2xl shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 transition flex flex-col justify-center items-center cursor-default flex-1 sm:min-w-80 min-w-full"
          >
            <span>{step.icon}</span>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-base">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
