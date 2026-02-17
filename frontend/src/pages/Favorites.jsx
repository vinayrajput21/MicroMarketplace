// src/pages/Favorites.jsx
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getFavorites, removeFavorite } from '../api/favorite.api';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ─── Icons ─── */
const HeartIcon = ({ filled }) => filled ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
  </svg>
);

const GridIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const Spinner = () => (
  <svg style={{ animation: 'fv-spin .75s linear infinite', display: 'block' }}
    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const FALLBACK = 'https://via.placeholder.com/400x260/0d0d1f/4f46e5?text=No+Image';
const cn = (...cls) => cls.filter(Boolean).join(' ');

export default function Favorites() {
  const [favorites, setFavorites]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [removing, setRemoving]     = useState(null); // id of item being removed
  const [mounted, setMounted]       = useState(false);
  const [exiting, setExiting]       = useState(null); // id of item animating out
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setTimeout(() => setMounted(true), 60);
    const fetchFavorites = async () => {
      try {
        const { data } = await getFavorites();
        setFavorites(data);
      } catch {
        toast.error('Failed to load favorites. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user, navigate]);

  const handleRemove = async (productId) => {
    setExiting(productId);
    setRemoving(productId);
    setTimeout(async () => {
      try {
        await removeFavorite(productId);
        setFavorites(prev => prev.filter(p => p._id !== productId));
        toast.success('Removed from favorites.');
      } catch {
        toast.error('Failed to remove from favorites.');
        setExiting(null);
      } finally {
        setRemoving(null);
      }
    }, 350); // wait for exit animation
  };

  if (!user) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Toast */
        .Toastify__toast-container--top-right { top: 20px !important; right: 20px !important; width: 340px !important; }
        .Toastify__toast { background: rgba(10,10,22,0.94) !important; backdrop-filter: blur(28px) !important; border: 1px solid rgba(255,255,255,0.09) !important; border-radius: 16px !important; padding: 14px 16px !important; font-family: 'Outfit', sans-serif !important; font-size: 14px !important; color: rgba(255,255,255,0.82) !important; box-shadow: 0 16px 48px rgba(0,0,0,0.5) !important; min-height: unset !important; }
        .Toastify__toast--success { border-color: rgba(52,211,153,0.3) !important; }
        .Toastify__toast--error   { border-color: rgba(248,113,113,0.3) !important; }
        .Toastify__toast-body { padding: 0 !important; gap: 10px !important; align-items: center !important; }
        .Toastify__toast-icon { width: 22px !important; }
        .Toastify__close-button { color: rgba(255,255,255,0.25) !important; opacity: 1 !important; align-self: center !important; }
        .Toastify__progress-bar { height: 2px !important; }
        .Toastify__progress-bar--success { background: linear-gradient(90deg,#10b981,#34d399) !important; }
        .Toastify__progress-bar--error   { background: linear-gradient(90deg,#ef4444,#f87171) !important; }

        @keyframes fv-spin { to { transform: rotate(360deg); } }

        /* Page */
        .fv-root {
          min-height: 100vh; background: #07070f;
          font-family: 'Outfit', sans-serif;
          position: relative; overflow-x: hidden;
          padding: 48px 20px 80px;
        }

        .fv-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(110px); z-index: 0; }
        .fv-orb-1 { width: 580px; height: 580px; background: radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%); top: -180px; left: -160px; }
        .fv-orb-2 { width: 440px; height: 440px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%); bottom: -130px; right: -100px; }

        .fv-dots {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 90% 80% at 50% 30%, black 10%, transparent 100%);
        }

        .fv-inner { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; }

        /* Header */
        .fv-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 40px; flex-wrap: wrap; gap: 16px;
          opacity: 0; transform: translateY(20px);
          transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
        }
        .fv-header.in { opacity: 1; transform: none; }

        .fv-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 4px; }
        .fv-title { font-size: 32px; font-weight: 800; letter-spacing: -0.6px; color: #fff; line-height: 1.1; }
        .fv-title span { background: linear-gradient(135deg, #f472b6, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .fv-count-pill {
          display: inline-flex; align-items: center;
          background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.22);
          border-radius: 999px; padding: 3px 10px;
          font-size: 12px; font-weight: 600; color: #f472b6;
          margin-left: 10px; vertical-align: middle;
        }

        .fv-browse-link {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: rgba(255,255,255,0.5);
          font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 14px;
          text-decoration: none;
          transition: background .18s, color .18s, border-color .18s;
        }
        .fv-browse-link:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.18); }

        /* Loading skeletons */
        .fv-skel-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        @media (max-width: 1200px) { .fv-skel-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 860px)  { .fv-skel-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px)  { .fv-skel-grid { grid-template-columns: 1fr; } }

        .fv-skel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; overflow: hidden;
          animation: fv-pulse 1.6s ease-in-out infinite;
        }
        .fv-skel-img { height: 200px; background: rgba(255,255,255,0.04); }
        .fv-skel-body { padding: 18px; display: flex; flex-direction: column; gap: 10px; }
        .fv-skel-line { height: 12px; border-radius: 6px; background: rgba(255,255,255,0.05); }
        @keyframes fv-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

        /* Grid */
        .fv-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        @media (max-width: 1200px) { .fv-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 860px)  { .fv-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px)  { .fv-grid { grid-template-columns: 1fr; } }

        /* Card */
        .fv-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; overflow: hidden;
          display: flex; flex-direction: column;
          position: relative;
          transition: transform .22s cubic-bezier(.16,1,.3,1),
                      box-shadow .22s, border-color .22s,
                      opacity .35s ease, scale .35s ease;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
          opacity: 0; transform: translateY(20px);
        }
        .fv-card.in { opacity: 1; transform: translateY(0); }
        .fv-card.out { opacity: 0; transform: scale(0.92) translateY(10px); }
        .fv-card:hover {
          transform: translateY(-4px);
          border-color: rgba(236,72,153,0.25);
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(236,72,153,0.12);
        }
        .fv-card.out:hover { transform: scale(0.92) translateY(10px); }

        /* Card shine */
        .fv-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%);
          opacity: 0; transition: opacity .25s; pointer-events: none; z-index: 1; border-radius: 20px;
        }
        .fv-card:hover::before { opacity: 1; }

        /* Image */
        .fv-img-wrap { position: relative; height: 200px; overflow: hidden; background: rgba(255,255,255,0.03); flex-shrink: 0; }
        .fv-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .fv-card:hover .fv-img { transform: scale(1.06); }
        .fv-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 45%, rgba(7,7,15,0.65) 100%); pointer-events: none; }

        /* Heart badge */
        .fv-heart-badge {
          position: absolute; top: 12px; left: 12px; z-index: 2;
          width: 32px; height: 32px;
          background: rgba(236,72,153,0.18);
          border: 1px solid rgba(236,72,153,0.35);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #f472b6;
        }

        /* Price badge on image */
        .fv-price-wrap {
          position: absolute; bottom: 12px; left: 12px; z-index: 2;
          background: rgba(7,7,15,0.72); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px; padding: 5px 11px;
        }
        .fv-price-text {
          font-size: 15px; font-weight: 800; letter-spacing: -0.3px;
          background: linear-gradient(135deg, #f472b6, #818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* Body */
        .fv-body { padding: 18px 18px 20px; display: flex; flex-direction: column; flex: 1; }

        .fv-prod-title {
          font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.9);
          letter-spacing: -0.2px; line-height: 1.35;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          margin-bottom: 12px;
        }

        .fv-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 14px; }

        /* Card actions */
        .fv-card-actions { display: flex; align-items: center; gap: 8px; margin-top: auto; }

        .fv-view-btn {
          flex: 1; display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.18);
          border-radius: 11px; text-decoration: none;
          color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600;
          font-family: 'Outfit', sans-serif;
          transition: background .18s, border-color .18s, color .18s;
        }
        .fv-view-btn:hover { background: rgba(99,102,241,0.16); border-color: rgba(99,102,241,0.35); color: #fff; }
        .fv-arrow-chip {
          display: flex; align-items: center; justify-content: center;
          width: 22px; height: 22px;
          background: rgba(99,102,241,0.18); border-radius: 6px; color: #818cf8;
          transition: background .18s, transform .18s;
        }
        .fv-view-btn:hover .fv-arrow-chip { background: rgba(99,102,241,0.3); transform: translateX(2px); }

        .fv-remove-btn {
          width: 38px; height: 38px; flex-shrink: 0;
          background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18);
          border-radius: 10px; color: #f87171;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .18s, border-color .18s, transform .18s;
        }
        .fv-remove-btn:hover { background: rgba(239,68,68,0.16); border-color: rgba(239,68,68,0.38); transform: scale(1.06); }
        .fv-remove-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        /* Empty state */
        .fv-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 90px 20px; text-align: center; gap: 14px;
          opacity: 0; transform: translateY(20px);
          transition: opacity .6s .2s, transform .6s .2s cubic-bezier(.16,1,.3,1);
        }
        .fv-empty.in { opacity: 1; transform: none; }
        .fv-empty-icon { color: rgba(236,72,153,0.2); margin-bottom: 4px; }
        .fv-empty-title { font-size: 22px; font-weight: 800; color: rgba(255,255,255,0.6); letter-spacing: -0.3px; }
        .fv-empty-sub { font-size: 14px; color: rgba(255,255,255,0.28); font-weight: 300; max-width: 300px; line-height: 1.5; }
        .fv-empty-cta {
          margin-top: 8px; padding: 12px 28px;
          background: linear-gradient(135deg, #ec4899, #6366f1);
          border: none; border-radius: 12px; color: #fff;
          font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; text-decoration: none; display: inline-block;
          box-shadow: 0 6px 22px rgba(236,72,153,0.35);
          transition: transform .18s, box-shadow .18s;
        }
        .fv-empty-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(236,72,153,0.52); }

        /* Content */
        .fv-content {
          opacity: 0; transform: translateY(16px);
          transition: opacity .6s .15s cubic-bezier(.16,1,.3,1), transform .6s .15s cubic-bezier(.16,1,.3,1);
        }
        .fv-content.in { opacity: 1; transform: none; }
      `}</style>

      <ToastContainer position="top-right" transition={Slide} closeOnClick pauseOnHover draggable theme="dark" />

      <div className="fv-root">
        <div className="fv-orb fv-orb-1" />
        <div className="fv-orb fv-orb-2" />
        <div className="fv-dots" />

        <div className="fv-inner">

          {/* Header */}
          <div className={cn('fv-header', mounted && 'in')}>
            <div>
              <p className="fv-eyebrow">Your collection</p>
              <h1 className="fv-title">
                <span>Favorites</span>
                {!loading && favorites.length > 0 && (
                  <span className="fv-count-pill">{favorites.length}</span>
                )}
              </h1>
            </div>
            <Link to="/products" className="fv-browse-link">
              Browse Products <ArrowRightIcon />
            </Link>
          </div>

          {/* Content */}
          <div className={cn('fv-content', mounted && 'in')}>

            {/* Loading */}
            {loading ? (
              <div className="fv-skel-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div className="fv-skel" key={i}>
                    <div className="fv-skel-img" />
                    <div className="fv-skel-body">
                      <div className="fv-skel-line" style={{ width: '72%' }} />
                      <div className="fv-skel-line" style={{ width: '42%' }} />
                      <div className="fv-skel-line" style={{ width: '88%', marginTop: 4 }} />
                    </div>
                  </div>
                ))}
              </div>

            ) : favorites.length === 0 ? (
              /* Empty */
              <div className={cn('fv-empty', mounted && 'in')}>
                <div className="fv-empty-icon"><GridIcon /></div>
                <p className="fv-empty-title">No favorites yet</p>
                <p className="fv-empty-sub">
                  Start exploring the marketplace and save products you love — they'll appear here.
                </p>
                <Link to="/products" className="fv-empty-cta">
                  Explore Products →
                </Link>
              </div>

            ) : (
              /* Grid */
              <div className="fv-grid">
                {favorites.map((product, i) => (
                  <div
                    key={product._id}
                    className={cn(
                      'fv-card',
                      mounted && 'in',
                      exiting === product._id && 'out'
                    )}
                    style={{ transitionDelay: mounted ? `${i * 45}ms` : '0ms' }}
                  >
                    {/* Image */}
                    <div className="fv-img-wrap">
                      <img
                        className="fv-img"
                        src={product.image || FALLBACK}
                        alt={product.title}
                        onError={e => { e.target.src = FALLBACK; }}
                      />
                      <div className="fv-img-overlay" />

                      {/* Heart badge */}
                      <div className="fv-heart-badge">
                        <HeartIcon filled />
                      </div>

                      {/* Price */}
                      <div className="fv-price-wrap">
                        <span className="fv-price-text">₹{product.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="fv-body">
                      <p className="fv-prod-title">{product.title}</p>
                      <div className="fv-divider" />
                      <div className="fv-card-actions">
                        <Link to={`/products/${product._id}`} className="fv-view-btn">
                          <span>View Details</span>
                          <span className="fv-arrow-chip"><ArrowRightIcon /></span>
                        </Link>
                        <button
                          className="fv-remove-btn"
                          onClick={() => handleRemove(product._id)}
                          disabled={removing === product._id}
                          aria-label="Remove from favorites"
                          title="Remove from favorites"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}