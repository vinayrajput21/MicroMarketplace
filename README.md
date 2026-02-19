# MicroMarketplace

MicroMarketplace is a lightweight, modern platform for small-scale buying and selling. It enables users to quickly list products, browse items, favorite products, and complete micro-transactions with a clean and responsive interface.

Perfect for digital goods, handmade items, second-hand products, services, or any small-scale marketplace use case.

## Features

- **User Authentication** — Secure registration and login (JWT-based)
- **Product Management** — Create, edit, view, and delete your product listings
- **Product Details Page** — Rich view with images, description, price, category & seller info
- **Favorites / Wishlist** — Save interesting items for later
- **Search & Filters** — Keyword search + category filtering
- **User Dashboard** — Overview of your listings, sales, purchases, favorites & profile
- **Responsive Design** — Works beautifully on mobile, tablet and desktop
- **Clean & Fast UI** — Built with modern React + Tailwind CSS

## Tech Stack

| Layer      | Technology              | Purpose                              |
|------------|-------------------------|--------------------------------------|
| Frontend   | React (Vite)            | Fast development & build tool        |
| Styling    | Tailwind CSS            | Utility-first styling                |
| Backend    | Node.js + Express       | REST API server                      |
| Database   | MongoDB                 | Flexible document storage            |
| Auth       | JWT (JSON Web Tokens)   | Stateless authentication             |
| Deployment | Vercel (frontend), Railway (backend) | Easy & free hosting platforms     |

## Getting Started

### Prerequisites

- Node.js ≥ 18.x (v20 recommended)
- npm or yarn
- MongoDB instance (local or cloud — MongoDB Atlas recommended)

### Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/vinayrajput21/MicroMarketplace.git
cd MicroMarketplace

Backend setup

Bashcd backend
npm install
Create .env file in /backend folder:
envPORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_very_long_random_secret_key_here
Start backend:
Bashnpm run dev
# or
node server.js
→ Backend should run on http://localhost:5000
Note: The project is also deployed on Railway — it usually runs on port 8080 there.

Frontend setup

Bashcd ../frontend
npm install
Create .env file in /frontend folder (for local development):
envVITE_API_URL=http://localhost:5000/api
Start frontend:
Bashnpm run dev
→ Open http://localhost:5173 (or the port shown in terminal)
Deployed Version
Live demo:
https://micro-marketplace-three.vercel.app/
(Backend is hosted separately on Railway)
Project Structure (simplified)
textMicroMarketplace/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── public/
│   └── .env
└── README.md
Contributing
Feel free to open issues or pull requests if you'd like to improve the project!
License
MIT License (or add your preferred license)
Happy micro-selling! 🛒
textThis version:

- Has clearer, more professional language
- Uses proper markdown tables, lists, and code blocks
- Fixes grammar and incomplete sentences
- Adds useful information without lying or assuming missing features
- Keeps installation steps accurate and beginner-friendly
- Includes both local + deployed configuration notes

Just copy the entire content above and paste it into your `README.md` file.  
Good luck with your project!1.2sFast