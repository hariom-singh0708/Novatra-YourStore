const Product = require('../models/Product');

// ==================== PRODUCT CRUD ====================

// @desc    Create a product (Merchant)
// @route   POST /api/products
// @access  Private (Merchant/Admin)
const createProduct = async (req, res) => {
  try {
    if (req.user.role === 'merchant' && !req.user.isApproved) {
      return res.status(403).json({ message: 'Merchant account not approved by admin.' });
    }

    const { name, description, price, category, images = [], stock = 0 } = req.body;

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      images,
      stock: Number(stock),
      merchant: req.user.role === 'merchant' ? req.user._id : undefined
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, keyword, sortBy, order } = req.query;
    let filter = {};

    // Filters
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (keyword) filter.name = { $regex: keyword, $options: "i" };

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // default newest first
    }

    // Fetch all products (no limit)
    const products = await Product.find(filter).sort(sort).populate("merchant", "storeName");

    res.status(200).json({
      products,
      total: products.length
    });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Merchant/Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role === 'merchant') {
      if (!req.user.isApproved) return res.status(403).json({ message: 'Merchant not approved' });
      if (product.merchant && product.merchant.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied: not your product' });
      }
    }

    const { name, description, price, category, images, stock } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category) product.category = category;
    if (images) product.images = images;
    if (stock !== undefined) product.stock = Number(stock);

    await product.save();
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Merchant/Admin)
const deleteProduct = async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role === 'merchant') {
      if (!req.user.isApproved) {
        return res.status(403).json({ message: 'Merchant not approved' });
      }
      if (product.merchant && product.merchant.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied: not your product' });
      }
    }

    await Product.findByIdAndDelete(req.params.id); // ✅ safer than product.remove()

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Delete Product Error:", error);
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
