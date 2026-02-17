// src/pages/ProductList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/product.api';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import Loader from '../components/common/Loader';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';

/* ─── Icons ─── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const BoxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const cn = (...cls) => cls.filter(Boolean).join(' ');

export default function ProductList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts]     = useState([]);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [mounted, setMounted]       = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProducts({ search: debouncedSearch.trim(), page, limit: 12 });
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || data.products?.length || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [debouncedSearch, page]);

  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
  const clearSearch = () => { setSearch(''); setPage(1); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pl-root {
          min-height: 100vh;
          background: #07070f;
          font-family: 'Outfit', sans-serif;
          position: relative; overflow-x: hidden;
          padding-bottom: 80px;
        }

        /* ── Orbs ── */
        .pl-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(110px); z-index: 0; }
        .pl-orb-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%);
          top: -250px; left: -200px;
        }
        .pl-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 65%);
          bottom: -150px; right: -120px;
        }

        .pl-dots {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 90% 80% at 50% 30%, black 10%, transparent 100%);
        }

        /* ── Inner wrapper ── */
        .pl-inner {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
          padding: 48px 28px 0;
        }

        /* ── Header ── */
        .pl-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 20px; margin-bottom: 36px;
          flex-wrap: wrap;
          opacity: 0; transform: translateY(20px);
          transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
        }
        .pl-header.in { opacity: 1; transform: none; }

        .pl-heading-group { display: flex; flex-direction: column; gap: 4px; }
        .pl-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 1.4px;
          text-transform: uppercase; color: rgba(255,255,255,0.28);
        }
        .pl-title {
          font-size: 32px; font-weight: 800; letter-spacing: -0.6px;
          color: #fff; line-height: 1.1;
        }
        .pl-title span {
          background: linear-gradient(135deg, #818cf8, #f472b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pl-count-pill {
          display: inline-flex; align-items: center;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.22);
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 12px; font-weight: 600; color: #818cf8;
          margin-left: 10px; vertical-align: middle;
        }

        /* ── Header right ── */
        .pl-header-right {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }

        /* ── Search ── */
        .pl-search-wrap {
          position: relative; display: flex; align-items: center;
          width: 300px;
        }
        .pl-search-ico {
          position: absolute; left: 14px;
          color: rgba(255,255,255,0.22); pointer-events: none;
          display: flex; align-items: center;
          transition: color .2s;
        }
        .pl-search-wrap:focus-within .pl-search-ico { color: rgba(129,140,248,0.7); }

        .pl-search {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 11px 40px 11px 42px;
          font-size: 14px; font-family: 'Outfit', sans-serif; font-weight: 400;
          color: #fff; outline: none; caret-color: #818cf8;
          transition: background .22s, border-color .22s, box-shadow .22s;
        }
        .pl-search::placeholder { color: rgba(255,255,255,0.18); }
        .pl-search:focus {
          background: rgba(99,102,241,0.07);
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .pl-search-clear {
          position: absolute; right: 12px;
          background: none; border: none;
          color: rgba(255,255,255,0.3); cursor: pointer;
          display: flex; align-items: center; padding: 4px;
          border-radius: 6px; transition: color .2s, background .2s;
        }
        .pl-search-clear:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.07); }

        /* ── Add btn ── */
        .pl-add-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 20px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border: none; border-radius: 12px;
          color: #fff; font-family: 'Outfit', sans-serif;
          font-weight: 600; font-size: 14px; cursor: pointer;
          box-shadow: 0 6px 20px rgba(99,102,241,0.38);
          white-space: nowrap;
          transition: transform .18s, box-shadow .18s, opacity .18s;
        }
        .pl-add-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(99,102,241,0.52); }
        .pl-add-btn:active { transform: translateY(0); }

        /* ── Search indicator ── */
        .pl-search-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px; padding: 5px 12px 5px 14px;
          font-size: 13px; color: rgba(255,255,255,0.5);
          margin-bottom: 24px;
        }
        .pl-search-tag strong { color: rgba(255,255,255,0.8); font-weight: 600; }
        .pl-search-tag button {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); display: flex; align-items: center;
          padding: 2px; border-radius: 4px; transition: color .18s;
        }
        .pl-search-tag button:hover { color: rgba(255,255,255,0.7); }

        /* ── Grid ── */
        .pl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1200px) { .pl-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .pl-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px)  { .pl-grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px)  {
          .pl-search-wrap { width: 100%; }
          .pl-header-right { width: 100%; }
          .pl-add-btn { flex: 1; justify-content: center; }
        }

        /* ── Loading skeleton ── */
        .pl-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1200px) { .pl-skeleton-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .pl-skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px)  { .pl-skeleton-grid { grid-template-columns: 1fr; } }

        .pl-skeleton-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          animation: pl-shimmer 1.6s ease-in-out infinite;
        }
        .pl-skeleton-img { height: 200px; background: rgba(255,255,255,0.04); }
        .pl-skeleton-body { padding: 18px; display: flex; flex-direction: column; gap: 10px; }
        .pl-skeleton-line {
          height: 12px; border-radius: 6px;
          background: rgba(255,255,255,0.05);
        }

        @keyframes pl-shimmer {
          0%,100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* ── Empty state ── */
        .pl-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 80px 20px; text-align: center;
          gap: 14px;
        }
        .pl-empty-icon { color: rgba(255,255,255,0.1); margin-bottom: 4px; }
        .pl-empty-title { font-size: 20px; font-weight: 700; color: rgba(255,255,255,0.6); letter-spacing: -0.3px; }
        .pl-empty-sub { font-size: 14px; color: rgba(255,255,255,0.28); font-weight: 300; max-width: 320px; line-height: 1.5; }
        .pl-empty-btn {
          margin-top: 8px; padding: 10px 24px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.28);
          border-radius: 12px; color: #818cf8;
          font-family: 'Outfit', sans-serif; font-weight: 600;
          font-size: 14px; cursor: pointer;
          transition: background .18s, border-color .18s;
        }
        .pl-empty-btn:hover { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); }

        /* ── Error state ── */
        .pl-error {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 64px 20px; text-align: center;
          gap: 14px;
        }
        .pl-error-icon { color: rgba(248,113,113,0.4); margin-bottom: 4px; }
        .pl-error-title { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.65); }
        .pl-error-msg { font-size: 14px; color: rgba(255,255,255,0.28); max-width: 300px; line-height: 1.5; }

        .pl-error-card {
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 20px; padding: 20px 24px;
          max-width: 440px; margin: 0 auto;
        }

        .pl-retry-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 22px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.28);
          border-radius: 12px; color: #f87171;
          font-family: 'Outfit', sans-serif; font-weight: 600;
          font-size: 14px; cursor: pointer;
          transition: background .18s;
        }
        .pl-retry-btn:hover { background: rgba(239,68,68,0.18); }

        /* ── Pagination wrapper ── */
        .pl-pagination {
          display: flex; justify-content: center;
          margin-top: 52px;
        }

        /* ── Content fade-in ── */
        .pl-content {
          opacity: 0; transform: translateY(16px);
          transition: opacity .6s .2s cubic-bezier(.16,1,.3,1), transform .6s .2s cubic-bezier(.16,1,.3,1);
        }
        .pl-content.in { opacity: 1; transform: none; }
      `}</style>

      <div className="pl-root">
        <div className="pl-orb pl-orb-1" />
        <div className="pl-orb pl-orb-2" />
        <div className="pl-dots" />

        <div className="pl-inner">

          {/* ── Header ── */}
          <div className={cn('pl-header', mounted && 'in')}>
            <div className="pl-heading-group">
              <p className="pl-eyebrow">Marketplace</p>
              <h1 className="pl-title">
                All <span>Products</span>
                {!loading && products.length > 0 && (
                  <span className="pl-count-pill">{totalCount}</span>
                )}
              </h1>
            </div>

            <div className="pl-header-right">
              {/* Search */}
              <div className="pl-search-wrap">
                <span className="pl-search-ico"><SearchIcon /></span>
                <input
                  className="pl-search"
                  type="text"
                  placeholder="Search products…"
                  value={search}
                  onChange={handleSearchChange}
                  aria-label="Search products"
                />
                {search && (
                  <button className="pl-search-clear" onClick={clearSearch} aria-label="Clear search">
                    <XIcon />
                  </button>
                )}
              </div>

              {/* Add product */}
              {user && (
                <button className="pl-add-btn" onClick={() => navigate('/add-product')}>
                  <PlusIcon /> Add Product
                </button>
              )}
            </div>
          </div>

          {/* Search indicator */}
          {debouncedSearch && !loading && (
            <div className="pl-search-tag">
              Showing results for <strong>"{debouncedSearch}"</strong>
              <button onClick={clearSearch} aria-label="Clear search"><XIcon /></button>
            </div>
          )}

          {/* ── Content ── */}
          <div className={cn('pl-content', mounted && 'in')}>

            {/* Loading */}
            {loading ? (
              <div className="pl-skeleton-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div className="pl-skeleton-card" key={i}>
                    <div className="pl-skeleton-img" />
                    <div className="pl-skeleton-body">
                      <div className="pl-skeleton-line" style={{ width: '70%' }} />
                      <div className="pl-skeleton-line" style={{ width: '40%' }} />
                      <div className="pl-skeleton-line" style={{ width: '90%', marginTop: 4 }} />
                      <div className="pl-skeleton-line" style={{ width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>

            ) : error ? (
              /* Error */
              <div className="pl-error-card">
                <div className="pl-error">
                  <div className="pl-error-icon"><AlertIcon /></div>
                  <p className="pl-error-title">Something went wrong</p>
                  <p className="pl-error-msg">{error}</p>
                  <button
                    className="pl-retry-btn"
                    onClick={() => { setError(null); fetchProducts(); }}
                  >
                    <RefreshIcon /> Try Again
                  </button>
                </div>
              </div>

            ) : products.length === 0 ? (
              /* Empty */
              <div className="pl-empty">
                <div className="pl-empty-icon"><BoxIcon /></div>
                <p className="pl-empty-title">
                  {debouncedSearch ? 'No results found' : 'No products yet'}
                </p>
                <p className="pl-empty-sub">
                  {debouncedSearch
                    ? `We couldn't find anything matching "${debouncedSearch}". Try a different keyword.`
                    : 'Be the first to list a product on the marketplace.'}
                </p>
                {debouncedSearch ? (
                  <button className="pl-empty-btn" onClick={clearSearch}>Clear search</button>
                ) : user ? (
                  <button className="pl-empty-btn" onClick={() => navigate('/add-product')}>
                    + Add First Product
                  </button>
                ) : null}
              </div>

            ) : (
              /* Grid */
              <>
                <div className="pl-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pl-pagination">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}