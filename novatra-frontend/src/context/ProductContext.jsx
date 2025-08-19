import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import {
  getProducts as apiGetProducts,
  getProductById,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from "../services/products";

const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Fetch products with optional filters/pagination
  const fetchProducts = async (params = {}) => {
  setLoading(true);
  try {
    const { data } = await apiGetProducts(params); // backend now returns all
    setList(data.products || []);
  } catch {
    toast.error("Failed to load products");
  } finally {
    setLoading(false);
  }
};


  // Fetch single product details
  const fetchProductDetails = async (id) => {
    setLoading(true);
    try {
      const { data } = await getProductById(id);
      setSelected(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  // Create a new product
  const createProduct = async (payload) => {
    setLoading(true);
    try {
      const { data } = await apiCreateProduct(payload);
      toast.success("Product created successfully");
      return data.product;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing product
  const updateProduct = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await apiUpdateProduct(id, payload);
      toast.success("Product updated successfully");
      return data.product;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await apiDeleteProduct(id);
      toast.success("Product deleted successfully");
      // Optional: remove from local list
      setList((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        list,
        loading,
        selected,
        total,
        page,
        pages,
        fetchProducts,
        fetchProductDetails,
        createProduct,
        updateProduct,
        deleteProduct,
        setSelected,
        setList,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
