import "../scss/base.scss";
import "../scss/home.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("[data-aos]")) {
    AOS.init({
      duration: 800,
      once: false
    });
  }

  const swiperContainer = document.querySelector(".swiper");

  if (swiperContainer) {
    new Swiper(".swiper", {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 }
      }
    });
  }
});