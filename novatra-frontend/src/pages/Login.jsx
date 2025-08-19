import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch {}
    finally { setLoading(false); }
  };

  const handleRequestOTP = async () => {
    if (!form.email) return toast.warning("Enter your email first");
    setLoading(true);
    try {
      const id = await requestOTP(form.email);
      setUserId(id);
      setOtpModal(true);
    } catch {}
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.warning("Enter OTP");
    setLoading(true);
    try {
      await verifyOTP(userId, otp);
      setOtpModal(false);
      navigate("/");
    } catch {}
    finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      await loginWithGoogle(res.credential);
      navigate("/");
    } catch {}
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
          <h3 className="text-center mb-4 fw-bold">Welcome Back</h3>

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

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Logging in…" : "Login"}
              </button>
            </form>
          ) : (
            <div>
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <button className="btn btn-primary w-100 mb-2" disabled={loading} onClick={handleRequestOTP}>
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>
            </div>
          )}

          <div className="text-center my-2">
            <p className="text-secondary">OR</p>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed")} />
          </div>

          <p className="text-center mt-3">
            {otpMode ? (
              <span onClick={() => setOtpMode(false)} style={{ cursor: "pointer" }}>
                Login with Password
              </span>
            ) : (
              <span onClick={() => setOtpMode(true)} style={{ cursor: "pointer" }}>
                Login with OTP
              </span>
            )}
          </p>
        </div>

        {/* OTP Modal */}
        {otpModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-3 rounded-4">
                <h5 className="text-center mb-3">Enter OTP</h5>
                <input
                  type="text"
                  className="form-control text-center mb-2"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="btn btn-success w-100" disabled={loading} onClick={handleVerifyOTP}>
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
