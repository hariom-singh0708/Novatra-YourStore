// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";
import { Modal, Button, Form } from "react-bootstrap";
import {
  FaUserCircle,
  FaShoppingCart,
  FaHeart,
  FaBoxOpen,
  FaSignOutAlt,
  FaEdit,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTag,
} from "react-icons/fa";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/users/profile");
      setUser(data);
      setFormData(data);
    } catch (err) {
      console.error("Failed to load user profile", err);
    }
  };

  const handleEdit = async () => {
    try {
      const { data } = await api.put("/users/profile", formData);
      setUser(data);
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update user profile", err);
    }
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "linear-gradient(135deg, #f9f9f9 0%, #f1f1f1 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="row g-4">
        {/* Left Side - Profile (centered) */}
        <motion.div
          className="col-lg-5 col-md-5 d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70 }}
        >
          <div
            className="card shadow-lg border-0 p-4 w-100"
            style={{ borderRadius: "1.2rem", maxWidth: "400px" }}
          >
            <div className="text-center mb-3">
              <FaUserCircle size={100} className="text-secondary mb-3" />
              <h5 className="fw-bold mb-1">{user.name}</h5>
              <p className="text-muted small">{user.email}</p>
              <p className="text-muted small">{user.phone}</p>
            </div>

            <div className="mb-3">
              <p className="mb-1">
                <FaMapMarkerAlt className="me-2 text-danger" />
                {user.address || "No address added"}
              </p>
              <p className="mb-1">
                <FaCalendarAlt className="me-2 text-primary" />
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <FaUserTag className="me-2 text-success" />
                Role: {user.role || "Customer"}
              </p>
            </div>

            <div className="d-flex flex-column gap-3 mt-4">
              <Button
                variant="outline-dark"
                className="d-flex align-items-center gap-2"
                onClick={() => setShowEditModal(true)}
              >
                <FaEdit /> Edit Profile
              </Button>
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
                onClick={() => navigate("/logout")}
              >
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Cards (one per row) */}
        <motion.div
          className="col-lg-7 col-md-7 justify-content-center align-items-center"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60 }}
        >
          <div className="row g-4">
            {/* Orders Card */}
            <div className="col-10">
              <motion.div
                className="card text-center shadow-sm p-4"
                whileHover={{ scale: 1.03 }}
                style={{ borderRadius: "1.2rem", cursor: "pointer" }}
                onClick={() => navigate("/orders")}
              >
                <FaBoxOpen size={40} className="text-primary mb-3" />
                <h6 className="fw-bold">My Orders</h6>
                <p className="text-muted small">
                  Track & view your past and current orders
                </p>
              </motion.div>
            </div>

            {/* Cart Card */}
            <div className="col-10">
              <motion.div
                className="card text-center shadow-sm p-4"
                whileHover={{ scale: 1.03 }}
                style={{ borderRadius: "1.2rem", cursor: "pointer" }}
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart size={40} className="text-success mb-3" />
                <h6 className="fw-bold">My Cart</h6>
                <p className="text-muted small">
                  Checkout the products you want to buy
                </p>
              </motion.div>
            </div>

            {/* Wishlist Card */}
            <div className="col-10">
              <motion.div
                className="card text-center shadow-sm p-4"
                whileHover={{ scale: 1.03 }}
                style={{ borderRadius: "1.2rem", cursor: "pointer" }}
                onClick={() => navigate("/wishlist")}
              >
                <FaHeart size={40} className="text-danger mb-3" />
                <h6 className="fw-bold">Wishlist</h6>
                <p className="text-muted small">Save items to purchase later</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className="animate__animated animate__fadeInDown"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDashboard;
