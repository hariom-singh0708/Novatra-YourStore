import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-4 mt-5 shadow-sm animate__animated animate__fadeInUp">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
        
        {/* Brand Info */}
        <div className="mb-3 mb-md-0">
          <h5 className="fw-bold text-primary mb-1" style={{ fontSize: "1.2rem" }}>
            Novatra Store
          </h5>
          <small className="text-muted" style={{ fontSize: "0.95rem" }}>
            Your one-stop shop for all amazing products.
          </small>
        </div>

        {/* Social Icons */}
        <div className="mb-3 mb-md-0">
          <a href="https://www.instagram.com/thakur_sahab2407/" className="text-dark me-3 d-inline-block" aria-label="Instagram">
            <FaInstagram size={22} className="hover-icon" />
          </a>
          <a href="https://www.linkedin.com/in/hariom-singh-8179b0293/" className="text-dark me-3 d-inline-block" aria-label="LinkedIn">
            <FaLinkedin size={22} className="hover-icon" />
          </a>
          <a href="https://github.com/hariom-singh0708" className="text-dark d-inline-block" aria-label="GitHub">
            <FaGithub size={22} className="hover-icon" />
          </a>
        </div>

        {/* Copyright */}
        <div>
          <small className="text-muted" style={{ fontSize: "0.9rem" }}>
            © {new Date().getFullYear()} <span className="fw-semibold">Novatra Store</span>. All Rights Reserved.
          </small>
        </div>
      </div>

      <style jsx>{`
        .hover-icon {
          transition: 0.3s;
        }
        .hover-icon:hover {
          color: #007bff;
          transform: scale(1.2);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
