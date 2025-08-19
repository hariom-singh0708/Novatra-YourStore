import api from "./api";

// Get all products with optional filters and pagination
export const getProducts = (params = {}) => api.get("/products", { params });

// Get single product by ID
export const getProductById = (id) => api.get(`/products/${id}`);

// Create a new product (merchant/admin)
export const createProduct = (payload) => api.post("/products", payload);

// Update existing product
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);

// Delete a product
export const deleteProduct = (id) => api.delete(`/products/${id}`);
