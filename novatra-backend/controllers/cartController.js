const User = require("../models/User");
const Product = require("../models/Product");

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to get cart", error: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity; // update qty
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save(); // ✅ crucial to persist in DB

    const populatedUser = await User.findById(req.user.id).populate("cart.product");
    res.status(200).json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const item = user.cart.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await user.save();

    const populatedUser = await User.findById(req.user.id).populate("cart.product");
    res.status(200).json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    await user.save();

    const populatedUser = await User.findById(req.user.id).populate("cart.product");
    res.status(200).json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart", error: err.message });
  }
};

exports.clearUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearUserCart error:", err);
    res.status(500).json({ message: err.message });
  }
};
