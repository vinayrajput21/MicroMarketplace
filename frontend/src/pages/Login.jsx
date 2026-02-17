import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth.api';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ─── Icons ─── */
const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const Spinner = () => (
  <svg style={{ animation: 'lp-spin 0.75s linear infinite', display: 'block' }}
    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted]  = useState(false);

  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email) {
      toast.error('Please enter your email address.', { toastId: 'no-email' });
      return;
    }
    if (!form.password) {
      toast.error('Please enter your password.', { toastId: 'no-pass' });
      return;
    }

    setLoading(true);
    const tid = toast.loading('Signing you in…');

    try {
      const { data } = await login(form);
      authLogin(data.token, data);
      toast.update(tid, {
        render: 'Welcome back! 🎉',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => navigate('/products'), 900);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.update(tid, {
        render: msg,
        type: 'error',
        isLoading: false,
        autoClose: 4000,
      });
      setLoading(false);
    }
  };

  const c = (base, extra) => [base, extra].filter(Boolean).join(' ');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Toast overrides ── */
        .Toastify__toast-container--top-right {
          top: 20px !important; right: 20px !important;
          width: 340px !important;
        }
        .Toastify__toast {
          background: rgba(10, 10, 22, 0.94) !important;
          backdrop-filter: blur(28px) !important;
          border: 1px solid rgba(255,255,255,0.09) !important;
          border-radius: 16px !important;
          padding: 14px 16px !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          color: rgba(255,255,255,0.82) !important;
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
        .Toastify__spinner {
          border-color: rgba(255,255,255,0.12) !important;
          border-right-color: #818cf8 !important;
          width: 18px !important; height: 18px !important;
        }

        /* ── Page ── */
        .lp-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #07070f;
          font-family: 'Outfit', sans-serif;
          overflow: hidden; position: relative;
        }

        .lp-orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(100px);
        }
        .lp-orb-1 {
          width: 580px; height: 580px;
          background: radial-gradient(circle, rgba(99,102,241,0.27) 0%, transparent 65%);
          top: -200px; left: -170px;
          animation: lp-drift1 24s ease-in-out infinite;
        }
        .lp-orb-2 {
          width: 430px; height: 430px;
          background: radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 65%);
          bottom: -130px; right: -100px;
          animation: lp-drift2 30s ease-in-out infinite;
        }
        .lp-orb-3 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%);
          top: 52%; right: 22%;
          animation: lp-drift3 19s ease-in-out infinite;
        }
        @keyframes lp-drift1 {
          0%,100% { transform: translate(0,0); }
          33%  { transform: translate(60px,50px); }
          66%  { transform: translate(-28px,80px); }
        }
        @keyframes lp-drift2 {
          0%,100% { transform: translate(0,0); }
          50%  { transform: translate(-60px,-70px); }
        }
        @keyframes lp-drift3 {
          0%,100% { transform: translate(0,0); }
          40%  { transform: translate(38px,-52px); }
          80%  { transform: translate(-18px,32px); }
        }

        .lp-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 78% 78% at 50% 50%, black 25%, transparent 100%);
        }

        /* ── Card ── */
        .lp-card {
          position: relative; z-index: 2;
          width: 460px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          padding: 52px 46px 46px;
          backdrop-filter: blur(40px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 44px 110px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.09);
          opacity: 0; transform: translateY(40px) scale(0.96);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        .lp-card.in { opacity: 1; transform: none; }
        .lp-card::after {
          content: ''; position: absolute; top: 0; left: -80%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.033), transparent);
          animation: lp-sweep 6s ease-in-out infinite;
          pointer-events: none; border-radius: 30px;
        }
        @keyframes lp-sweep { 0% { left: -80%; } 100% { left: 170%; } }

        /* ── Brand ── */
        .lp-brand {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin-bottom: 40px;
          opacity: 0; transform: translateY(16px);
          transition: opacity .6s .2s, transform .6s .2s cubic-bezier(.16,1,.3,1);
        }
        .lp-brand.in { opacity: 1; transform: none; }
        .lp-gem {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 24px rgba(99,102,241,0.55);
          animation: lp-gem-pulse 3.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes lp-gem-pulse {
          0%,100% { box-shadow: 0 6px 24px rgba(99,102,241,0.55); }
          50%      { box-shadow: 0 6px 42px rgba(99,102,241,0.85), 0 0 0 6px rgba(99,102,241,0.1); }
        }
        .lp-brand-name {
          font-weight: 800; font-size: 22px;
          color: #fff; letter-spacing: -0.5px;
        }

        /* ── Heading ── */
        .lp-title {
          font-weight: 700; font-size: 27px; letter-spacing: -0.5px;
          color: #fff; text-align: center; margin-bottom: 6px;
          opacity: 0; transform: translateY(14px);
          transition: opacity .6s .3s, transform .6s .3s cubic-bezier(.16,1,.3,1);
        }
        .lp-title.in { opacity: 1; transform: none; }
        .lp-sub {
          font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.36);
          text-align: center; margin-bottom: 38px;
          opacity: 0; transition: opacity .5s .38s;
        }
        .lp-sub.in { opacity: 1; }

        /* ── Fields ── */
        .lp-field {
          margin-bottom: 18px;
          opacity: 0; transform: translateX(-16px);
          transition: opacity .5s, transform .5s cubic-bezier(.16,1,.3,1);
        }
        .lp-field.in { opacity: 1; transform: none; }
        .lp-field:nth-of-type(1) { transition-delay: .38s; }
        .lp-field:nth-of-type(2) { transition-delay: .46s; }

        .lp-label {
          display: block;
          font-size: 11px; font-weight: 600;
          letter-spacing: 1.3px; text-transform: uppercase;
          color: rgba(255,255,255,0.28); margin-bottom: 8px;
          transition: color .2s;
        }
        .lp-field.focused .lp-label { color: rgba(129,140,248,0.9); }

        .lp-input-wrap { position: relative; display: flex; align-items: center; }
        .lp-ico {
          position: absolute; left: 15px;
          color: rgba(255,255,255,0.2); pointer-events: none;
          display: flex; align-items: center;
          transition: color .2s;
        }
        .lp-field.focused .lp-ico { color: rgba(129,140,248,0.65); }

        .lp-input {
          width: 100%;
          background: rgba(255,255,255,0.048);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 13px;
          padding: 13px 46px 13px 44px;
          font-size: 15px; font-family: 'Outfit', sans-serif; font-weight: 400;
          color: #fff; outline: none;
          caret-color: #818cf8;
          transition: background .25s, border-color .25s, box-shadow .25s;
        }
        .lp-input::placeholder { color: rgba(255,255,255,0.17); }
        .lp-input:focus {
          background: rgba(99,102,241,0.07);
          border-color: rgba(99,102,241,0.42);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.11), 0 4px 18px rgba(0,0,0,0.25);
        }

        .lp-eye {
          position: absolute; right: 14px;
          background: none; border: none; outline: none;
          color: rgba(255,255,255,0.2); cursor: pointer;
          display: flex; align-items: center;
          padding: 5px; border-radius: 7px;
          transition: color .2s, background .2s;
        }
        .lp-eye:hover { color: rgba(255,255,255,0.58); background: rgba(255,255,255,0.06); }

        .lp-line {
          height: 2px; margin-top: 4px;
          background: linear-gradient(90deg, #6366f1, #ec4899);
          border-radius: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s cubic-bezier(.16,1,.3,1);
        }
        .lp-field.focused .lp-line { transform: scaleX(1); }

        /* ── Button ── */
        .lp-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          border: none; border-radius: 14px;
          color: #fff; font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 16px; letter-spacing: 0.2px;
          cursor: pointer; position: relative; overflow: hidden;
          margin-top: 8px;
          box-shadow: 0 8px 28px rgba(99,102,241,0.38);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          opacity: 0; transition: opacity .5s .54s, transform .2s, box-shadow .2s;
        }
        .lp-btn.in { opacity: 1; }
        .lp-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(99,102,241,0.55);
        }
        .lp-btn:not(:disabled):active { transform: translateY(0); }
        .lp-btn:disabled { opacity: .65; cursor: not-allowed; }
        .lp-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent);
          opacity: 0; transition: opacity .3s;
        }
        .lp-btn:not(:disabled):hover::before { opacity: 1; }

        @keyframes lp-spin { to { transform: rotate(360deg); } }

        /* ── Footer ── */
        .lp-footer {
          text-align: center; font-size: 13px;
          color: rgba(255,255,255,0.28); margin-top: 24px;
          opacity: 0; transition: opacity .5s .62s;
        }
        .lp-footer.in { opacity: 1; }
        .lp-footer a {
          color: #818cf8; text-decoration: none; font-weight: 500;
          transition: color .2s;
        }
        .lp-footer a:hover { color: #a5b4fc; text-decoration: underline; }
      `}</style>

      {/* ── Toast ── */}
      <ToastContainer
        position="top-right"
        transition={Slide}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

      <div className="lp-root">
        <div className="lp-orb lp-orb-1" />
        <div className="lp-orb lp-orb-2" />
        <div className="lp-orb lp-orb-3" />
        <div className="lp-dots" />

        <div className={c('lp-card', mounted && 'in')}>

          {/* Brand */}
          <div className={c('lp-brand', mounted && 'in')}>
            <div className="lp-gem">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span className="lp-brand-name">Reputation Roots</span>
          </div>

          <h1 className={c('lp-title', mounted && 'in')}>Welcome back</h1>
          <p className={c('lp-sub', mounted && 'in')}>Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} noValidate>

            <div className={c('lp-field', mounted && 'in', focused === 'email' && 'focused')}>
              <label className="lp-label">Email address</label>
              <div className="lp-input-wrap">
                <span className="lp-ico"><MailIcon /></span>
                <input
                  className="lp-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  autoComplete="email"
                />
              </div>
              <div className="lp-line" />
            </div>

            <div className={c('lp-field', mounted && 'in', focused === 'password' && 'focused')}>
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <span className="lp-ico"><LockIcon /></span>
                <input
                  className="lp-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              <div className="lp-line" />
            </div>

            <button
              type="submit"
              className={c('lp-btn', mounted && 'in')}
              disabled={loading}
            >
              {loading ? <><Spinner /> Signing in…</> : 'Sign in →'}
            </button>
          </form>

          <p className={c('lp-footer', mounted && 'in')}>
            Don't have an account? <a href="/register">Create one free</a>
          </p>

        </div>
      </div>
    </>
  );
}