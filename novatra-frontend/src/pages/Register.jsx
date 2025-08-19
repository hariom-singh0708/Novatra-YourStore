// src/pages/Register.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaEnvelope, FaLock, FaUser, FaStore } from "react-icons/fa";
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
    storeName: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.role === "merchant" && { storeName: form.storeName }),
      });

      toast.success(res.data.message || "Registered successfully!");
      navigate("/verify-otp", { state: { userId: res.data.userId } }); // or redirect to OTP verification page
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
        <h3 className="text-center mb-4 fw-bold">Create Account</h3>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3 position-relative">
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
          <div className="mb-3 position-relative">
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
          <div className="mb-3 position-relative">
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

          {/* Role Selection */}
          <div className="mb-3">
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>

          {/* Store Name (only for merchants) */}
          {form.role === "merchant" && (
            <div className="mb-3 position-relative">
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
            className="btn btn-primary w-100 py-2 fw-semibold rounded-3"
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0 text-secondary">
          Already have an account?{" "}
          <a href="/login" className="fw-semibold text-decoration-none">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
