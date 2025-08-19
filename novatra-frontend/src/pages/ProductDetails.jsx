import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { motion } from "framer-motion";
import { FaCartPlus, FaArrowLeft } from "react-icons/fa";

export default function ProductDetails() {
  const { id } = useParams();
  const { selected, fetchProductDetails, loading } = useProducts();
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    fetchProductDetails(id);
  }, [id]);

  useEffect(() => {
    if (selected?.images?.length) {
      setMainImage(selected.images[0]);
    }
  }, [selected]);

  if (loading || !selected)
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  return (
    <section className="container py-5 animate__animated animate__fadeIn">
      <div className="row g-5 align-items-start">
        {/* Thumbnails & Main Image */}
        <motion.div
          className="col-12 col-lg-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="d-flex flex-column flex-md-row gap-3">
            {/* Thumbnails */}
            {selected.images?.length > 1 && (
              <div className="d-flex flex-md-column gap-2 overflow-auto">
                {selected.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`img-thumbnail p-0 border-2 rounded-3 ${
                      img === mainImage ? "border-primary" : "border-light"
                    }`}
                    style={{ cursor: "pointer", width: "64px", height: "64px", objectFit: "cover" }}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-grow-1">
              <motion.div
                key={mainImage}
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-light rounded-4 shadow-sm overflow-hidden"
              >
                <img
                  src={mainImage || "https://via.placeholder.com/800x800?text=Novatra"}
                  className="img-fluid w-100 object-fit-cover"
                  alt={selected?.name}
                  style={{ maxHeight: "500px", objectFit: "cover" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          className="col-12 col-lg-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="fw-bold mb-3">{selected?.name}</h2>
          <p className="text-muted mb-4 fs-5">{selected?.description}</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="h3 fw-bold text-primary mb-0">
              ₹{selected?.price}
            </span>
            {selected?.stock > 0 ? (
              <span className="badge bg-success bg-opacity-10 text-success fw-medium rounded-pill px-3 py-2">
                In Stock
              </span>
            ) : (
              <span className="badge bg-danger bg-opacity-10 text-danger fw-medium rounded-pill px-3 py-2">
                Out of Stock
              </span>
            )}
          </div>

          <div className="d-flex flex-column flex-sm-row gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-4 py-2"
              onClick={() => addToCart(selected)}
              disabled={selected?.stock <= 0}
            >
              <FaCartPlus />
              Add to Cart
            </motion.button>

            <Link
              to="/products"
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 px-4 py-2"
            >
              <FaArrowLeft />
              Back to Products
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
