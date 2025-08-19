import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const MerchantProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if present → editing
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: ""
  });

  useEffect(() => {
    if (isEditing) {
      api.get(`/products/${id}`).then(({ data }) => {
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
          images: data.images?.join(",") || ""
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/products/${id}`, {
          ...form,
          images: form.images.split(",").map((s) => s.trim())
        });
        toast.success("Product updated");
      } else {
        await api.post("/products", {
          ...form,
          images: form.images.split(",").map((s) => s.trim())
        });
        toast.success("Product created");
      }
      navigate("/merchant");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h3 className="fw-bold mb-4">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h3>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3 col-md-4">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Images (comma separated URLs)</label>
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button className="btn btn-primary" type="submit">
          {isEditing ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default MerchantProductForm;
