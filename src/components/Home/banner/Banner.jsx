import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import BannerSlide from "./BannerSlide";
import "./Banner.css";

const Banner = () => {
  const bannerData = [
    {
      backgroundImage: "https://i.ibb.co/sLrjxQd/banner1.png",
      title: "Be the Lifeline. Donate Blood, Save Lives.",
      subtitle:
        "Join thousands across the nation making a real difference every day",
      buttonText: "Join as a Donor",
    },
    {
      backgroundImage: "https://i.ibb.co/fzfkNS1d/banner2.png",
      title: "A Simple Process. A Life-Changing Impact",
      subtitle:
        "Register, respond to requests, and help someone in need – in just minutes.",
      buttonText: "Create Request",
    },
    {
      backgroundImage: "https://i.ibb.co/LXSyT1BK/banner3.png",
      title: "Every Drop Has a Story. Be Part of It.",
      subtitle: "Your donation could be the reason someone sees tomorrow.",
      buttonText: "View Requests",
    },
  ];

  return (
    <Swiper
      spaceBetween={30}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{
        clickable: true,
      }}
      loop={true}
      modules={[Autoplay, Pagination]}
      className="mySwiper rounded-2xl"
    >
      {bannerData.map((slide, index) => (
        <SwiperSlide key={index}>
          <BannerSlide {...slide} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
