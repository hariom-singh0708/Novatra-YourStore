import React, { useEffect } from "react";
import HeroBanner from "../components/HeroBanner.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useProducts } from "../context/ProductContext.jsx";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const { list, loading, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts({ limit: 12 });
  }, []);

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const slides = chunkArray(list, 4);

  return (
    <>
      <HeroBanner />

      <section className="py-5 bg-light" id="featured">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4 px-4">
            <h3 className="fw-bold text-primary mb-0">✨ Featured Products</h3>
            <Link to="/products" className="btn btn-outline-primary btn-sm">
              View More
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-muted">Loading products...</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Carousel controls indicators={false} interval={5000} fade={false}>
                {slides.map((group, idx) => (
                  <Carousel.Item key={`slide-${idx}`}>
                    <div className="d-flex justify-content-center gap-3 px-3">
                      {group.map((product) => (
                        <div
                          key={`product-${product._id}`}
                          style={{ flex: "0 0 auto", width: "280px", minHeight: "380px" }}
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
    </>
  );
}
