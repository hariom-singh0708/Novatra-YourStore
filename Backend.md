Novatra: YourStore – Backend Checklist
1️⃣ Project Setup

 Initialize Node.js project (npm init)

 Install dependencies:

Express, Mongoose, bcrypt, jsonwebtoken, dotenv

Nodemailer, cors, express-validator, body-parser

Payment gateway SDK (Razorpay / Stripe / PayPal)

 Create server.js entry file

 Setup MongoDB connection

2️⃣ Models

 User Model

name, email, password, role (user/merchant/admin), wishlist, cart, orders

 Merchant Model

name, email, password, store name, products, orders

 Admin Model

name, email, password, role (owner only)

 Product Model

name, description, price, category, images (URLs), stock, reviews

 Order Model

user/merchant references, products with quantity, total amount, payment status, order status, timestamps

3️⃣ Middleware

 Authentication Middleware

JWT verification

Role-based access control (User, Merchant, Admin)

 Error Handling Middleware

 Validation Middleware

Input validation for routes

4️⃣ Utilities

 Email OTP Utility

Send OTP for registration, login, and password reset

 Payment Gateway Utility

Razorpay / Stripe / PayPal integration

 Password Hashing & Token Utility

5️⃣ Routes & Controllers
User Routes

 POST /api/users/register → Register with email OTP

 POST /api/users/verify-otp → Verify OTP for registration

 POST /api/users/login → Login via password

 POST /api/users/login-otp → Login via OTP

 POST /api/users/forgot-password → Send OTP

 POST /api/users/reset-password → Reset password

 GET /api/users/profile → Get user profile

 PUT /api/users/profile → Update profile

 GET /api/users/wishlist → Get wishlist

 POST /api/users/wishlist/:productId → Add to wishlist

 DELETE /api/users/wishlist/:productId → Remove from wishlist

 GET /api/users/cart → Get cart

 POST /api/users/cart → Add to cart

 PATCH /api/users/cart/:productId → Update cart quantity

 DELETE /api/users/cart/:productId → Remove from cart

 POST /api/users/order → Place order

 GET /api/users/orders → Get user orders

Merchant Routes

 POST /api/merchants/register → Merchant registration

 POST /api/merchants/login → Merchant login

 POST /api/merchants/products → Add product

 GET /api/merchants/products → List merchant products

 PATCH /api/merchants/products/:productId → Edit product

 DELETE /api/merchants/products/:productId → Delete product

 GET /api/merchants/orders → Get orders related to merchant

 PATCH /api/merchants/orders/:orderId → Update order status

Admin Routes

 POST /api/admin/login → Admin login (owner only)

 GET /api/admin/users → Get all users

 DELETE /api/admin/users/:userId → Delete user

 GET /api/admin/merchants → Get all merchants

 DELETE /api/admin/merchants/:merchantId → Delete merchant

 GET /api/admin/orders → Get all orders

 PATCH /api/admin/products/:productId → Edit product / category

Product Routes

 GET /api/products → List products with filters and search

 GET /api/products/:productId → Get product details

 GET /api/products/categories → List categories

6️⃣ Features / Enhancements

 Email OTP authentication (register/login/forgot password)

 JWT-based role-based access control

 Cart & Wishlist system

 Checkout & Payment Integration

 Order tracking system

 Reviews & Ratings for products

 Error-free and secure backend

 Analytics-ready (for Admin & Merchant)

✅ Next Step

We can start backend development in order, module by module:

Project Setup & Dependencies

Database Models (User, Merchant, Admin, Product, Order)

Auth System (Register/Login/OTP/Forgot/Reset)

Wishlist & Cart

Product CRUD and Filters

Order & Payment Integration

Merchant & Admin Dashboards

Error Handling & Middleware