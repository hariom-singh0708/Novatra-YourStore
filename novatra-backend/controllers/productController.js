const Product = require('../models/Product');

// ==================== PRODUCT CRUD ====================

// @desc    Create a product (Merchant)
// @route   POST /api/products
// @access  Private (Merchant)
const createProduct = async (req, res) => {
  try {
    // If merchant, ensure they are approved (middleware double-checks but this is a safeguard)
    if (req.user.role === 'merchant' && !req.user.isApproved) {
      return res.status(403).json({ message: 'Merchant account not approved by admin.' });
    }

    const { name, description, price, category, images, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      images,
      stock,
      merchant: req.user.role === 'merchant' ? req.user._id : undefined // admin-created products can have no merchant or set manually
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    let { category, minPrice, maxPrice, keyword, sortBy, order, page, limit } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }

    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;

    let sort = {};
    if (sortBy) {
      order = order === 'desc' ? -1 : 1;
      sort[sortBy] = order;
    } else {
      sort.createdAt = -1; // default newest first
    }

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('merchant', 'storeName');

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('merchant', 'storeName');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Merchant)
// @route   PUT /api/products/:id
// @access  Private (Merchant)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // If merchant, only allow if they own and are approved
    if (req.user.role === 'merchant') {
      if (!req.user.isApproved) return res.status(403).json({ message: 'Merchant not approved' });
      if (product.merchant && product.merchant.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied: not your product' });
      }
    }

    // If admin, allowed to update any product
    const { name, description, price, category, images, stock } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (images) product.images = images;
    if (stock !== undefined) product.stock = stock;

    await product.save();
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete a product (Merchant)
// @route   DELETE /api/products/:id
// @access  Private (Merchant)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role === 'merchant') {
      if (!req.user.isApproved) return res.status(403).json({ message: 'Merchant not approved' });
      if (product.merchant && product.merchant.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied: not your product' });
      }
    }

    // admin may delete any product
    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
