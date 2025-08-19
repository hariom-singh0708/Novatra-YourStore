import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "animate.css";

export default function NotFound() {
  const gifUrl = "https://media.giphy.com/media/UoeaPqYrimha6rdTFV/giphy.gif"; // Fun 404 GIF

  return (
    <section className="container d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <motion.img
        src={gifUrl}
        alt="404 Not Found"
        className="mb-4 animate__animated animate__fadeInDown"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "300px", borderRadius: "10px" }}
      />

      <motion.h1
        className="display-4 fw-bold animate__animated animate__fadeIn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p
        className="text-muted mb-4 animate__animated animate__fadeInUp"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Oops! Looks like this page went missing.
      </motion.p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/" className="btn btn-primary px-4 py-2">
          ⬅️ Back to Home
        </Link>
      </motion.div>
    </section>
  );
}
