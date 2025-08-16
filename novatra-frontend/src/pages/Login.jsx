import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('login')); // notify navbar
      toast.success('Login successful!');
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'merchant') navigate('/merchant/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card shadow-lg p-4 rounded-4 animate__animated animate__fadeInDown" style={{ width: 400 }}>
        <h3 className="text-center mb-4 fw-bold animate__animated animate__fadeIn animate__delay-1s">
          Welcome Back
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative animate__animated animate__fadeInLeft animate__delay-2s">
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

          <div className="mb-3 position-relative animate__animated animate__fadeInRight animate__delay-3s">
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
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold animate__animated animate__pulse animate__infinite rounded-3"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0 text-secondary animate__animated animate__fadeInUp animate__delay-4s">
          Don’t have an account? <a href="/register" className="text-decoration-none fw-semibold">Register</a>
        </p>

        <p className="text-center mt-2 mb-0 animate__animated animate__fadeInUp animate__delay-5s">
          <a href="/forgot-password" className="text-decoration-none small">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
