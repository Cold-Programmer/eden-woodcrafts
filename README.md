# 🪵 Eden Woodcrafts

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js"/>
  <img src="https://img.shields.io/badge/Express.js-Backend-green?style=for-the-badge&logo=express"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-blue?style=for-the-badge&logo=prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql"/>
  <img src="https://img.shields.io/badge/TailwindCSS-Styled-38BDF8?style=for-the-badge&logo=tailwindcss"/>
  <img src="https://img.shields.io/badge/M-Pesa-Daraja-00A651?style=for-the-badge"/>
</p>

---

# 🌟 Overview

**Eden Woodcrafts** is a modern full-stack furniture e-commerce and workshop management platform built for carpentry businesses.

It enables customers to browse handcrafted furniture, place orders, customize products, book appointments, make secure M-Pesa payments, and track orders while administrators manage inventory, customers, staff, projects and business operations from a powerful dashboard.

The project follows modern software engineering practices with a scalable architecture, clean codebase and production-ready deployment.

---

# ✨ Features

## Customer

- User Registration & Login
- JWT Authentication
- Browse Products
- Search & Filter Products
- Shopping Cart
- Wishlist
- Checkout
- M-Pesa STK Push Payments
- Order Tracking
- Reviews & Ratings
- Address Management
- Customer Dashboard
- Appointment Booking
- Portfolio Viewing
- Services Page
- Profile Settings

---

## Staff

- Staff Dashboard
- Product Management
- Appointment Management
- Order Processing
- Update Production Status
- Inventory Access

---

## Administrator

- Analytics Dashboard
- Product CRUD
- Category Management
- Customer Management
- Staff Management
- Project Portfolio CRUD
- Order Management
- Payment Monitoring
- Appointment Administration
- Business Reports

---

# 🏗 System Architecture

```
                 Next.js Frontend
                        │
                        │ REST API
                        ▼
                Express.js Backend
                        │
                 Prisma ORM
                        │
                  PostgreSQL
                        │
              M-Pesa Daraja API
```

---

# 🛠 Tech Stack

## Frontend

- Next.js 15
- React
- JavaScript
- Tailwind CSS
- App Router
- Fetch API

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt
- M-Pesa Daraja API

---

## Testing

- Jest
- Supertest
- React Testing Library
- Playwright

---

# 📁 Project Structure

```
eden-woodcrafts-fullstack/

│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── render.yaml
├── README.md
└── MPESA_SETUP.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Cold-Programmer/eden-woodcrafts.git

cd eden-woodcrafts-fullstack
```

---

# Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npx prisma generate

npx prisma migrate dev

npm run seed

npm run dev
```

Runs on

```
http://localhost:4000
```

---

# Frontend Setup

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

Runs on

```
http://localhost:3000
```

---

# Environment Variables

## Backend

```
DATABASE_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

MPESA_CONSUMER_KEY=

MPESA_CONSUMER_SECRET=

MPESA_SHORTCODE=

MPESA_PASSKEY=

MPESA_CALLBACK_URL=
```

---

## Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

# Authentication

- JWT Authentication
- Secure Cookies
- Password Hashing
- Role-Based Access Control

Roles

- Customer
- Staff
- Admin

---

# M-Pesa Integration

Supports

- STK Push
- Payment Callback
- Order Payment Verification

---

# Deployment

## Frontend

Deploy to

- Vercel

Root Directory

```
frontend
```

---

## Backend

Deploy to

- Render

Root Directory

```
backend
```

Uses

- PostgreSQL
- Prisma
- render.yaml

---

# API

Example

```
POST /api/auth/login

POST /api/auth/register

GET /api/products

POST /api/orders

POST /api/payments/mpesa/stkpush

GET /api/projects

GET /api/auth/profile
```

---

# Screens

- Home
- Shop
- Product Details
- Cart
- Checkout
- Services
- Portfolio
- Contact
- Customer Dashboard
- Staff Dashboard
- Admin Dashboard

---

# Testing

Backend

```bash
npm test
```

Frontend

```bash
npm test
```

End-to-End

```bash
npm run test:e2e
```

---

# Security

- JWT Authentication
- Secure Password Hashing
- Protected Routes
- Input Validation
- Prisma ORM
- Role-Based Authorization

---

# Performance

- Optimized API
- Server Components
- Image Optimization
- Dynamic Rendering
- Production Build Ready

---

# Roadmap

- Email Verification
- Password Reset
- Stripe Payments
- AI Assistant
- Live Chat
- Cloudinary Uploads
- Multi-Branch Management
- Multi-Currency
- Invoice PDFs
- Barcode System
- Payroll
- ERP Modules

---

# Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# License

MIT License

---

# Author

**Elvis Muthomi**

Software Engineer

GitHub

https://github.com/tsomielvis

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps the project grow and motivates future improvements.

---

<p align="center">
Made with ❤️ using Next.js, Express.js, Prisma, PostgreSQL and M-Pesa Daraja.
</p>
