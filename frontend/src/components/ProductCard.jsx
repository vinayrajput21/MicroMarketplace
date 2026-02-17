import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/* ─── Icons ─── */
const StarFilled = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const StarOutline = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const FALLBACK = 'https://via.placeholder.com/400x260/0d0d1f/4f46e5?text=No+Image';

const cn = (...cls) => cls.filter(Boolean).join(' ');

export default function ProductCard({
  product,
  onFavoriteToggle,
  isFavorited = false,
  showFavoriteButton = true,
}) {
  const { _id, title, price, description, image } = product;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .pc-card {
          font-family: 'Outfit', sans-serif;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          transition: transform .22s cubic-bezier(.16,1,.3,1),
                      box-shadow .22s cubic-bezier(.16,1,.3,1),
                      border-color .22s;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        .pc-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99,102,241,0.28);
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.15);
        }

        /* Shine on hover */
        .pc-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%);
          opacity: 0;
          transition: opacity .25s;
          pointer-events: none;
          z-index: 1;
          border-radius: 20px;
        }
        .pc-card:hover::before { opacity: 1; }

        /* ── Image ── */
        .pc-img-wrap {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(255,255,255,0.03);
        }

        .pc-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
          display: block;
        }
        .pc-card:hover .pc-img { transform: scale(1.06); }

        /* gradient overlay on image */
        .pc-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 40%,
            rgba(7,7,15,0.7) 100%
          );
          pointer-events: none;
        }

        /* ── Fav button ── */
        .pc-fav {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          width: 34px; height: 34px;
          background: rgba(7,7,15,0.65);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          transition: color .2s, background .2s, border-color .2s, transform .2s;
        }
        .pc-fav:hover {
          background: rgba(7,7,15,0.9);
          border-color: rgba(250,204,21,0.4);
          transform: scale(1.1);
        }
        .pc-fav.active {
          color: #facc15;
          border-color: rgba(250,204,21,0.4);
          background: rgba(250,204,21,0.1);
        }
        .pc-fav.active:hover { transform: scale(1.15); }

        /* ── Price badge on image ── */
        .pc-price-badge {
          position: absolute; bottom: 12px; left: 12px; z-index: 2;
          background: rgba(7,7,15,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 15px; font-weight: 800;
          background: linear-gradient(135deg, #818cf8, #f472b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          /* badge bg separate trick */
        }
        .pc-price-badge-wrap {
          position: absolute; bottom: 12px; left: 12px; z-index: 2;
          background: rgba(7,7,15,0.72);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 5px 11px;
        }
        .pc-price-text {
          font-size: 15px; font-weight: 800; letter-spacing: -0.3px;
          background: linear-gradient(135deg, #818cf8, #f472b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Body ── */
        .pc-body {
          padding: 18px 18px 20px;
          display: flex; flex-direction: column; flex: 1;
        }

        .pc-title {
          font-size: 15px; font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: -0.2px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .pc-desc {
          font-size: 12.5px; font-weight: 300;
          color: rgba(255,255,255,0.32);
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
          margin-bottom: 16px;
        }

        /* ── Divider ── */
        .pc-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin-bottom: 14px;
        }

        /* ── CTA ── */
        .pc-cta {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 11px;
          text-decoration: none;
          color: rgba(255,255,255,0.75);
          font-size: 13.5px; font-weight: 600;
          font-family: 'Outfit', sans-serif;
          transition: background .2s, border-color .2s, color .2s;
          cursor: pointer;
        }
        .pc-cta:hover {
          background: rgba(99,102,241,0.16);
          border-color: rgba(99,102,241,0.35);
          color: #fff;
        }
        .pc-cta-arrow {
          display: flex; align-items: center; justify-content: center;
          width: 24px; height: 24px;
          background: rgba(99,102,241,0.18);
          border-radius: 6px;
          color: #818cf8;
          transition: background .2s, transform .2s;
        }
        .pc-cta:hover .pc-cta-arrow {
          background: rgba(99,102,241,0.3);
          transform: translateX(2px);
        }
      `}</style>

      <div className="pc-card">
        {/* Image */}
        <div className="pc-img-wrap">
          <img
            className="pc-img"
            src={image || FALLBACK}
            alt={title}
            onError={(e) => { e.target.src = FALLBACK; }}
          />
          <div className="pc-img-overlay" />

          {/* Price badge */}
          <div className="pc-price-badge-wrap">
            <span className="pc-price-text">₹{price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Body */}
        <div className="pc-body">
          <h3 className="pc-title">{title}</h3>
          <p className="pc-desc">{description}</p>
          <div className="pc-divider" />
          <Link to={`/products/${_id}`} className="pc-cta">
            <span>View Details</span>
            <span className="pc-cta-arrow"><ArrowIcon /></span>
          </Link>
        </div>
      </div>
    </>
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