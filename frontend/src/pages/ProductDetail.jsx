import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, deleteProduct } from '../api/product.api';
import { addFavorite, removeFavorite, getFavorites } from '../api/favorite.api';
import { useAuth } from '../hooks/useAuth';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ─── Icons ─── */
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const StarFilled = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const StarOutline = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const TagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const RupeeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8"/>
  </svg>
);
const TextIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const Spinner = () => (
  <svg style={{ animation: 'pd-spin .75s linear infinite', display: 'block' }}
    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const FALLBACK = 'https://via.placeholder.com/600x400/0d0d1f/4f46e5?text=No+Image';
const cn = (...cls) => cls.filter(Boolean).join(' ');

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct]     = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm]           = useState({ title: '', price: '', description: '', image: '' });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [error, setError]         = useState(null);
  const [mounted, setMounted]     = useState(false);
  const [focused, setFocused]     = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const { data: productData } = await getProduct(id);
        setProduct(productData);
        setForm({ title: productData.title, price: productData.price, description: productData.description, image: productData.image || '' });
        setImgPreview(productData.image || '');
        const { data: favorites } = await getFavorites();
        setIsFavorite(favorites.some(fav => fav._id === id || fav.toString() === id));
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  // Debounce image preview
  useEffect(() => {
    const t = setTimeout(() => setImgPreview(form.image), 500);
    return () => clearTimeout(t);
  }, [form.image]);

  const toggleFavorite = async () => {
    if (!user) { toast.error('Please sign in to save favorites.'); return; }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(id);
        toast.success('Removed from favorites.');
      } else {
        await addFavorite(id);
        toast.success('Added to favorites! ⭐');
      }
      setIsFavorite(prev => !prev);
    } catch {
      toast.error('Failed to update favorites.');
    } finally {
      setFavLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading('Saving changes…');
    try {
      const { data: updated } = await updateProduct(id, { ...form, price: Number(form.price) });
      setProduct(updated);
      setIsEditing(false);
      toast.update(tid, { render: 'Product updated! ✓', type: 'success', isLoading: false, autoClose: 2500 });
    } catch {
      toast.update(tid, { render: 'Failed to update product.', type: 'error', isLoading: false, autoClose: 3500 });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setShowDeleteModal(false);
    const tid = toast.loading('Deleting product…');
    try {
      await deleteProduct(id);
      toast.update(tid, { render: 'Product deleted.', type: 'success', isLoading: false, autoClose: 1500 });
      setTimeout(() => navigate('/products'), 800);
    } catch {
      toast.update(tid, { render: 'Failed to delete product.', type: 'error', isLoading: false, autoClose: 3500 });
      setDeleting(false);
    }
  };

  /* ─── States ─── */
  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pd-spin { to { transform: rotate(360deg); } }
        .pd-loading { min-height: 100vh; background: #07070f; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; font-family: 'Outfit', sans-serif; }
        .pd-loading p { color: rgba(255,255,255,0.3); font-size: 14px; }
      `}</style>
      <div className="pd-loading">
        <Spinner />
        <p>Loading product…</p>
      </div>
    </>
  );

  if (error || !product) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pd-err { min-height: 100vh; background: #07070f; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; font-family: 'Outfit', sans-serif; }
        .pd-err-title { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.6); }
        .pd-err-sub { font-size: 14px; color: rgba(255,255,255,0.28); }
        .pd-err-btn { margin-top: 8px; padding: 10px 24px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.28); border-radius: 12px; color: #818cf8; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; }
      `}</style>
      <div className="pd-err">
        <p className="pd-err-title">Product not found</p>
        <p className="pd-err-sub">{error}</p>
        <button className="pd-err-btn" onClick={() => navigate('/products')}>← Back to Products</button>
      </div>
    </>
  );

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
        .Toastify__spinner { border-color: rgba(255,255,255,0.12) !important; border-right-color: #818cf8 !important; width: 18px !important; height: 18px !important; }

        @keyframes pd-spin { to { transform: rotate(360deg); } }

        /* Page */
        .pd-root {
          min-height: 100vh; background: #07070f;
          font-family: 'Outfit', sans-serif;
          position: relative; overflow-x: hidden;
          padding: 44px 20px 80px;
        }
        .pd-orb { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(110px); z-index: 0; }
        .pd-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%); top: -200px; left: -180px; }
        .pd-orb-2 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 65%); bottom: -140px; right: -100px; }
        .pd-dots { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 28px 28px; mask-image: radial-gradient(ellipse 90% 80% at 50% 30%, black 10%, transparent 100%); }

        .pd-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }

        /* Back */
        .pd-back {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 28px; padding: 0;
          background: none; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.3);
          transition: color .18s;
        }
        .pd-back:hover { color: rgba(255,255,255,0.7); }

        /* ── View mode layout ── */
        .pd-view {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          opacity: 0; transform: translateY(24px);
          transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
        }
        .pd-view.in { opacity: 1; transform: none; }
        @media (max-width: 780px) { .pd-view { grid-template-columns: 1fr; } }

        /* Image panel */
        .pd-img-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          max-height: 480px;
          position: relative;
        }
        .pd-img-panel img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .pd-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(7,7,15,0.6) 100%);
          pointer-events: none;
        }

        /* Info panel */
        .pd-info-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px;
          display: flex; flex-direction: column;
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .pd-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.22);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          color: #818cf8; margin-bottom: 16px;
          width: fit-content;
        }

        .pd-product-title {
          font-size: 28px; font-weight: 800; letter-spacing: -0.6px;
          color: #fff; line-height: 1.2; margin-bottom: 16px;
        }

        .pd-price {
          font-size: 34px; font-weight: 800; letter-spacing: -0.8px;
          background: linear-gradient(135deg, #818cf8, #f472b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 24px;
        }

        .pd-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 20px 0; }

        .pd-desc-label {
          font-size: 11px; font-weight: 600; letter-spacing: 1.2px;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          margin-bottom: 10px;
        }
        .pd-desc {
          font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.55);
          line-height: 1.7; flex: 1; margin-bottom: 28px;
        }

        /* Action buttons row */
        .pd-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; }

        .pd-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 20px;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px;
          cursor: pointer; border: 1px solid transparent;
          transition: transform .18s, box-shadow .18s, background .18s, border-color .18s, opacity .18s;
        }
        .pd-btn:disabled { opacity: .6; cursor: not-allowed; }
        .pd-btn:not(:disabled):hover { transform: translateY(-1px); }
        .pd-btn:not(:disabled):active { transform: translateY(0); }

        .pd-btn-fav {
          background: rgba(250,204,21,0.08);
          border-color: rgba(250,204,21,0.2);
          color: rgba(255,255,255,0.6);
        }
        .pd-btn-fav:not(:disabled):hover { background: rgba(250,204,21,0.14); border-color: rgba(250,204,21,0.38); color: #facc15; }
        .pd-btn-fav.active { background: rgba(250,204,21,0.12); border-color: rgba(250,204,21,0.35); color: #facc15; }

        .pd-btn-edit {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.25);
          color: #818cf8;
        }
        .pd-btn-edit:not(:disabled):hover { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.42); box-shadow: 0 4px 14px rgba(99,102,241,0.2); }

        .pd-btn-delete {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.2);
          color: #f87171;
        }
        .pd-btn-delete:not(:disabled):hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.38); }

        /* ── Edit mode ── */
        .pd-edit-wrap {
          opacity: 0; transform: translateY(24px);
          transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
        }
        .pd-edit-wrap.in { opacity: 1; transform: none; }

        .pd-edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 760px) { .pd-edit-grid { grid-template-columns: 1fr; } }

        .pd-edit-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 36px;
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .pd-edit-head { margin-bottom: 28px; }
        .pd-edit-title { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.4px; margin-bottom: 4px; }
        .pd-edit-sub { font-size: 13px; color: rgba(255,255,255,0.28); font-weight: 300; }

        /* Fields */
        .pd-field { margin-bottom: 18px; }
        .pd-label {
          display: block; font-size: 11px; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase;
          color: rgba(255,255,255,0.28); margin-bottom: 8px;
          transition: color .2s;
        }
        .pd-field.focused .pd-label { color: rgba(129,140,248,0.9); }
        .pd-input-wrap { position: relative; display: flex; align-items: flex-start; }
        .pd-ico { position: absolute; left: 15px; top: 14px; color: rgba(255,255,255,0.2); pointer-events: none; display: flex; align-items: center; transition: color .2s; z-index: 1; }
        .pd-field.focused .pd-ico { color: rgba(129,140,248,0.65); }
        .pd-input, .pd-textarea {
          width: 100%;
          background: rgba(255,255,255,0.048);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 13px; padding: 13px 16px 13px 44px;
          font-size: 15px; font-family: 'Outfit', sans-serif;
          color: #fff; outline: none; caret-color: #818cf8;
          transition: background .25s, border-color .25s, box-shadow .25s;
        }
        .pd-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
        .pd-input::placeholder, .pd-textarea::placeholder { color: rgba(255,255,255,0.17); }
        .pd-input:focus, .pd-textarea:focus { background: rgba(99,102,241,0.07); border-color: rgba(99,102,241,0.42); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .pd-input[type=number]::-webkit-inner-spin-button, .pd-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        .pd-line { height: 2px; margin-top: 4px; background: linear-gradient(90deg, #6366f1, #ec4899); border-radius: 2px; transform: scaleX(0); transform-origin: left; transition: transform .35s cubic-bezier(.16,1,.3,1); }
        .pd-field.focused .pd-line { transform: scaleX(1); }
        .pd-prefix { position: absolute; left: 44px; top: 50%; transform: translateY(-50%); font-size: 15px; color: rgba(255,255,255,0.35); pointer-events: none; font-weight: 500; }
        .pd-input.has-prefix { padding-left: 58px; }

        /* Preview col */
        .pd-preview-panel {
          display: flex; flex-direction: column; gap: 0;
        }
        .pd-preview-card {
          flex: 1; padding: 36px;
          display: flex; flex-direction: column;
        }
        .pd-preview-label { font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 20px; }
        .pd-img-box { width: 100%; aspect-ratio: 4/3; border-radius: 16px; background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.1); overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .pd-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .pd-img-ph { display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(255,255,255,0.12); font-size: 12px; }
        .pd-prev-title { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; margin-bottom: 6px; }
        .pd-prev-price { font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #818cf8, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; }
        .pd-prev-desc { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.35); line-height: 1.6; }

        /* Edit form buttons */
        .pd-form-actions { display: flex; gap: 12px; margin-top: 8px; }
        .pd-btn-save {
          flex: 1; padding: 13px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border: none; border-radius: 13px;
          color: #fff; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 22px rgba(99,102,241,0.36);
          transition: transform .18s, box-shadow .18s, opacity .18s;
        }
        .pd-btn-save:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(99,102,241,0.52); }
        .pd-btn-save:disabled { opacity: .65; cursor: not-allowed; }
        .pd-btn-cancel {
          padding: 13px 22px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 13px;
          color: rgba(255,255,255,0.5); font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 15px;
          cursor: pointer; transition: background .18s, color .18s;
        }
        .pd-btn-cancel:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.8); }

        /* ── Delete modal ── */
        .pd-modal-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .pd-modal {
          background: rgba(12,12,24,0.96);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 24px; padding: 36px;
          max-width: 420px; width: 100%;
          text-align: center;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.1);
        }
        .pd-modal-icon { font-size: 36px; margin-bottom: 14px; }
        .pd-modal-title { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 8px; letter-spacing: -0.3px; }
        .pd-modal-sub { font-size: 14px; color: rgba(255,255,255,0.35); margin-bottom: 28px; line-height: 1.5; font-weight: 300; }
        .pd-modal-actions { display: flex; gap: 12px; }
        .pd-modal-confirm {
          flex: 1; padding: 12px;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.35);
          border-radius: 12px; color: #f87171;
          font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background .18s;
        }
        .pd-modal-confirm:hover { background: rgba(239,68,68,0.25); }
        .pd-modal-cancel {
          flex: 1; padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: rgba(255,255,255,0.5);
          font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 15px;
          cursor: pointer; transition: background .18s, color .18s;
        }
        .pd-modal-cancel:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.8); }
      `}</style>

      <ToastContainer position="top-right" transition={Slide} closeOnClick pauseOnHover draggable theme="dark" />

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="pd-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="pd-modal" onClick={e => e.stopPropagation()}>
            <div className="pd-modal-icon">🗑️</div>
            <p className="pd-modal-title">Delete this product?</p>
            <p className="pd-modal-sub">This action cannot be undone. The product will be permanently removed from the marketplace.</p>
            <div className="pd-modal-actions">
              <button className="pd-modal-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="pd-modal-confirm" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Spinner /> : <TrashIcon />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pd-root">
        <div className="pd-orb pd-orb-1" />
        <div className="pd-orb pd-orb-2" />
        <div className="pd-dots" />

        <div className="pd-inner">
          <button className="pd-back" onClick={() => navigate('/products')}>
            <ArrowLeftIcon /> Back to Products
          </button>

          {/* ── VIEW MODE ── */}
          {!isEditing && (
            <div className={cn('pd-view', mounted && 'in')}>

              {/* Image */}
              <div className="pd-img-panel">
                <img
                  src={product.image || FALLBACK}
                  alt={product.title}
                  onError={e => { e.target.src = FALLBACK; }}
                />
                <div className="pd-img-overlay" />
              </div>

              {/* Info */}
              <div className="pd-info-panel">
                <div className="pd-badge"><TagIcon /> Product</div>
                <h1 className="pd-product-title">{product.title}</h1>
                <p className="pd-price">₹{Number(product.price).toLocaleString('en-IN')}</p>

                <div className="pd-divider" />

                <p className="pd-desc-label">About this product</p>
                <p className="pd-desc">{product.description}</p>

                <div className="pd-actions">
                  {/* Favorite */}
                  <button
                    className={cn('pd-btn pd-btn-fav', isFavorite && 'active')}
                    onClick={toggleFavorite}
                    disabled={favLoading}
                  >
                    {isFavorite ? <StarFilled /> : <StarOutline />}
                    {isFavorite ? 'Saved' : 'Favorite'}
                  </button>

                  {/* Edit / Delete — owner only */}
                  {user && (
                    <>
                      <button className="pd-btn pd-btn-edit" onClick={() => setIsEditing(true)}>
                        <EditIcon /> Edit
                      </button>
                      <button
                        className="pd-btn pd-btn-delete"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={deleting}
                      >
                        <TrashIcon /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── EDIT MODE ── */}
          {isEditing && (
            <div className={cn('pd-edit-wrap', mounted && 'in')}>
              <div className="pd-edit-grid">

                {/* Form */}
                <div className="pd-edit-card">
                  <div className="pd-edit-head">
                    <p className="pd-edit-title">Edit Product</p>
                    <p className="pd-edit-sub">Update your product's details below.</p>
                  </div>

                  <form onSubmit={handleUpdate} noValidate>
                    <div className={cn('pd-field', focused === 'title' && 'focused')}>
                      <label className="pd-label">Title</label>
                      <div className="pd-input-wrap">
                        <span className="pd-ico"><TagIcon /></span>
                        <input className="pd-input" name="title" value={form.title}
                          onChange={e => setForm({ ...form, title: e.target.value })}
                          onFocus={() => setFocused('title')} onBlur={() => setFocused(null)} />
                      </div>
                      <div className="pd-line" />
                    </div>

                    <div className={cn('pd-field', focused === 'price' && 'focused')}>
                      <label className="pd-label">Price (₹)</label>
                      <div className="pd-input-wrap">
                        <span className="pd-ico"><RupeeIcon /></span>
                        <span className="pd-prefix">₹</span>
                        <input className="pd-input has-prefix" type="number" name="price" value={form.price}
                          onChange={e => setForm({ ...form, price: e.target.value })}
                          onFocus={() => setFocused('price')} onBlur={() => setFocused(null)} />
                      </div>
                      <div className="pd-line" />
                    </div>

                    <div className={cn('pd-field', focused === 'description' && 'focused')}>
                      <label className="pd-label">Description</label>
                      <div className="pd-input-wrap">
                        <span className="pd-ico" style={{ top: 14 }}><TextIcon /></span>
                        <textarea className="pd-textarea" name="description" value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })}
                          onFocus={() => setFocused('description')} onBlur={() => setFocused(null)} rows={4} />
                      </div>
                      <div className="pd-line" />
                    </div>

                    <div className={cn('pd-field', focused === 'image' && 'focused')}>
                      <label className="pd-label">Image URL <span style={{ color: 'rgba(255,255,255,0.2)', textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>optional</span></label>
                      <div className="pd-input-wrap">
                        <span className="pd-ico"><ImageIcon /></span>
                        <input className="pd-input" type="url" name="image" value={form.image}
                          placeholder="https://example.com/photo.jpg"
                          onChange={e => setForm({ ...form, image: e.target.value })}
                          onFocus={() => setFocused('image')} onBlur={() => setFocused(null)} />
                      </div>
                      <div className="pd-line" />
                    </div>

                    <div className="pd-form-actions">
                      <button type="button" className="pd-btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button type="submit" className="pd-btn-save" disabled={saving}>
                        {saving ? <Spinner /> : <SaveIcon />}
                        {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live preview */}
                <div className="pd-edit-card pd-preview-panel">
                  <div className="pd-preview-card">
                    <p className="pd-preview-label">Live Preview</p>
                    <div className="pd-img-box">
                      {imgPreview ? (
                        <img src={imgPreview} alt="preview" onError={() => setImgPreview('')} />
                      ) : (
                        <div className="pd-img-ph"><ImageIcon /><span>Image preview</span></div>
                      )}
                    </div>
                    <p className="pd-prev-title">{form.title || <span style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 400 }}>Product name</span>}</p>
                    <p className="pd-prev-price">{form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : ''}</p>
                    <p className="pd-prev-desc">{form.description || <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.15)' }}>Description will appear here…</span>}</p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}