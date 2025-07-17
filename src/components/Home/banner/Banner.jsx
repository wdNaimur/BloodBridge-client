import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import BannerSlide from "./BannerSlide";
import "./Banner.css";
import useAuth from "../../../hooks/useAuth";

const Banner = () => {
  const { user } = useAuth();
  const bannerData = user?.email
    ? [
        {
          backgroundImage: "https://i.ibb.co/sLrjxQd/banner1.png",
          title: "Looking for a Donor?",
          subtitle: "Easily search for verified blood donors in your area.",
          buttonText: "Search Donors",
          to: "/search",
        },
        {
          backgroundImage: "https://i.ibb.co/fzfkNS1d/banner2.png",
          title: "Respond to Urgent Requests Near You",
          subtitle: "Browse current donation needs and make a difference now.",
          buttonText: "View Requests",
          to: "/blood-requests",
        },
        {
          backgroundImage: "https://i.ibb.co/LXSyT1BK/banner3.png",
          title: "Update Your Availability",
          subtitle:
            "Help us match you with those in need by keeping your donor info up to date.",
          buttonText: "Edit Profile",
          to: "/dashboard/profile",
        },
      ]
    : [
        {
          backgroundImage: "https://i.ibb.co/sLrjxQd/banner1.png",
          title: "Looking for a Donor?",
          subtitle: "Easily search for verified blood donors in your area.",
          buttonText: "Search Donors",
          to: "/search",
        },
        {
          backgroundImage: "https://i.ibb.co/fzfkNS1d/banner2.png",
          title: "Respond to Urgent Requests Near You",
          subtitle: "Browse current donation needs and make a difference now.",
          buttonText: "View Requests",
          to: "/blood-requests",
        },
        {
          backgroundImage: "https://i.ibb.co/LXSyT1BK/banner3.png",
          title: "Be the Lifeline. Donate Blood, Save Lives.",
          subtitle:
            "Join thousands across the country making a difference every day.",
          buttonText: "Join as a Donor",
          to: "/signUp",
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
