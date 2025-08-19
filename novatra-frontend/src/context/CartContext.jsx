import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from API
 const fetchCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, skipping cart fetch.");
    setCart([]); // fallback to empty cart
    return;
  }

  try {
    const { data } = await api.get("/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Ensure cart is always an array
    setCart(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to fetch cart:", err.response?.data?.message || err.message);
    setCart([]); // fallback to empty cart
  }
};


 
 // Add product to cart (frontend + backend)
const addToCart = async (product) => {
  try {
    // Make API call to save in DB
    const { data } = await api.post("/cart", { productId: product._id, quantity: 1 });

    // Update local state with DB response
    setCart(Array.isArray(data) ? data : []);

    // Show toast
    toast.success(`${product.name} added to cart`, { autoClose: 1200 });
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to add to cart");
  }
};


  // Update quantity via API
  const updateCart = async (productId, quantity) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update cart");
    } finally {
      setLoading(false);
    }
  };

  // Increment quantity
  const incrementQuantity = async (productId) => {
  const item = cart.find(c => c.product._id === productId);
  if (!item) return;

  await updateCart(productId, item.quantity + 1);
  toast.success("Quantity increased", { autoClose: 1200 });
};

// Decrement quantity
const decrementQuantity = async (productId) => {
  const item = cart.find(c => c.product._id === productId);
  if (!item) return;

  if (item.quantity > 1) {
    await updateCart(productId, item.quantity - 1);
    toast.info("Quantity decreased", { autoClose: 1200 });
  } else {
    await removeFromCart(productId);
  }
};

  // Remove item from cart
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(Array.isArray(data) ? data : []);
      toast.success("Item removed from cart");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

// inside CartContext.jsx

const clearCart = async () => {
  try {
    // Clear cart in backend DB
    await api.post("/cart/clear"); // your backend route that clears user cart
    // Clear cart in frontend state
    setCart([]);
    toast.success("Cart cleared!");
  } catch (err) {
    console.error("Failed to clear cart:", err);
    toast.error("Failed to clear cart. Try again.");
  }
};

  // Total price (defensive)
  const totalPrice = Array.isArray(cart)
    ? cart.reduce(
        (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
        0
      )
    : 0;

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCart,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        totalPrice,
        clearCart, // ✅ add this
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
