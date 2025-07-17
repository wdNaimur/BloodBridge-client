import React from "react";
import { Link } from "react-router";

const BannerSlide = ({ backgroundImage, title, subtitle, buttonText, to }) => {
  return (
    <div
      className="hero rounded-2xl overflow-hidden 2xl:min-h-[700px] xl:min-h-[550px] min-h-[500px] object-cover"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-overlay opacity-40"></div>
      <div className="hero-content text-neutral-content text-center py-16">
        <div className="xl:max-w-2xl md:max-w-xl max-w-lg px-4 -mt-20">
          <h1 className="mb-4 md:text-5xl xl:text-6xl text-4xl font-bold">
            {title}
          </h1>
          <p className="mb-5 text-base md:text-lg xl:text-xl opacity-90 max-w-[90%] mx-auto">
            {subtitle}
          </p>
          <Link
            to={to}
            className="btn rounded-xl btn-primary text-base-200 text-md   border-none shadow-none"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerSlide;
