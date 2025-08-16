// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link requested for:", email);
    // 👉 API call to request password reset
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded-4 animate__animated animate__fadeInDown"
        style={{ width: "400px", background: "#fff" }}
      >
        <h3 className="text-center mb-3 fw-bold animate__animated animate__fadeIn animate__delay-1s">
          Forgot Password
        </h3>
        <p className="text-center small text-secondary animate__animated animate__fadeIn animate__delay-2s">
          Enter your registered email to get a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative animate__animated animate__fadeInLeft animate__delay-3s">
            <FaEnvelope className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type="email"
              className="form-control ps-5"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold rounded-3 animate__animated animate__pulse animate__infinite"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-3 animate__animated animate__fadeInUp animate__delay-4s">
          <a href="/login" className="text-decoration-none">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
