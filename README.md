# MicroMarketplace

MicroMarketplace is a lightweight, modern platform for small-scale buying and selling.  
It enables users to quickly list products, browse items, favorite products, and complete micro-transactions with a clean and responsive interface.

Perfect for digital goods, handmade items, second-hand products, services, or any small-scale marketplace use case.

---

## 🚀 Features

- **User Authentication** — Secure registration and login (JWT-based)
- **Product Management** — Create, edit, view, and delete your own product listings
- **Product Details Page** — Rich view with images, description, price, category & seller info
- **Favorites / Wishlist** — Save interesting items for later
- **Search & Filters** — Keyword search + category filtering
- **User Dashboard** — Overview of your listings, sales, purchases, favorites & profile
- **Responsive Design** — Works beautifully on mobile, tablet and desktop
- **Clean & Fast UI** — Built with modern React + Tailwind CSS

---

## 🧰 Tech Stack

| Layer       | Technology                              | Purpose                              |
|------------|------------------------------------------|--------------------------------------|
| Frontend   | React (Vite)                             | Fast development & build tool        |
| Styling    | Tailwind CSS                             | Utility-first responsive styling     |
| Backend    | Node.js + Express                        | REST API server                      |
| Database   | MongoDB                                  | Flexible document storage            |
| Auth       | JWT (JSON Web Tokens)                    | Stateless authentication             |
| Deployment | Vercel (Frontend), Railway (Backend)     | Easy & free hosting platforms        |

---

## 📁 Project Structure

```bash
MicroMarketplace/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   └── (other Vite config files)
│
├── .gitignore
├── package-lock.json
└── package.json
```

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js ≥ 18.x (v20+ recommended)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/vinayrajput21/MicroMarketplace.git
cd MicroMarketplace
```
### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

## backend/.env
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_very_long_random_secret_key_here
```

```bash
npm run dev
```

### 2️⃣ frontend Setup

```bash
cd frontend
npm install
```
## frontend/.env
```bash
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### Live Demo
https://micro-marketplace-three.vercel.app/