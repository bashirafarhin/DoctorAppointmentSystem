import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img src={image} alt="hero" />
          </div>
          <div className="hero-content">
            <p style={{ fontSize: "1.2rem" }}>
              Welcome to our Doctor Appointment Booking System, your trusted
              platform for seamless healthcare access. Our mission is to bridge
              the gap between patients and healthcare professionals by providing
              a hassle-free way to book appointments with qualified doctors. We
              aim to simplify healthcare by offering a user-friendly interface,
              real-time appointment scheduling, and secure communication between
              patients and doctors. Whether you need a routine check-up or
              specialized medical consultation, our system ensures a smooth and
              efficient experience. Your health is our priority, and we are
              committed to making quality healthcare accessible to everyone.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
