import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Styling libs
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Form, Button } from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaBoxOpen,
  FaRupeeSign,
  FaUserCircle,
  FaUserEdit,
} from "react-icons/fa";

// INR formatter
const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const MerchantDashboard = () => {
  const { user, setUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null); // "products" | "orders"

  // Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    storeName: user?.storeName || "",
    password: "",
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch products owned by merchant
  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products?limit=200");
      const myProducts = (data.products || []).filter(
        (p) => p.merchant?._id === user?._id
      );
      setProducts(myProducts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
    Promise.all([fetchProducts()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Modal handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const { data } = await api.put("/merchants/profile", formData);
      toast.success("Profile updated successfully");
      setShowProfileModal(false);
      setUser((prev) => ({ ...prev, ...data.merchant }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-3 mb-lg-0 animate__animated animate__fadeInDown">
          Merchant Dashboard
        </h2>
        <Link
          to="/merchant/products/new"
          className="btn btn-primary shadow-sm d-flex align-items-center gap-2"
        >
          <FaPlus /> Add Product
        </Link>
      </div>

      {/* Profile Card */}
      <motion.div
        className="card border-0 shadow-sm rounded-4 p-4 mb-5"
        data-aos="fade-up"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="d-flex flex-wrap align-items-center gap-3">
          <FaUserCircle className="text-primary display-4" />
          <div className="flex-grow-1">
            <h5 className="fw-bold mb-1">{user?.name || "Merchant"}</h5>
            <p className="mb-1 text-muted">{user?.email}</p>
            <p className="small text-muted mb-0">
              Role: <span className="fw-semibold">{user?.role}</span>
            </p>
          </div>
          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2 ms-auto"
            onClick={() => setShowProfileModal(true)}
          >
            <FaUserEdit /> Update Profile
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6" data-aos="fade-up">
          <div
            className={`card border-0 shadow-sm p-4 text-center h-100 ${
              activeSection === "products" ? "border-primary" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              setActiveSection((s) => (s === "products" ? null : "products"))
            }
          >
            <div className="display-6 text-primary mb-2">
              <FaBoxOpen />
            </div>
            <h4 className="mb-1">My Added Products</h4>
            <p className="text-muted mb-0">{products.length} products</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* Products Section */}
          {activeSection === "products" && (
            <motion.section
              key="products"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mb-5"
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="fw-semibold mb-0">My Products</h4>
                <small className="text-muted">{products.length} total</small>
              </div>

              {products.length === 0 ? (
                <div className="alert alert-info">
                  No products yet. Add your first one!
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                  {products.map((p, idx) => {
                    const img =
                      p?.images?.[0] ||
                      p?.image ||
                      "https://via.placeholder.com/600x600?text=Product";
                    return (
                      <div
                        className="col"
                        key={p._id}
                        data-aos="zoom-in"
                        data-aos-delay={(idx % 8) * 60}
                      >
                        <div
                          className="card h-100 border-0 shadow-sm rounded-4"
                          style={{ overflow: "hidden" }}
                        >
                          <div className="ratio ratio-1x1 bg-light">
                            <img
                              src={img}
                              alt={p.name}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                              loading="lazy"
                            />
                          </div>

                          <div className="card-body d-flex flex-column">
                            <h6
                              className="fw-semibold text-truncate mb-1"
                              title={p.name}
                            >
                              {p.name}
                            </h6>
                            <div className="d-flex align-items-center gap-2 small text-muted mb-2">
                              <span className="badge bg-secondary-subtle text-secondary rounded-pill">
                                {p.category || "General"}
                              </span>
                              <span>•</span>
                              <span>Stock: {p.stock ?? 0}</span>
                            </div>

                            <div className="mb-3">
                              <span className="fw-bold text-primary">
                                <FaRupeeSign className="me-1" />
                                {formatINR(p.price).replace("₹", "")}
                              </span>
                            </div>

                            <div className="mt-auto d-flex gap-2">
                              <Link
                                to={`/merchant/products/edit/${p._id}`}
                                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                              >
                                <FaEdit /> Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(p._id)}
                                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              >
                                <FaTrash /> Delete
                              </button>
                              <Link
                                to={`/product/${p._id}`}
                                className="btn btn-sm btn-outline-secondary ms-auto"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          )}

        </AnimatePresence>
      )}

      {/* Update Profile Modal */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserEdit className="me-2" /> Update Profile
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Store Name</Form.Label>
              <Form.Control
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password (leave blank to keep unchanged)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowProfileModal(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={modalLoading}>
              {modalLoading ? "Updating..." : "Update Profile"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantDashboard;
