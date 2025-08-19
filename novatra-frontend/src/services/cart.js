import api from "./api";

// Get user's cart
export const getCart = () => api.get("/cart");

// Add item to cart
export const addToCart = ({ productId, quantity }) =>
  api.post("/cart", { productId, quantity });

// Update cart item quantity
export const updateCartItem = (productId, { quantity }) =>
  api.put(`/cart/${productId}`, { quantity });

// Remove item from cart
export const removeFromCart = (productId) =>
  api.delete(`/cart/${productId}`);
