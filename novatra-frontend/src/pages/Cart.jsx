import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const currency = (value = 0) =>
  `₹${Number(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.25 } },
};

const CartPage = () => {
  const { cart, incrementQuantity, decrementQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  if (!cart || cart.length === 0)
    return (
      <div className="container mt-5 text-center">
        <FiShoppingCart size={50} className="text-secondary mb-2" />
        <h4>Your cart is empty</h4>
        <p className="text-muted">Add items to get started.</p>
        <div>
          <Button variant="outline-secondary" onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
      
    );

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Your Cart</h2>
        <small className="text-muted">{cart.length} items</small>
      </div>

      <AnimatePresence>
        {cart.map((item) => {
          const { _id, name, price } = item.product;
          const qty = item.quantity;

          return (
            <motion.div
              key={_id}
              layout
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={itemVariants}
              className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm bg-white"
              data-aos="fade-up"
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-primary"
                  style={{ width: 48, height: 48 }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Link
                    to={`/product/${_id}`}
                    className="h5 mb-1 text-decoration-none text-dark"
                  >
                    {name}
                  </Link>
                  <div className="text-muted small">
                    Price: <strong>{currency(price)}</strong>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <Button variant="light" size="sm" onClick={() => decrementQuantity(_id)}>
                  <FiMinus />
                </Button>

                <span className="mx-3 fw-bold">{qty}</span>

                <Button variant="light" size="sm" onClick={() => incrementQuantity(_id)}>
                  <FiPlus />
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  className="ms-3 d-flex align-items-center gap-1"
                  onClick={() => removeFromCart(_id)}
                >
                  <FiTrash2 />
                  <span className="d-none d-sm-inline">Remove</span>
                </Button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="d-flex justify-content-between align-items-center mt-4 p-3 border rounded shadow-sm bg-light flex-column flex-md-row gap-2">
        <div>
          <div className="text-muted small">Order total</div>
          <h4 className="mb-0">{currency(totalPrice)}</h4>
        </div>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
