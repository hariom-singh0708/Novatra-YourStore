import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Save token
  const setToken = (token) => {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Clear token
  const clearToken = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  // Login with token
  const loginWithToken = async (token) => {
    try {
      setToken(token);
      const { data } = await api.get("/users/me"); // fetch full user
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch {
      clearToken();
      setUser(null);
    }
  };

  // Email/password login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      await loginWithToken(data.token);
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Request OTP
  const requestOTP = async (email) => {
    try {
      const { data } = await api.post("/users/login-otp", { email });
      toast.success("OTP sent to your email");
      return data.userId;
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP request failed");
      throw err;
    }
  };

  // Verify OTP
  const verifyOTP = async (userId, otp) => {
    try {
      const { data } = await api.post("/users/verify-otp", { userId, otp });
      await loginWithToken(data.token);
      toast.success("OTP verified! Logged in");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
      throw err;
    }
  };

  // Google login
  const loginWithGoogle = async (credential) => {
    try {
      const { data } = await api.post("/users/google-login", { credential });
      await loginWithToken(data.token);
      toast.success("Logged in with Google!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
      throw err;
    }
  };

  // Register user
  const register = async ({ name, email, password, role, storeName }) => {
    try {
      const { data } = await api.post("/users/register", { name, email, password, role, storeName });
      toast.success("OTP sent for verification");
      return data.userId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Logout
  const logout = () => {
    clearToken();
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out");
  };

  // On page load, rehydrate user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    const boot = async () => {
      try {
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          if (cachedUser) setUser(JSON.parse(cachedUser));
          const { data } = await api.get("/users/me");
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    boot();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        login,
        logout,
        register,
        requestOTP,
        verifyOTP,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
