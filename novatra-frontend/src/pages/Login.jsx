import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast, ToastContainer } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login, requestOTP, verifyOTP, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.warning("Please enter email and password");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Request OTP
  const handleRequestOTP = async () => {
    if (!form.email) return toast.warning("Enter your email first");
    setLoading(true);
    try {
      const id = await requestOTP(form.email);
      setUserId(id);
      setOtpModal(true);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) return toast.warning("Enter OTP");
    setLoading(true);
    try {
      await verifyOTP(userId, otp);
      setOtpModal(false);
      navigate("/");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleSuccess = async (res) => {
    try {
      await loginWithGoogle(res.credential);
      navigate("/");
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
          <h3 className="text-center mb-4 fw-bold">Welcome Back 👋</h3>

          {/* Password Login */}
          {!otpMode ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3 position-relative">
                <FaEnvelope className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
                <input
                  type="email"
                  className="form-control ps-5"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <button
                className="btn btn-primary w-100"
                disabled={loading || !form.email || !form.password}
              >
                {loading ? "Logging in…" : "Login"}
              </button>

              <div className="text-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-decoration-none small text-primary"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          ) : (
            // OTP Login
            <div>
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <button
                className="btn btn-primary w-100 mb-2"
                disabled={loading || !form.email}
                onClick={handleRequestOTP}
              >
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>
              {!form.email && (
                <small className="text-danger">Enter email to request OTP</small>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="px-2 text-muted small">or</span>
            <hr className="flex-grow-1" />
          </div>

          {/* Google Login */}
          <div className="text-center mb-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
            />
          </div>

          {/* Switch Login Mode */}
          <p className="text-center mt-3 mb-1">
            {otpMode ? (
              <span
                onClick={() => setOtpMode(false)}
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                Login with Password
              </span>
            ) : (
              <span
                onClick={() => setOtpMode(true)}
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                Login with OTP
              </span>
            )}
          </p>

          {/* Register Link */}
          <p className="text-center text-muted small">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="fw-semibold text-decoration-none text-primary"
            >
              Register here
            </Link>
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
              <div className="modal-content p-3 rounded-4">
                <h5 className="text-center mb-3">Enter OTP</h5>
                <input
                  type="text"
                  className="form-control text-center mb-2"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                  required
                />
                <button
                  className="btn btn-success w-100"
                  disabled={loading || !otp}
                  onClick={handleVerifyOTP}
                >
                  {loading ? "Verifying…" : "Verify OTP"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
