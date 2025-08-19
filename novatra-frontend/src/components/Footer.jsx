import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-3 mt-5 shadow-sm animate__animated animate__fadeInUp">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
        <div className="mb-2 mb-md-0">
          <h6 className="fw-bold text-primary mb-0">Novatra Store</h6>
          <small className="text-muted">Your one-stop shop for all amazing products.</small>
        </div>
        <div className="mb-2 mb-md-0">
          <a href="#" className="text-dark me-3 d-inline-block" aria-label="Facebook">
            <FaFacebook size={20} className="hover-icon" />
          </a>
          <a href="#" className="text-dark me-3 d-inline-block" aria-label="Twitter">
            <FaTwitter size={20} className="hover-icon" />
          </a>
          <a href="#" className="text-dark d-inline-block" aria-label="Instagram">
            <FaInstagram size={20} className="hover-icon" />
          </a>
        </div>
        <div>
          <small className="text-muted">
            © {new Date().getFullYear()} <span className="fw-semibold">Novatra Store</span>. All Rights Reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
