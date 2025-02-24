import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Your Health, <br />
          Our Responsibility
        </h1>
        <p style={{fontSize: "1.2rem"}}>
          We believe that quality healthcare should be easily accessible to
          everyone. Our platform connects patients with experienced doctors,
          ensuring a seamless appointment booking experience. With a commitment
          to efficiency and patient care, we strive to make healthcare more
          convenient, reliable, and stress-free. Whether it’s a routine check-up
          or a specialized consultation, we are here to simplify your journey
          toward better health.
        </p>
      </div>
      <div className="hero-img">
        <img src={image} alt="hero" />
      </div>
    </section>
  );
};

export default Hero;
