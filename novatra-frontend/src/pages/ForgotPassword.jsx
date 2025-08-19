import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = reset
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/forgot-password", { email });
      setUserId(res.data.userId);
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.warning("Fill all fields");
    setLoading(true);
    try {
      await api.post("/users/reset-password", { userId, otp, newPassword });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
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
        <h3 className="text-center mb-4 fw-bold">Forgot Password</h3>

        {step === 1 ? (
          // Step 1: Request OTP
          <form onSubmit={handleRequestOtp}>
            <div className="mb-3 position-relative">
              <FaEnvelope className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
              <input
                type="email"
                className="form-control ps-5"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-semibold rounded-3"
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>
          </form>
        ) : (
          // Step 2: Reset Password
          <form onSubmit={handleResetPassword}>
            {/* OTP Input */}
            <div className="mb-3 position-relative">
              <FaKey className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            {/* New Password */}
            <div className="mb-3 position-relative">
              <FaLock className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
              <input
                type="password"
                className="form-control ps-5"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-success w-100 py-2 fw-semibold rounded-3"
            >
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center mt-3 mb-0 text-secondary">
          Remembered your password?{" "}
          <a href="/login" className="fw-semibold text-decoration-none">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
