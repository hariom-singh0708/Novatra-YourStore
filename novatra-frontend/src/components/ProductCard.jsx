import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Login to add to cart");
      return;
    }
    try {
      await addToCart(product);
    } catch (err) {
      console.error(err);
    }
  };

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  return (
    <div
      className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
      style={{
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Product Image */}
      <div className="ratio ratio-1x1 bg-light">
        <img
          src={product?.images?.[0] || "https://via.placeholder.com/600x600?text=Novatra"}
          alt={product.name}
          loading="lazy"
          className="w-100 h-100 object-fit-cover"
        />
      </div>

      {/* Content */}
      <div className="card-body d-flex flex-column p-3">
        {/* Title */}
        <h6
          className="card-title text-truncate fw-semibold mb-2"
          title={product.name}
          style={{ fontSize: "0.95rem" }}
        >
          {product.name}
        </h6>

        {/* Price & Stock */}
        <div className="d-flex align-items-center gap-2 mb-3 small">
          <span className="fw-bold text-primary fs-6">₹{product.price}</span>
          {product.stock > 0 ? (
            <span className="badge bg-success-subtle text-success rounded-pill px-2">
              In Stock
            </span>
          ) : (
            <span className="badge bg-secondary-subtle text-muted rounded-pill px-2">
              Out of Stock
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
          {/* View */}
          <Link
            to={`/product/${product._id}`}
            className="btn btn-outline-primary btn-sm flex-grow-1"
          >
            View
          </Link>

          {/* Cart */}
          <button
            className="btn btn-primary btn-sm flex-grow-1"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <i className="fa-solid fa-cart-plus me-2"></i>
            Cart
          </button>

          {/* Wishlist (tiny heart) */}
          <button
            className="btn btn-light btn-sm rounded-circle shadow-sm"
            style={{ width: "36px", height: "36px" }}
            onClick={() => toggleWishlist(product)}
          >
            <i
              className={`fa-heart ${isWishlisted ? "fa-solid text-danger" : "fa-regular text-secondary"}`}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
}
