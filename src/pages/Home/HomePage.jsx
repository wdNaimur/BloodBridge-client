import React, { useEffect } from "react";
import Banner from "../../components/Home/banner/Banner";
import ScrollFadeIn from "../../UI/ScrollFadeIn";
import ContactSection from "../../components/Home/Contact/ContactSection";
import HowItWorksSection from "../../components/Home/HowItWorks/HowItWorksSection";

const HomePage = () => {
  useEffect(() => {
    document.title = "BloodBridge | Home";
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="mt-6">
      <ScrollFadeIn>
        <Banner />
      </ScrollFadeIn>
      <ScrollFadeIn>
        <HowItWorksSection />
      </ScrollFadeIn>
      <ScrollFadeIn>
        <ContactSection />
      </ScrollFadeIn>
    </div>
  );
};

export default HomePage;
