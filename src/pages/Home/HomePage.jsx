import React, { useEffect } from "react";
import Banner from "../../components/Home/banner/Banner";
import ScrollFadeIn from "../../UI/ScrollFadeIn";

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
    </div>
  );
};

export default HomePage;
