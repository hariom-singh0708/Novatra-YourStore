import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="py-5 hero-gradient border-bottom">
      <div className="container py-5">
        <div className="row align-items-center g-4">
          {/* Left Content */}
          <div className="col-lg-6 text-center text-lg-start">
            <motion.h1
              className="display-4 fw-bold mb-3 text-dark"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Discover. <span className="text-primary">Shop.</span> Smile.
            </motion.h1>

            <motion.p
              className="lead text-muted mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              A smooth, elegant and blazing fast shopping experience. Curated
              products from verified merchants only.
            </motion.p>

            <motion.div
              className="d-flex gap-3 justify-content-center justify-content-lg-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {/* Primary Button */}
              <Link
                to="/products"
                className="btn btn-lg px-4 fw-semibold shadow-sm"
                style={{
                  borderRadius: "30px",
                  background:
                    "linear-gradient(90deg, #007bff 0%, #00c6ff 100%)",
                  border: "none",
                }}
              >
                <i className="fa-solid fa-bag-shopping me-2"></i> Shop Now
              </Link>

              {/* Secondary Outline Button */}
              <Link
                to="/products"
                className="btn btn-lg px-4 fw-semibold btn-outline-primary"
                style={{ borderRadius: "30px" }}
              >
                <i className="fa-solid fa-star me-2"></i> Explore
              </Link>
            </motion.div>
          </div>

          {/* Right Image */}
          <div className="col-lg-6 text-center">
            <motion.div
              className="position-relative d-inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <img
                className="img-fluid rounded-4 shadow-lg"
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop"
                alt="Hero"
              />
              <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill text-bg-primary p-3 shadow badge-glow">
                ✨ New
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
