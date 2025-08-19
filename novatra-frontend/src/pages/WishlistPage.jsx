import React from "react";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product);
      removeFromWishlist(product._id);
      toast.success("Moved to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to move item");
    }
  };

  return (
    <div className="container py-5">
      {/* Title */}
      <motion.h2
        className="fw-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <i className="fa-solid fa-heart text-danger me-2"></i> My Wishlist
      </motion.h2>

      {/* Empty Wishlist */}
      {wishlist.length === 0 ? (
        <motion.div
          className="text-center text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <i className="fa-regular fa-heart fa-3x mb-3"></i>
          <p className="mb-3">Your wishlist is empty. Start adding products ❤️</p>

          {/* Shop Now Button */}
          {/* Shop Now Button */}
<motion.div
  initial={{ scale: 0.9 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
>
  <Link
    to="/products"
    className="btn btn-primary rounded-pill px-4 shadow-sm"
  >
    <i className="fa-solid fa-store me-2"></i> Shop Now
  </Link>
</motion.div>

        </motion.div>
      ) : (
        <div className="row g-3">
          {wishlist.map((product) => (
            <div key={product._id} className="col-6 col-md-4 col-lg-3">
              <motion.div
                className="card h-100 shadow-sm border-0 rounded-4 wishlist-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                {/* Image */}
                <div className="ratio ratio-1x1 bg-light position-relative">
                  <img
                    src={product?.images?.[0] || "https://via.placeholder.com/400x400?text=Novatra"}
                    alt={product.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                  {/* Heart Remove */}
                  <button
                    className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                    onClick={() => removeFromWishlist(product._id)}
                    style={{ width: 32, height: 32, padding: 0 }}
                  >
                    <i className="fa-solid fa-heart text-danger"></i>
                  </button>
                </div>

                {/* Content */}
                <div className="card-body p-2 d-flex flex-column">
                  <h6
                    className="card-title text-truncate fw-semibold mb-1"
                    title={product.name}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {product.name}
                  </h6>
                  <p className="mb-2 text-primary fw-bold" style={{ fontSize: "0.85rem" }}>
                    ₹{product.price}
                  </p>

                  <div className="mt-auto d-grid gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleMoveToCart(product)}
                    >
                      <i className="fa-solid fa-cart-plus me-1"></i> Move to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
