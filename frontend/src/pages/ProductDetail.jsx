import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { getProduct } from "../api/product.api";
import { addFavorite, removeFavorite } from "../api/favorite.api";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

export default function ProductDetail() {
const { id } = useParams();
  const navigate = useNavigate();                    
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert("Please login first");
    }
  };

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src={product.image}
              alt={product.title}
              className="h-80 w-full object-cover md:w-96"
            />
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            <p className="text-4xl font-bold text-blue-600 mb-6">
              ₹{product.price.toLocaleString()}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <button
              onClick={toggleFavorite}
              className={`
                inline-flex items-center px-6 py-3 rounded-full font-medium text-lg transition-all duration-300
                ${
                  isFavorite
                    ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-400 hover:bg-yellow-200 transform scale-105"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200"
                }
              `}
            >
              {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
            </button>
            {user && (
              <button
                onClick={async () => {
                  if (!window.confirm("Delete this product?")) return;
                  try {
                    await api.delete(`/products/${id}`);
                    alert("Product deleted");
                    navigate("/products");
                  } catch (err) {
                    alert("Failed to delete");
                  }
                }}
                className="ml-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
