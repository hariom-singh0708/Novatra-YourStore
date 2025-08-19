// src/pages/VerifyOtp.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaKey } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId; // passed from Register page
  const { loginWithToken } = useAuth();
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.warning("Please enter OTP");
    if (!userId) return toast.error("User ID missing. Please register again.");

    setLoading(true);
    try {
      const res = await api.post("/users/verify-otp", { userId, otp });
      await loginWithToken(res.data.token);
      toast.success("OTP verified successfully!");
      navigate("/"); // redirect to user dashboard
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
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
        <h3 className="text-center mb-4 fw-bold">Verify OTP</h3>

        <form onSubmit={handleVerify}>
          {/* OTP Input */}
          <div className="mb-3 position-relative">
            <FaKey className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
            <input
              type="text"
              className="form-control ps-5 text-center"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-success w-100 py-2 fw-semibold rounded-3"
          >
            {loading ? "Verifying…" : "Verify OTP"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0 text-secondary">
          Didn’t receive OTP?{" "}
          <a href="/register" className="fw-semibold text-decoration-none">
            Register again
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
