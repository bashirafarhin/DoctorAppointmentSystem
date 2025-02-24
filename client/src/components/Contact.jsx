import React, { useState } from "react";
import "../styles/contact.css";
import toast from "react-hot-toast";

const Contact = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formDetails;

    if (!name || !email || !message) {
      return toast.error("All fields are required");
    }
    setTimeout(() => {
      toast.success("Form submitted successfully!");
      setFormDetails({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <section className="register-section flex-center" id="contact">
      <div className="contact-container flex-center contact">
        <h2 className="form-heading">Contact Us</h2>
        <form className="register-form" onSubmit={formSubmit}>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            value={formDetails.name}
            onChange={inputChange}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <textarea
            name="message"
            className="form-input"
            placeholder="Enter your message"
            value={formDetails.message}
            onChange={inputChange}
            rows="8"
            cols="12"
          ></textarea>

          <button type="submit" className="btn form-btn">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
