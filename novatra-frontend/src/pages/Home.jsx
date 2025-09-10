import React, { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useProducts } from "../context/ProductContext.jsx";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const { list, loading, fetchProducts } = useProducts();
  const [timeLeft, setTimeLeft] = useState(3600); // Flash sale countdown (1 hour)

  useEffect(() => {
    fetchProducts({ limit: 20 });

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const featured = chunkArray(list.slice(0, 8), 4);

  return (
    <>
      <HeroBanner />

      {/* Featured Products */}
      <section className="py-5 bg-light" id="featured">
  <div className="container-fluid text-center">
    {/* Centered Heading */}
    <h3 className="fw-bold text-primary mb-3 display-6">
      ✨ Featured Products
    </h3>

    {/* Styled View More Button */}
    <div className="mb-4">
      <Link
        to="/products"
        className="btn btn-primary px-4 py-2 fw-bold shadow-sm"
        style={{
          borderRadius: "30px",
          background: "linear-gradient(90deg, #007bff, #00c6ff)",
          border: "none",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseEnter={(e) =>
          (e.target.style.background = "linear-gradient(90deg, #0056b3, #0096c7)")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "linear-gradient(90deg, #007bff, #00c6ff)")
        }
      >
        View More →
      </Link>
    </div>

    {loading ? (
      <div className="d-flex justify-content-center gap-3 px-3">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: "0 0 auto",
              width: "280px",
              minHeight: "380px",
            }}
            className="bg-secondary bg-opacity-25 rounded"
          />
        ))}
      </div>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Carousel controls indicators={false} interval={5000} fade={false}>
          {featured.map((group, idx) => (
            <Carousel.Item key={`slide-${idx}`}>
              <div className="d-flex justify-content-center gap-3 px-3">
                {group.map((product) => (
                  <div
                    key={`product-${product._id}`}
                    style={{
                      flex: "0 0 auto",
                      width: "280px",
                      minHeight: "380px",
                    }}
                    className="shadow-sm rounded"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </motion.div>
    )}
  </div>
</section>



      {/* Customer Testimonials */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="fw-bold text-primary mb-4">💬 What Our Customers Say</h3>
          <div className="row g-4">
            {[
              {
                text: "Amazing quality and fast delivery. Highly recommend!",
                author: "– Rahul S.",
              },
              {
                text: "Customer support was very helpful and polite. 5 stars!",
                author: "– Anjali P.",
              },
              {
                text: "Great prices compared to others, and the products last long.",
                author: "– Mohit K.",
              },
            ].map((review, idx) => (
              <div key={idx} className="col-md-4">
                <div className="p-4 shadow-sm rounded bg-white h-100">
                  <p>"{review.text}"</p>
                  <h6 className="fw-bold mt-3">{review.author}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="fw-bold text-primary mb-4">🌟 Why Choose Us</h3>
          <div className="row g-4">
            {[
              {
                title: "🚚 Fast Shipping",
                desc: "Quick and reliable delivery across India.",
              },
              {
                title: "💎 Premium Quality",
                desc: "We offer only trusted and durable products.",
              },
              {
                title: "🤝 Customer First",
                desc: "24/7 support to help you anytime.",
              },
            ].map((value, idx) => (
              <div key={idx} className="col-md-4">
                <div className="p-4 shadow-sm rounded bg-white h-100">
                  <h5 className="fw-bold">{value.title}</h5>
                  <p className="text-muted mb-0">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h3 className="fw-bold text-primary mb-3">📧 Stay Updated</h3>
          <p className="mb-4">Subscribe to our newsletter and get 10% off your first order!</p>
          <form className="d-flex justify-content-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control w-50"
              required
            />
            <button type="submit" className="btn btn-primary fw-bold">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
