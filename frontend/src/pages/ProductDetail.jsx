import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../api/product.api';
import { addFavorite, removeFavorite } from '../api/favorite.api';

export default function ProductDetail() {
  const { id } = useParams();
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
      alert('Please login first');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.title} width="400" />
      <h1>{product.title}</h1>
      <h2>₹{product.price}</h2>
      <p>{product.description}</p>

      <button
        onClick={toggleFavorite}
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
      >
        {isFavorite ? '★ Favorited' : '☆ Favorite'}
      </button>

      {/* CSS animation example */}
      <style>{`
        .favorite-btn {
          padding: 10px 20px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .favorite-btn.active {
          background: #ffeb3b;
          transform: scale(1.1);
          animation: pulse 0.6s;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}