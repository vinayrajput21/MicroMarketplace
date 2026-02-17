// src/components/ProductCard.jsx
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from './common/Button';

export default function ProductCard({
  product,
  onFavoriteToggle,
  isFavorited = false,
  showFavoriteButton = true,
}) {
  const { _id, title, price, description, image } = product;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {showFavoriteButton && (
          <button
            onClick={() => onFavoriteToggle?.(_id)}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className={`text-2xl ${isFavorited ? 'text-yellow-500' : 'text-gray-400'}`}>
              {isFavorited ? '★' : '☆'}
            </span>
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
          {title}
        </h3>

        <p className="text-2xl font-bold text-blue-600 mb-3">
          ₹{price.toLocaleString()}
        </p>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        <Link to={`/products/${_id}`}>
          <Button variant="primary" size="md" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onFavoriteToggle: PropTypes.func,
  isFavorited: PropTypes.bool,
  showFavoriteButton: PropTypes.bool,
};