import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router";

const ContactSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Set user email on mount or when user changes
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    const payload = {
      ...formData,
      websiteName: "BloodBridge",
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        payload,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      )
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: user.email || "",
          subject: "",
          message: "",
        });
      })
      .catch((error) => {
        toast.error("Failed to send message. Please try again.");
        console.error(error);
      });
  };

  return (
    <section className="bg-base-100 h-full text-secondary px-4 py-12 lg:px-20">
      <div className="container mx-auto px-4 grid grid-cols-2 gap-5">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-6">Contact Us</h1>
          <p className="text-lg mb-8">
            Got a question, feedback, or collaboration idea? We'd love to hear
            from you! Fill out the form below and we’ll get back to you soon.
          </p>
        </div>

        <form
          className="grid grid-cols-1 gap-4 bg-base-200 py-5 px-10 rounded-xl shadow-primary/5 shadow-xl"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block mb-1 font-semibold">Your Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input w-full focus:outline-primary/50 focus:border-none border-primary/40 border-none bg-primary/10"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Your Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              disabled
              placeholder={
                user ? "Logged-in email" : "Login required to send message"
              }
              className="input w-full bg-base-100 text-secondary border-primary/40 cursor-not-allowed"
            />
            {!user && (
              <p className="text-sm text-error mt-1">
                Please log in to send a message.
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Subject</label>
            <input
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              className="input w-full focus:outline-primary/50 focus:border-none border-primary/40 border-none bg-primary/10"
              placeholder="Subject of your message"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="textarea w-full focus:outline-primary/50 focus:border-none border-primary/40 border-none bg-primary/10"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          {user ? (
            <button
              type="submit"
              className="btn btn-primary text-base-200 shadow-none border-none w-fit px-8"
            >
              Send Message
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="btn btn-secondary text-base-200 shadow-none border-none w-fit px-8"
            >
              Sign in to send message
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
