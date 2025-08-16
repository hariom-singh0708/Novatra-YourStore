// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import {
  FaStore,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch user if token exists
useEffect(() => {
  const fetchUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  fetchUser(); // on mount
  window.addEventListener("login", fetchUser);

  return () => window.removeEventListener("login", fetchUser);
}, []);



  const toggle = () => setIsOpen(!isOpen);
  const closeIfMobile = () => setIsOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
    closeIfMobile();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
    closeIfMobile();
  };

  const dashboardHref =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "merchant"
      ? "/merchant/dashboard"
      : "/user/dashboard";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top animate__animated animate__fadeInDown">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center" onClick={closeIfMobile}>
          <FaStore className="me-2" /> Novatra Store
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={toggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          {/* LEFT */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link active fw-semibold" onClick={closeIfMobile}>Home</Link>
            </li>
          </ul>

          {/* CENTER SEARCH */}
          <form className="d-flex my-3 my-lg-0 mx-lg-auto flex-grow-1" style={{ maxWidth: 600 }} onSubmit={handleSearch}>
            <input
              className="form-control me-2 rounded-pill w-100"
              type="search"
              placeholder="Search products..."
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-primary rounded-pill" type="submit">
              <FaSearch />
            </button>
          </form>

          {/* RIGHT */}
          <div className="d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-dark me-2" onClick={closeIfMobile}><FaUser /> Login</Link>
                <Link to="/register" className="btn btn-outline-dark" onClick={closeIfMobile}><FaUser /> Register</Link>
              </>
            ) : (
              <>
                <Link to={dashboardHref} className="btn btn-light me-2 fw-semibold" onClick={closeIfMobile}>
                  Welcome, {user?.name?.split(" ")[0] || "User"}
                </Link>
                {user?.role === "user" && (
                  <Link to="/cart" className="btn btn-light me-2" onClick={closeIfMobile}>
                    <FaShoppingCart /> Cart
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-danger d-flex align-items-center">
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
