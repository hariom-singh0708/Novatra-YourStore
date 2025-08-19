import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button, Form, Card, ListGroup, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, totalPrice, incrementQuantity, decrementQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (!cart || cart.length === 0)
    return (
      <div className="container my-5 text-center">
        <h4>Your cart is empty!</h4>
        <p>Add some products before checkout.</p>
      </div>
    );

const handlePayment = async () => {
  // --- Basic validation ---
  if (!address.trim()) return toast.error("Enter delivery address");
  if (!name.trim()) return toast.error("Enter your name");
  if (!email.trim()) return toast.error("Enter a valid email");
  if (!phone.trim()) return toast.error("Enter phone number");
  if (!cart.length) return toast.error("Cart is empty");

  setLoading(true);

  try {
    // 1️⃣ Create the order in DB first
    const orderPayload = {
      cart,
      shippingAddress: address,
      paymentMethod: paymentMethod === "cod" ? "COD" : "Online",
      customer: { name, email, phone },
      totalPrice,
    };

    const { data: dbOrder } = await api.post("/orders", orderPayload);

    // --- Cash on Delivery ---
    if (paymentMethod === "cod") {
      await clearCart();
      toast.success("Order placed successfully! Payment on delivery.");
      setTimeout(() => navigate("/"), 1500);
      return;
    }

    // --- Online Payment ---
    // 2️⃣ Create Razorpay order using DB order ID
    const { data: razorpayOrder } = await api.post("/orders/razorpay", {
      amount: totalPrice,
      orderId: dbOrder.order._id,
    });

    if (!window.Razorpay) throw new Error("Razorpay SDK not loaded");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Novatra Store",
      description: "Order Payment",
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          // 3️⃣ Verify payment & mark order paid
          await api.post(`/orders/${dbOrder.order._id}/payment-success`, {
            ...response,
            email,
          });

          await clearCart();
          toast.success("Payment successful! Order confirmed.");
          setTimeout(() => navigate("/orders"), 1500);
        } catch (err) {
          console.error("Payment verification failed:", err);
          toast.error("Payment verification failed. Contact support.");
        }
      },
      prefill: { name, email, contact: phone },
      notes: { cart: JSON.stringify(cart) },
      theme: { color: "#0d6efd" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Order placement failed:", err);
    toast.error(err.response?.data?.message || "Failed to place order. Try again.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="container my-5">
      <h2 className="mb-4">Checkout</h2>
      <Row className="g-4">
        {/* Customer Details */}
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h5 className="mb-3">Customer Details</h5>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Form.Group>
              <h5 className="mb-2 mt-3">Delivery Address</h5>
              <Form.Group className="mb-3">
                <Form.Control as="textarea" rows={3} value={address} placeholder="Enter delivery address" onChange={(e) => setAddress(e.target.value)} />
              </Form.Group>
              <h5 className="mb-3">Payment Method</h5>
              <Form.Check type="radio" label="Cash on Delivery" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="mb-2" />
              <Form.Check type="radio" label="Online Payment (Razorpay)" name="paymentMethod" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
              <Button variant="primary" className="w-100 mt-3" onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : paymentMethod === "cod" ? "Place Order (COD)" : `Pay ₹${totalPrice.toFixed(2)}`}
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Mini Cart */}
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h5 className="mb-3">Order Summary</h5>
            <ListGroup variant="flush">
              {cart.map((item) => (
                <ListGroup.Item key={item.product._id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.product.name}</strong>
                    <div className="small text-muted">
                      ₹{item.product.price} x {item.quantity} = ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button size="sm" variant="light" onClick={() => decrementQuantity(item.product._id)}>-</Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button size="sm" variant="light" onClick={() => incrementQuantity(item.product._id)}>+</Button>
                  </div>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
