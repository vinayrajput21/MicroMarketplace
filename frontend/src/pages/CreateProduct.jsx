import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createProduct } from '../api/product.api';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ─── Icons ─── */
const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const RupeeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8"/>
  </svg>
);

const TextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const LockIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const Spinner = () => (
  <svg style={{ animation: 'cp-spin 0.75s linear infinite', display: 'block' }}
    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const cn = (...cls) => cls.filter(Boolean).join(' ');

export default function CreateProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ title: '', price: '', description: '', image: '' });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPreview(form.image), 500);
    return () => clearTimeout(t);
  }, [form.image]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Product title is required.', { toastId: 'no-title' }); return; }
    if (!form.price || Number(form.price) < 1) { toast.error('Please enter a valid price.', { toastId: 'no-price' }); return; }
    if (!form.description.trim()) { toast.error('Description is required.', { toastId: 'no-desc' }); return; }

    setLoading(true);
    const tid = toast.loading('Creating your product…');
    try {
      await createProduct({ ...form, price: Number(form.price) });
      toast.update(tid, {
        render: `"${form.title}" listed successfully! 🎉`,
        type: 'success', isLoading: false, autoClose: 2500,
      });
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      toast.update(tid, {
        render: err.response?.data?.message || 'Failed to create product.',
        type: 'error', isLoading: false, autoClose: 4000,
      });
      setLoading(false);
    }
  };

  /* ── Not logged in ── */
  if (!user) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .cp-gate {
            min-height: 100vh; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: #07070f; font-family: 'Outfit', sans-serif; gap: 20px;
          }
          .cp-gate-icon { color: rgba(255,255,255,0.15); margin-bottom: 8px; }
          .cp-gate-title { font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.8); letter-spacing: -0.3px; }
          .cp-gate-sub { font-size: 14px; color: rgba(255,255,255,0.3); }
          .cp-gate-btn {
            margin-top: 8px; padding: 11px 28px;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border: none; border-radius: 12px;
            color: #fff; font-family: 'Outfit', sans-serif;
            font-weight: 600; font-size: 15px; cursor: pointer;
            box-shadow: 0 6px 22px rgba(99,102,241,0.4);
          }
        `}</style>
        <div className="cp-gate">
          <div className="cp-gate-icon"><LockIcon /></div>
          <p className="cp-gate-title">Authentication Required</p>
          <p className="cp-gate-sub">Please sign in to list a product.</p>
          <button className="cp-gate-btn" onClick={() => navigate('/login')}>Sign in →</button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Toast overrides */
        .Toastify__toast-container--top-right { top: 20px !important; right: 20px !important; width: 340px !important; }
        .Toastify__toast {
          background: rgba(10,10,22,0.94) !important; backdrop-filter: blur(28px) !important;
          border: 1px solid rgba(255,255,255,0.09) !important; border-radius: 16px !important;
          padding: 14px 16px !important; font-family: 'Outfit', sans-serif !important;
          font-size: 14px !important; color: rgba(255,255,255,0.82) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07) !important;
          min-height: unset !important;
        }
        .Toastify__toast--success { border-color: rgba(52,211,153,0.3) !important; }
        .Toastify__toast--error   { border-color: rgba(248,113,113,0.3) !important; }
        .Toastify__toast-body { padding: 0 !important; gap: 10px !important; align-items: center !important; }
        .Toastify__toast-icon { width: 22px !important; }
        .Toastify__close-button { color: rgba(255,255,255,0.25) !important; opacity: 1 !important; align-self: center !important; }
        .Toastify__close-button:hover { color: rgba(255,255,255,0.65) !important; }
        .Toastify__progress-bar { height: 2px !important; }
        .Toastify__progress-bar--success { background: linear-gradient(90deg,#10b981,#34d399) !important; }
        .Toastify__progress-bar--error   { background: linear-gradient(90deg,#ef4444,#f87171) !important; }
        .Toastify__spinner { border-color: rgba(255,255,255,0.12) !important; border-right-color: #818cf8 !important; width: 18px !important; height: 18px !important; }

        /* Page */
        .cp-root {
          min-height: 100vh; background: #07070f;
          font-family: 'Outfit', sans-serif;
          overflow: hidden; position: relative;
          padding: 48px 20px;
        }

        .cp-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px); }
        .cp-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%);
          top: -150px; left: -140px;
        }
        .cp-orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(236,72,153,0.17) 0%, transparent 65%);
          bottom: -100px; right: -80px;
        }

        .cp-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 100%);
        }

        /* Layout */
        .cp-layout {
          position: relative; z-index: 2;
          max-width: 960px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          opacity: 0; transform: translateY(30px);
          transition: opacity .75s cubic-bezier(.16,1,.3,1), transform .75s cubic-bezier(.16,1,.3,1);
        }
        .cp-layout.in { opacity: 1; transform: none; }

        @media (max-width: 720px) {
          .cp-layout { grid-template-columns: 1fr; }
          .cp-preview-col { order: -1; }
        }

        /* Back button */
        .cp-back {
          position: relative; z-index: 2;
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 28px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.35);
          background: none; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          padding: 0;
          transition: color .18s;
          opacity: 0; transition: opacity .5s .1s, color .18s;
        }
        .cp-back.in { opacity: 1; }
        .cp-back:hover { color: rgba(255,255,255,0.75); }

        /* Card shared */
        .cp-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          backdrop-filter: blur(30px);
          box-shadow: 0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
          overflow: hidden;
        }

        /* Form col */
        .cp-form-col { padding: 36px; }

        .cp-col-head { margin-bottom: 30px; }
        .cp-col-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          color: #818cf8; margin-bottom: 12px;
        }
        .cp-col-title {
          font-size: 24px; font-weight: 800;
          color: #fff; letter-spacing: -0.5px; line-height: 1.2;
          margin-bottom: 6px;
        }
        .cp-col-sub { font-size: 13px; color: rgba(255,255,255,0.3); font-weight: 300; }

        /* Field */
        .cp-field { margin-bottom: 18px; }
        .cp-label {
          display: block; font-size: 11px; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase;
          color: rgba(255,255,255,0.28); margin-bottom: 8px;
          transition: color .2s;
        }
        .cp-field.focused .cp-label { color: rgba(129,140,248,0.9); }

        .cp-input-wrap { position: relative; display: flex; align-items: flex-start; }
        .cp-ico {
          position: absolute; left: 15px; top: 14px;
          color: rgba(255,255,255,0.2); pointer-events: none;
          display: flex; align-items: center; transition: color .2s;
          z-index: 1;
        }
        .cp-field.focused .cp-ico { color: rgba(129,140,248,0.65); }

        .cp-input, .cp-textarea {
          width: 100%;
          background: rgba(255,255,255,0.048);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 13px;
          padding: 13px 16px 13px 44px;
          font-size: 15px; font-family: 'Outfit', sans-serif; font-weight: 400;
          color: #fff; outline: none; caret-color: #818cf8;
          transition: background .25s, border-color .25s, box-shadow .25s;
        }
        .cp-textarea {
          resize: vertical; min-height: 110px;
          line-height: 1.6; padding-top: 13px;
        }
        .cp-input::placeholder, .cp-textarea::placeholder { color: rgba(255,255,255,0.17); }
        .cp-input:focus, .cp-textarea:focus {
          background: rgba(99,102,241,0.07);
          border-color: rgba(99,102,241,0.42);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1), 0 4px 18px rgba(0,0,0,0.2);
        }
        /* number input arrows hidden */
        .cp-input[type=number]::-webkit-inner-spin-button,
        .cp-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        .cp-input[type=number] { -moz-appearance: textfield; }

        .cp-line {
          height: 2px; margin-top: 4px;
          background: linear-gradient(90deg, #6366f1, #ec4899);
          border-radius: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s cubic-bezier(.16,1,.3,1);
        }
        .cp-field.focused .cp-line { transform: scaleX(1); }

        /* Price prefix */
        .cp-prefix {
          position: absolute; left: 44px; top: 50%; transform: translateY(-50%);
          font-size: 15px; color: rgba(255,255,255,0.35); pointer-events: none;
          font-weight: 500;
        }
        .cp-input.has-prefix { padding-left: 62px; }

        /* Submit btn */
        .cp-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border: none; border-radius: 14px;
          color: #fff; font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 16px;
          cursor: pointer; position: relative; overflow: hidden;
          margin-top: 4px;
          box-shadow: 0 8px 28px rgba(99,102,241,0.38);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform .2s, box-shadow .2s, opacity .2s;
        }
        .cp-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(99,102,241,0.55); }
        .cp-btn:not(:disabled):active { transform: translateY(0); }
        .cp-btn:disabled { opacity: .65; cursor: not-allowed; }
        .cp-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent);
          opacity: 0; transition: opacity .3s;
        }
        .cp-btn:not(:disabled):hover::before { opacity: 1; }

        @keyframes cp-spin { to { transform: rotate(360deg); } }

        /* ── Preview col ── */
        .cp-preview-col {
          display: flex; flex-direction: column; gap: 0;
        }

        .cp-preview-card {
          flex: 1; padding: 36px;
          display: flex; flex-direction: column;
        }

        .cp-preview-label {
          font-size: 11px; font-weight: 600; letter-spacing: 1.2px;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          margin-bottom: 20px;
        }

        /* Image preview box */
        .cp-img-box {
          width: 100%; aspect-ratio: 4/3;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(255,255,255,0.12);
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          position: relative;
        }
        .cp-img-box img {
          width: 100%; height: 100%; object-fit: cover;
          border-radius: 16px;
        }
        .cp-img-placeholder {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          color: rgba(255,255,255,0.15);
        }
        .cp-img-placeholder span { font-size: 12px; letter-spacing: 0.5px; }

        /* Live preview card info */
        .cp-preview-info { flex: 1; }
        .cp-preview-title {
          font-size: 18px; font-weight: 700; color: #fff;
          letter-spacing: -0.3px; margin-bottom: 6px; min-height: 27px;
        }
        .cp-preview-title.empty { color: rgba(255,255,255,0.18); font-weight: 400; font-size: 15px; }
        .cp-preview-price {
          font-size: 22px; font-weight: 800;
          background: linear-gradient(135deg, #818cf8, #f472b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px; min-height: 33px;
        }
        .cp-preview-desc {
          font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.38);
          line-height: 1.6; min-height: 42px;
        }
        .cp-preview-desc.empty { color: rgba(255,255,255,0.15); font-style: italic; }

        /* Divider */
        .cp-preview-divider {
          height: 1px; background: rgba(255,255,255,0.06);
          margin: 16px 0;
        }

        /* User chip */
        .cp-preview-user {
          display: flex; align-items: center; gap: 8px;
        }
        .cp-preview-avatar {
          width: 24px; height: 24px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .cp-preview-user-name { font-size: 12px; color: rgba(255,255,255,0.35); font-weight: 400; }

        /* Required note */
        .cp-note {
          font-size: 12px; color: rgba(255,255,255,0.2);
          margin-top: 14px; text-align: center;
        }
        .cp-note span { color: #f472b6; }
      `}</style>

      <ToastContainer position="top-right" transition={Slide} closeOnClick pauseOnHover draggable theme="dark" />

      <div className="cp-root">
        <div className="cp-orb cp-orb-1" />
        <div className="cp-orb cp-orb-2" />
        <div className="cp-dots" />

        {/* Back button */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 960, margin: '0 auto 0' }}>
          <button className={cn('cp-back', mounted && 'in')} onClick={() => navigate('/products')}>
            <ArrowLeftIcon /> Back to Products
          </button>
        </div>

        <div className={cn('cp-layout', mounted && 'in')}>

          {/* ── Form column ── */}
          <div className="cp-card">
            <div className="cp-form-col">
              <div className="cp-col-head">
                <div className="cp-col-badge">
                  <PlusIcon />
                  New Listing
                </div>
                <h1 className="cp-col-title">Add a Product</h1>
                <p className="cp-col-sub">Fill in the details to list your product on the marketplace.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* Title */}
                <div className={cn('cp-field', focused === 'title' && 'focused')}>
                  <label className="cp-label">Product title <span style={{color:'#f472b6'}}>*</span></label>
                  <div className="cp-input-wrap">
                    <span className="cp-ico"><TagIcon /></span>
                    <input
                      className="cp-input"
                      type="text" name="title"
                      placeholder="e.g. Wireless Headphones"
                      value={form.title}
                      onChange={handleChange}
                      onFocus={() => setFocused('title')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div className="cp-line" />
                </div>

                {/* Price */}
                <div className={cn('cp-field', focused === 'price' && 'focused')}>
                  <label className="cp-label">Price (₹) <span style={{color:'#f472b6'}}>*</span></label>
                  <div className="cp-input-wrap">
                    <span className="cp-ico"><RupeeIcon /></span>
                    <span className="cp-prefix">₹</span>
                    <input
                      className="cp-input has-prefix"
                      type="number" name="price"
                      placeholder="0"
                      value={form.price}
                      onChange={handleChange}
                      onFocus={() => setFocused('price')}
                      onBlur={() => setFocused(null)}
                      min="1"
                    />
                  </div>
                  <div className="cp-line" />
                </div>

                {/* Description */}
                <div className={cn('cp-field', focused === 'description' && 'focused')}>
                  <label className="cp-label">Description <span style={{color:'#f472b6'}}>*</span></label>
                  <div className="cp-input-wrap">
                    <span className="cp-ico" style={{ top: 14 }}><TextIcon /></span>
                    <textarea
                      className="cp-textarea"
                      name="description"
                      placeholder="Describe your product — features, condition, details…"
                      value={form.description}
                      onChange={handleChange}
                      onFocus={() => setFocused('description')}
                      onBlur={() => setFocused(null)}
                      rows={4}
                    />
                  </div>
                  <div className="cp-line" />
                </div>

                {/* Image URL */}
                <div className={cn('cp-field', focused === 'image' && 'focused')}>
                  <label className="cp-label">Image URL <span style={{color:'rgba(255,255,255,0.2)'}}>optional</span></label>
                  <div className="cp-input-wrap">
                    <span className="cp-ico"><ImageIcon /></span>
                    <input
                      className="cp-input"
                      type="url" name="image"
                      placeholder="https://picsum.photos/300/200?random=999"
                      value={form.image}
                      onChange={handleChange}
                      onFocus={() => setFocused('image')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div className="cp-line" />
                </div>

                <button type="submit" className="cp-btn" disabled={loading}>
                  {loading ? <><Spinner /> Creating…</> : <><PlusIcon /> List Product</>}
                </button>

                <p className="cp-note"><span>*</span> Required fields</p>
              </form>
            </div>
          </div>

          {/* ── Preview column ── */}
          <div className="cp-preview-col">
            <div className="cp-card cp-preview-card">
              <p className="cp-preview-label">Live Preview</p>

              {/* Image */}
              <div className="cp-img-box">
                {preview ? (
                  <img src={preview} alt="Product preview" onError={() => setPreview('')} />
                ) : (
                  <div className="cp-img-placeholder">
                    <ImageIcon />
                    <span>Image preview</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="cp-preview-info">
                <p className={cn('cp-preview-title', !form.title && 'empty')}>
                  {form.title || 'Product name will appear here'}
                </p>
                <p className="cp-preview-price">
                  {form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : ''}
                </p>
                <p className={cn('cp-preview-desc', !form.description && 'empty')}>
                  {form.description || 'Your product description will appear here…'}
                </p>
              </div>

              <div className="cp-preview-divider" />

              <div className="cp-preview-user">
                <div className="cp-preview-avatar">
                  {user?.name ? user.name[0].toUpperCase() : '?'}
                </div>
                <span className="cp-preview-user-name">Listed by {user?.name || 'you'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}