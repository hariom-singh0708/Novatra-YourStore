Novatra: YourStore

Full-Stack E-Commerce Web Application (MERN Stack)

Live Demo: [Optional URL if deployed]
Repository: [GitHub URL]

Table of Contents

Project Overview

Features

User Roles & Permissions

Tech Stack

Authentication & Security

Database Models

Architecture Diagram

Screenshots

Setup Instructions

Future Enhancements

Project Overview

Novatra: YourStore is a modern, secure, and scalable e-commerce web application built using the MERN stack (MongoDB, Express.js, React.js with Vite, Node.js). Inspired by platforms like Flipkart, it provides a seamless shopping experience for users, merchants, and admins.

Users can browse products, add to cart, place orders, and make payments.

Merchants can manage products, track orders, and view analytics.

Admins can monitor all operations and manage users, merchants, and products.

Features

User-friendly, responsive frontend using React + Vite and Bootstrap

Secure authentication with JWT, bcrypt, and email OTP

Login via password or OTP

Forgot password and reset functionality

Role-based access: User, Merchant, Admin

Product catalog with categories, filtering, sorting, and search

Cart and order management

Payment gateway integration (Razorpay / Stripe / PayPal)

Wishlist and product reviews

Email notifications for OTP, order confirmations, and shipment updates

Analytics dashboard for Admins and Merchants

SEO optimized and mobile-friendly design

Direct image URLs for product images (no external cloud storage)

Robust backend with middleware, controllers, validation, and error handling

User Roles & Permissions
Role	Capabilities
User	Browse products, add to cart, wishlist, place orders, track orders, review products, login/register via email OTP or password
Merchant	Add/edit/delete products, track orders, view analytics, manage inventory
Admin	Manage users and merchants, monitor all orders and transactions, update categories/products, view dashboards
Tech Stack

Frontend: React.js (Vite), Bootstrap, Font Awesome

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT, bcrypt, email OTP

Payment Integration: Razorpay / Stripe / PayPal

Other Tools: dotenv, axios, react-router-dom, cors, nodemailer

Authentication & Security

Email OTP Registration for secure account creation

Password & OTP Login Options for user convenience

Forgot Password & Reset Password via email OTP

JWT Token Authentication for secure protected routes

Password Hashing using bcrypt

Error-Free & Secure Implementation for production readiness

Database Models

User – Stores user details, cart, orders, and reviews

Merchant – Stores merchant info, products, and sales analytics

Admin – Stores admin info and system privileges

Product – Stores product details, category, price, stock, and image URLs

Order – Stores order details, payment status, and tracking info

Architecture Diagram
[Frontend - React + Vite]
        |
        v
[Backend - Express.js / Node.js]
        |
        v
[MongoDB Database]
        |
        v
[Payment Gateway Integration]
        |
        v
[Email Notifications via Nodemailer]


You can replace this ASCII diagram with a proper visual diagram for portfolio presentation.

Screenshots

Homepage

Product Listing & Filters

Product Details

Cart & Checkout

Login/Register with OTP

Merchant Dashboard

Admin Dashboard

Order Tracking

Add screenshots here to make your README visually appealing.

Setup Instructions

Clone the repository:

git clone <repository-url>
cd novatra-yourstore


Backend Setup:

cd backend
npm install
npm run dev


Create a .env file with:

PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>


Frontend Setup:

cd frontend
npm install
npm run dev


Open in browser:

Frontend runs on http://localhost:5173 (Vite default)

Backend API runs on http://localhost:5000

Future Enhancements

Real-time notifications with WebSockets

Advanced search recommendations based on user behavior

Multi-language support

Coupons, discounts, and promotional offers

Dark mode for improved UX

Social login (Google, Facebook)

Advanced analytics for merchants