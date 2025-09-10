import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MerchantDashboard from './pages/MerchantDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserDashboard from "./pages/UserDashboard";
// import VerifyOtp from "./pages/VerifyOtp"; 
import MerchantProductForm from "./pages/MerchantProductForm";
import WishlistPage from "./pages/WishlistPage.jsx";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="flex-fill mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
           <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute roles={["user","merchant","admin"]}><Orders /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/verify-otp" element={<VerifyOtp />} /> */}
          <Route path="/merchant" element={<ProtectedRoute roles={["merchant"]}><MerchantDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user" element= { <ProtectedRoute><UserDashboard /></ProtectedRoute>}/>
          <Route path="/merchant/products/new" element={<MerchantProductForm />} />
          <Route path="/merchant/products/edit/:id" element={<MerchantProductForm />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
