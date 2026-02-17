import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .nb-root {
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Outfit', sans-serif;
          background: rgba(7, 7, 15, 0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3);
        }

        .nb-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* ── Brand ── */
        .nb-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nb-brand-gem {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(99,102,241,0.5);
          flex-shrink: 0;
        }
        .nb-brand-name {
          font-weight: 800;
          font-size: 17px;
          color: #fff;
          letter-spacing: -0.4px;
          line-height: 1;
        }
        .nb-brand-name span {
          background: linear-gradient(135deg, #818cf8, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Nav links ── */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }

        .nb-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          transition: color 0.18s, background 0.18s, border-color 0.18s;
        }
        .nb-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
        }
        .nb-link.active {
          color: #fff;
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.25);
        }
        .nb-link.active svg { color: #818cf8; }

        /* ── Logout link ── */
        .nb-link.logout:hover {
          color: #f87171;
          background: rgba(239,68,68,0.08);
        }

        /* ── Right actions ── */
        .nb-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }



        /* ── User pill ── */
        .nb-user-pill {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 12px 5px 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
        }
        .nb-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(99,102,241,0.4);
        }
        .nb-username {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.7);
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── Divider ── */
        .nb-sep {
          width: 1px; height: 22px;
          background: rgba(255,255,255,0.08);
          margin: 0 2px;
        }

        /* ── Mobile hamburger ── */
        .nb-hamburger {
          display: none;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 7px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
        }

        /* ── Mobile menu ── */
        .nb-mobile {
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 12px 16px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(7,7,15,0.95);
        }
        .nb-mobile.open { display: flex; }

        .nb-mobile .nb-link {
          font-size: 15px;
          padding: 11px 14px;
        }
        .nb-mobile .nb-btn-solid,
        .nb-mobile .nb-btn-ghost {
          font-size: 15px;
          padding: 11px 14px;
          border-radius: 10px;
          justify-content: center;
        }
        .nb-mobile .nb-sep-h {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 4px 0;
        }

        @media (max-width: 680px) {
          .nb-links { display: none; }
          .nb-actions { display: none; }
          .nb-hamburger { display: flex; align-items: center; justify-content: center; }
        }
      `}</style>

      <nav className="nb-root">
        <div className="nb-inner">

          {/* Brand */}
          <Link to="/products" className="nb-brand">
            <div className="nb-brand-gem">
              <StarIcon />
            </div>
            <span className="nb-brand-name">
              Reputation<span>Roots</span>
            </span>
          </Link>

          {/* Center nav links */}
          <div className="nb-links">
            <Link to="/products" className={`nb-link ${isActive('/products') ? 'active' : ''}`}>
              <GridIcon /> Products
            </Link>
            {user && (
              <Link to="/favorites" className={`nb-link ${isActive('/favorites') ? 'active' : ''}`}>
                <HeartIcon /> Favorites
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="nb-actions">
             (
              <>
                <div className="nb-user-pill">
                  <div className="nb-avatar">
                    {user.name ? user.name[0].toUpperCase() : '?'}
                  </div>
                  <span className="nb-username">{user.name}</span>
                </div>
                <div className="nb-sep" />
                <button onClick={handleLogout} className="nb-link logout">
                  <LogoutIcon /> Logout
                </button>
              </>
            )
          </div>

          {/* Mobile hamburger */}
          <button className="nb-hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`nb-mobile ${mobileOpen ? 'open' : ''}`}>
          <Link to="/products" className={`nb-link ${isActive('/products') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
            <GridIcon /> Products
          </Link>
          {user && (
            <Link to="/favorites" className={`nb-link ${isActive('/favorites') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              <HeartIcon /> Favorites
            </Link>
          )}
          <div className="nb-sep-h" />
           (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="nb-link logout">
              <LogoutIcon /> Logout
            </button>
          )
        </div>
      </nav>
    </>
  );
}