import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroBanner from "../components/HeroBanner.jsx";
import ProductCard from "../components/ProductCard.jsx";
import "animate.css";

export default function Home() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
  }, [dispatch]);

  return (
    <>
      {/* Hero Section */}
      <HeroBanner />

      {/* Featured Section */}
      <section id="featured" className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 animate__animated animate__fadeInDown">
            <h3 className="fw-bold text-primary">✨ Featured Products</h3>
            <a
              href="/products"
              className="btn btn-outline-primary btn-sm rounded-pill"
            >
              View All
            </a>
          </div>

          {loading && (
            <p className="text-center text-muted animate__animated animate__fadeIn">
              Loading products...
            </p>
          )}

          <div className="row g-4">
            {list.map((p, idx) => (
              <div
                className="col-6 col-md-4 col-lg-3"
                key={p._id}
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="container my-5">
        <div className="row text-center g-4">
          <div className="col-md-4 animate__animated animate__fadeInLeft">
            <div className="card shadow-lg border-0 rounded-4 p-4 h-100 hover-shadow">
              <h5 className="fw-bold text-primary">🚀 Fast Delivery</h5>
              <p className="text-muted small">
                Get your orders delivered quickly and securely to your doorstep.
              </p>
            </div>
          </div>
          <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="card shadow-lg border-0 rounded-4 p-4 h-100 hover-shadow">
              <h5 className="fw-bold text-success">⭐ Premium Products</h5>
              <p className="text-muted small">
                Only the best quality products from verified merchants.
              </p>
            </div>
          </div>
          <div className="col-md-4 animate__animated animate__fadeInRight animate__delay-2s">
            <div className="card shadow-lg border-0 rounded-4 p-4 h-100 hover-shadow">
              <h5 className="fw-bold text-danger">🔒 Secure Payments</h5>
              <p className="text-muted small">
                Transactions powered by Razorpay with end-to-end encryption.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
