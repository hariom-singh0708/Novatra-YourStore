// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset successful:", form.password);
    // 👉 API call to reset password using token from URL
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded-4 animate__animated animate__fadeInDown"
        style={{ width: "400px", background: "#fff" }}
      >
        <h3 className="text-center mb-3 fw-bold animate__animated animate__fadeIn animate__delay-1s">
          Reset Password
        </h3>
        <p className="text-center small text-secondary animate__animated animate__fadeIn animate__delay-2s">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-3 position-relative animate__animated animate__fadeInLeft animate__delay-3s">
            <FaLock className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type="password"
              className="form-control ps-5"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3 position-relative animate__animated animate__fadeInRight animate__delay-4s">
            <FaLock className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type="password"
              className="form-control ps-5"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-semibold rounded-3 animate__animated animate__pulse animate__infinite"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center mt-3 animate__animated animate__fadeInUp animate__delay-5s">
          <a href="/login" className="text-decoration-none">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
