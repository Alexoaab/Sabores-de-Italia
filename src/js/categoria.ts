import "../scss/base.scss";
import "../scss/categoria.scss";
import AOS from "aos";
import "aos/dist/aos.css";

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("[data-aos]")) {
    AOS.init({
      duration: 800,
      once: false
    });
  }
});