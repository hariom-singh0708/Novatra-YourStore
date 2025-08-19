import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaStore, FaUser, FaShoppingCart, FaSignOutAlt, FaSearch, FaHeart } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx"; // 👈 New Hook

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist(); // 👈 Get wishlist state

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle search
  // Handle search
const handleSearch = (e) => {
  e.preventDefault();
  if (search.trim()) {
    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    setSearch(""); // clear input after search
  } else {
    navigate("/products"); // if empty, go to products page
  }
};


  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Total cart & wishlist count
  const cartQty = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const wishlistQty = wishlist.length;

  // Dashboard link based on role
  const dashboardHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "merchant"
        ? "/merchant"
        : "/user";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top animate__animated animate__fadeInDown">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <FaStore className="me-2" />
          Novatra Store
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          {/* Left menu */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link active fw-semibold">
                Home
              </Link>
            </li>
          </ul>

          {/* Search */}
          <form
            className="d-flex my-3 my-lg-0 mx-lg-auto flex-grow-1"
            style={{ maxWidth: 600 }}
            onSubmit={handleSearch}
          >
            <input
              className="form-control me-2 rounded-pill"
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-primary rounded-pill" type="submit">
              <FaSearch />
            </button>
          </form>

          {/* Right Buttons */}
          <div className="d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-dark me-2">
                  <FaUser /> Login
                </Link>
                <Link to="/register" className="btn btn-outline-dark">
                  <FaUser /> Register
                </Link>
              </>
            ) : (
              <>
                <Link to={dashboardHref} className="btn btn-light me-2 fw-semibold">
                  <i className="fa fa-user"></i> Welcome, {user?.name?.split(" ")[0] || "User"}
                </Link>

                {/* Wishlist Button */}
                <Link to="/wishlist" className="btn btn-light me-2 position-relative">
                  <FaHeart className="text-danger" />
                  {wishlistQty > 0 && (
                    <span
                      className="position-absolute translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.75rem", top: "4px", left:"80%"}}  // 👈 yaha adjust karo
                    >
                      {wishlistQty}
                    </span>
                  )}
                </Link>

                {/* Cart Button */}
                <Link to="/cart" className="btn btn-light me-2 position-relative me-3">
                  <FaShoppingCart />
                  {cartQty > 0 && (
                    <span
                      className="position-absolute translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.75rem", top: "4px", left:"80%"}}  // 👈 yaha adjust karo
                    >
                      {cartQty}
                    </span>
                  )}
                </Link>


                <button
                  onClick={handleLogout}
                  className="btn btn-danger d-flex align-items-center"
                >
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
