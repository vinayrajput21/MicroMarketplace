// src/components/common/Loader.jsx
import PropTypes from 'prop-types';

export default function Loader({ size = 'medium', message = 'Loading...' }) {
  const sizes = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin`}
        />
      </div>
      {message && <p className="text-gray-600 font-medium">{message}</p>}
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
};