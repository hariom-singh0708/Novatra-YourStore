// src/pages/Register.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaUser, FaEnvelope, FaLock, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    storeName: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 👉 Submit Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/users/register", form);
      setUserId(res.data.userId);
      setOtpModal(true); // open OTP modal
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // 👉 Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.warning("Please enter OTP");
    setLoading(true);

    try {
      const res = await api.post("/users/verify-otp", { userId, otp });
      localStorage.setItem("token", res.data.token);
      toast.success("OTP verified! Logging in...");
      setOtpModal(false);
      navigate("/"); // redirect after login
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // 👉 Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/users/login-otp", { email: form.email });
      setUserId(res.data.userId);
      toast.info("OTP resent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="card shadow-lg p-4 rounded-4 animate__animated animate__fadeInDown"
        style={{ width: "400px", background: "#fff" }}
      >
        <h3 className="text-center mb-4 fw-bold animate__animated animate__fadeIn animate__delay-1s">
          Create Account
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3 position-relative animate__animated animate__fadeInLeft animate__delay-2s">
            <FaUser className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type="text"
              className="form-control ps-5"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3 position-relative animate__animated animate__fadeInRight animate__delay-3s">
            <FaEnvelope className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type="email"
              className="form-control ps-5"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative animate__animated animate__fadeInLeft animate__delay-4s">
            <FaLock className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type="password"
              className="form-control ps-5"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Selector */}
          <div className="mb-3 animate__animated animate__fadeInRight animate__delay-5s">
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>

          {/* Store Name (only for merchants) */}
          {form.role === "merchant" && (
            <div className="mb-3 position-relative animate__animated animate__fadeInUp animate__delay-6s">
              <FaStore className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
              <input
                type="text"
                className="form-control ps-5"
                name="storeName"
                placeholder="Store Name"
                value={form.storeName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 fw-semibold rounded-3 animate__animated animate__pulse animate__infinite"
          >
            {loading ? "Please wait…" : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-3 mb-0 text-secondary animate__animated animate__fadeInUp animate__delay-7s">
          Already have an account?{" "}
          <a href="/login" className="text-decoration-none fw-semibold">
            Login
          </a>
        </p>
      </div>

      {/* OTP Modal */}
      {otpModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 p-3">
              <h5 className="fw-bold text-center">Verify OTP</h5>
              <input
                type="text"
                className="form-control my-3 text-center"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="btn btn-success w-100 mb-2"
                disabled={loading}
                onClick={handleVerifyOtp}
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
              <button
                className="btn btn-outline-primary w-100"
                disabled={loading}
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
