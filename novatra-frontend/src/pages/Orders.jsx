// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Spinner, Card, Button, Badge, Row, Col, Table } from "react-bootstrap";
import { motion } from "framer-motion";
import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCheckCircle, FaTimesCircle, FaShippingFast } from "react-icons/fa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 animate__animated animate__fadeInDown">
        My Orders
      </h1>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-5"
        >
          <h4 className="text-muted">No orders found!</h4>
          <FaShippingFast size={50} className="text-primary mt-3" />
        </motion.div>
      ) : (
        <Row className="g-4">
          {orders.map((order) => (
            <Col key={order._id} xs={12} md={6} lg={6}>
              <motion.div data-aos="fade-up" whileHover={{ scale: 1.02 }}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>Order ID: <strong>{order._id}</strong></span>
                    <Badge
                      bg={
                        order.isPaid
                          ? "success"
                          : order.status === "Pending"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-uppercase"
                    >
                      {order.isPaid ? "Paid" : order.status}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map((item) => (
                          <tr key={item.product._id}>
                            <td>{item.product.name}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price.toLocaleString()}</td>
                            <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-between mt-3 flex-column flex-md-row">
                      <div>
                        <h6>Shipping Address:</h6>
                        <p className="mb-0">{order.shippingAddress}</p>
                      </div>
                      <div className="text-end mt-2 mt-md-0">
                        <h5>Total: ₹{order.totalPrice.toLocaleString()}</h5>
                        {order.isPaid ? (
                          <FaCheckCircle className="text-success fs-3" title="Paid" />
                        ) : (
                          <FaTimesCircle className="text-danger fs-3" title="Not Paid" />
                        )}
                      </div>
                    </div>
                  </Card.Body>
                  {/* <Card.Footer className="text-muted d-flex justify-content-end">
                    
                  </Card.Footer> */}
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default OrdersPage;
