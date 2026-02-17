// src/pages/Register.jsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../api/auth.api';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ─── Icons ─── */
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const Spinner = () => (
  <svg style={{ animation: 'rp-spin 0.75s linear infinite', display: 'block' }}
    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

/* ─── Password strength ─── */
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
};

const strengthMeta = [
  { label: 'Too short',  color: '#ef4444' },
  { label: 'Weak',       color: '#f97316' },
  { label: 'Fair',       color: '#eab308' },
  { label: 'Good',       color: '#22c55e' },
  { label: 'Strong',     color: '#10b981' },
];

const cn = (...cls) => cls.filter(Boolean).join(' ');

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
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

  const strength = getStrength(form.password);
  const meta     = form.password.length === 0 ? null : strengthMeta[strength];

  const pwRules = [
    { label: '8+ characters',        pass: form.password.length >= 8 },
    { label: 'Uppercase letter',      pass: /[A-Z]/.test(form.password) },
    { label: 'Number',                pass: /[0-9]/.test(form.password) },
    { label: 'Special character',     pass: /[^A-Za-z0-9]/.test(form.password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter your full name.', { toastId: 'no-name' });
      return;
    }
    if (!form.email) {
      toast.error('Please enter your email address.', { toastId: 'no-email' });
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.', { toastId: 'weak-pass' });
      return;
    }

    setLoading(true);
    const tid = toast.loading('Creating your account…');

    try {
      const { data } = await register(form);
      authLogin(data.token, { _id: data._id, name: data.name, email: data.email });
      toast.update(tid, {
        render: `Welcome, ${data.name}! 🚀`,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => navigate('/products'), 900);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.update(tid, {
        render: msg,
        type: 'error',
        isLoading: false,
        autoClose: 4000,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Toast overrides (same as Login) ── */
        .Toastify__toast-container--top-right { top: 20px !important; right: 20px !important; width: 340px !important; }
        .Toastify__toast {
          background: rgba(10,10,22,0.94) !important;
          backdrop-filter: blur(28px) !important;
          border: 1px solid rgba(255,255,255,0.09) !important;
          border-radius: 16px !important;
          padding: 14px 16px !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 14px !important; font-weight: 400 !important;
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
        .Toastify__spinner { border-color: rgba(255,255,255,0.12) !important; border-right-color: #818cf8 !important; width: 18px !important; height: 18px !important; }

        /* ── Page ── */
        .rp-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #07070f;
          font-family: 'Outfit', sans-serif;
          overflow: hidden; position: relative;
          padding: 32px 16px;
        }

        /* ── Orbs ── */
        .rp-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px); }
        .rp-orb-1 {
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(99,102,241,0.26) 0%, transparent 65%);
          top: -180px; left: -160px;
          animation: rp-drift1 24s ease-in-out infinite;
        }
        .rp-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 65%);
          bottom: -120px; right: -90px;
          animation: rp-drift2 30s ease-in-out infinite;
        }
        .rp-orb-3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%);
          top: 50%; right: 22%;
          animation: rp-drift3 19s ease-in-out infinite;
        }
        @keyframes rp-drift1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(55px,45px)} 66%{transform:translate(-25px,75px)} }
        @keyframes rp-drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-55px,-65px)} }
        @keyframes rp-drift3 { 0%,100%{transform:translate(0,0)} 40%{transform:translate(35px,-50px)} 80%{transform:translate(-18px,30px)} }

        .rp-dots {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 78% 78% at 50% 50%, black 25%, transparent 100%);
        }

        /* ── Card ── */
        .rp-card {
          position: relative; z-index: 2;
          width: 480px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          padding: 50px 46px 44px;
          backdrop-filter: blur(40px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 44px 110px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.09);
          opacity: 0; transform: translateY(40px) scale(0.96);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        .rp-card.in { opacity: 1; transform: none; }
        .rp-card::after {
          content: ''; position: absolute; top: 0; left: -80%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.033), transparent);
          animation: rp-sweep 6s ease-in-out infinite;
          pointer-events: none; border-radius: 30px;
        }
        @keyframes rp-sweep { 0%{left:-80%} 100%{left:170%} }

        /* ── Steps indicator ── */
        .rp-steps {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; margin-bottom: 36px;
          opacity: 0; transition: opacity .6s .15s;
        }
        .rp-steps.in { opacity: 1; }
        .rp-step-dot {
          width: 28px; height: 5px; border-radius: 3px;
          transition: background .4s, width .4s;
        }

        /* ── Brand ── */
        .rp-brand {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin-bottom: 28px;
          opacity: 0; transform: translateY(16px);
          transition: opacity .6s .2s, transform .6s .2s cubic-bezier(.16,1,.3,1);
        }
        .rp-brand.in { opacity: 1; transform: none; }
        .rp-gem {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 24px rgba(99,102,241,0.55);
          animation: rp-gem-pulse 3.5s ease-in-out infinite; flex-shrink: 0;
        }
        @keyframes rp-gem-pulse {
          0%,100%{box-shadow:0 6px 24px rgba(99,102,241,0.55)}
          50%{box-shadow:0 6px 42px rgba(99,102,241,0.85),0 0 0 6px rgba(99,102,241,0.1)}
        }
        .rp-brand-name { font-weight: 800; font-size: 22px; color: #fff; letter-spacing: -0.5px; }

        /* ── Heading ── */
        .rp-title {
          font-weight: 700; font-size: 26px; letter-spacing: -0.5px;
          color: #fff; text-align: center; margin-bottom: 6px;
          opacity: 0; transform: translateY(14px);
          transition: opacity .6s .3s, transform .6s .3s cubic-bezier(.16,1,.3,1);
        }
        .rp-title.in { opacity: 1; transform: none; }
        .rp-sub {
          font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.35);
          text-align: center; margin-bottom: 34px;
          opacity: 0; transition: opacity .5s .38s;
        }
        .rp-sub.in { opacity: 1; }

        /* ── Field ── */
        .rp-field {
          margin-bottom: 16px;
          opacity: 0; transform: translateX(-16px);
          transition: opacity .5s, transform .5s cubic-bezier(.16,1,.3,1);
        }
        .rp-field.in { opacity: 1; transform: none; }
        .rp-field:nth-of-type(1) { transition-delay: .36s; }
        .rp-field:nth-of-type(2) { transition-delay: .43s; }
        .rp-field:nth-of-type(3) { transition-delay: .50s; }

        .rp-label {
          display: block; font-size: 11px; font-weight: 600;
          letter-spacing: 1.3px; text-transform: uppercase;
          color: rgba(255,255,255,0.28); margin-bottom: 8px;
          transition: color .2s;
        }
        .rp-field.focused .rp-label { color: rgba(129,140,248,0.9); }

        .rp-input-wrap { position: relative; display: flex; align-items: center; }
        .rp-ico {
          position: absolute; left: 15px;
          color: rgba(255,255,255,0.2); pointer-events: none;
          display: flex; align-items: center; transition: color .2s;
        }
        .rp-field.focused .rp-ico { color: rgba(129,140,248,0.65); }

        .rp-input {
          width: 100%;
          background: rgba(255,255,255,0.048);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 13px;
          padding: 13px 46px 13px 44px;
          font-size: 15px; font-family: 'Outfit', sans-serif; font-weight: 400;
          color: #fff; outline: none; caret-color: #818cf8;
          transition: background .25s, border-color .25s, box-shadow .25s;
        }
        .rp-input::placeholder { color: rgba(255,255,255,0.17); }
        .rp-input:focus {
          background: rgba(99,102,241,0.07);
          border-color: rgba(99,102,241,0.42);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.11), 0 4px 18px rgba(0,0,0,0.25);
        }

        .rp-eye {
          position: absolute; right: 14px;
          background: none; border: none; outline: none;
          color: rgba(255,255,255,0.2); cursor: pointer;
          display: flex; align-items: center;
          padding: 5px; border-radius: 7px;
          transition: color .2s, background .2s;
        }
        .rp-eye:hover { color: rgba(255,255,255,0.58); background: rgba(255,255,255,0.06); }

        .rp-line {
          height: 2px; margin-top: 4px;
          background: linear-gradient(90deg, #6366f1, #ec4899);
          border-radius: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s cubic-bezier(.16,1,.3,1);
        }
        .rp-field.focused .rp-line { transform: scaleX(1); }

        /* ── Password strength ── */
        .rp-strength-wrap {
          margin-top: 10px;
          overflow: hidden;
          max-height: 0;
          transition: max-height .4s cubic-bezier(.16,1,.3,1), opacity .3s;
          opacity: 0;
        }
        .rp-strength-wrap.visible { max-height: 120px; opacity: 1; }

        .rp-bars { display: flex; gap: 4px; margin-bottom: 8px; }
        .rp-bar {
          flex: 1; height: 3px; border-radius: 3px;
          background: rgba(255,255,255,0.08);
          transition: background .4s;
        }

        .rp-rules { display: flex; flex-wrap: wrap; gap: 6px 14px; }
        .rp-rule {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; color: rgba(255,255,255,0.28);
          transition: color .3s;
        }
        .rp-rule.pass { color: rgba(52,211,153,0.9); }
        .rp-rule-dot {
          width: 14px; height: 14px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          transition: background .3s, border-color .3s;
          flex-shrink: 0;
        }
        .rp-rule.pass .rp-rule-dot {
          background: rgba(52,211,153,0.9);
          border-color: transparent;
        }

        /* ── Button ── */
        .rp-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          border: none; border-radius: 14px;
          color: #fff; font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 16px; letter-spacing: 0.2px;
          cursor: pointer; position: relative; overflow: hidden;
          margin-top: 8px;
          box-shadow: 0 8px 28px rgba(99,102,241,0.38);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          opacity: 0; transition: opacity .5s .57s, transform .2s, box-shadow .2s;
        }
        .rp-btn.in { opacity: 1; }
        .rp-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(99,102,241,0.55); }
        .rp-btn:not(:disabled):active { transform: translateY(0); }
        .rp-btn:disabled { opacity: .65; cursor: not-allowed; }
        .rp-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent);
          opacity: 0; transition: opacity .3s;
        }
        .rp-btn:not(:disabled):hover::before { opacity: 1; }

        /* ── Divider ── */
        .rp-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0 0;
          opacity: 0; transition: opacity .5s .62s;
        }
        .rp-divider.in { opacity: 1; }
        .rp-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent); }
        .rp-divider span { font-size: 12px; color: rgba(255,255,255,0.24); white-space: nowrap; letter-spacing: 0.5px; }

        /* ── Footer ── */
        .rp-footer {
          text-align: center; font-size: 13px; color: rgba(255,255,255,0.28); margin-top: 18px;
          opacity: 0; transition: opacity .5s .66s;
        }
        .rp-footer.in { opacity: 1; }
        .rp-footer a { color: #818cf8; text-decoration: none; font-weight: 500; transition: color .2s; }
        .rp-footer a:hover { color: #a5b4fc; text-decoration: underline; }

        @keyframes rp-spin { to { transform: rotate(360deg); } }
      `}</style>

      <ToastContainer position="top-right" transition={Slide} closeOnClick pauseOnHover draggable theme="dark" />

      <div className="rp-root">
        <div className="rp-orb rp-orb-1" />
        <div className="rp-orb rp-orb-2" />
        <div className="rp-orb rp-orb-3" />
        <div className="rp-dots" />

        <div className={cn('rp-card', mounted && 'in')}>

          {/* Brand */}
          <div className={cn('rp-brand', mounted && 'in')}>
            <div className="rp-gem">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span className="rp-brand-name">Reputaion Roots</span>
          </div>

          <h1 className={cn('rp-title', mounted && 'in')}>Create your account</h1>
          <p className={cn('rp-sub', mounted && 'in')}>Join thousands of users today — it's free</p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className={cn('rp-field', mounted && 'in', focused === 'name' && 'focused')}>
              <label className="rp-label">Full name</label>
              <div className="rp-input-wrap">
                <span className="rp-ico"><UserIcon /></span>
                <input
                  className="rp-input"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  autoComplete="name"
                />
              </div>
              <div className="rp-line" />
            </div>

            {/* Email */}
            <div className={cn('rp-field', mounted && 'in', focused === 'email' && 'focused')}>
              <label className="rp-label">Email address</label>
              <div className="rp-input-wrap">
                <span className="rp-ico"><MailIcon /></span>
                <input
                  className="rp-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  autoComplete="email"
                />
              </div>
              <div className="rp-line" />
            </div>

            {/* Password */}
            <div className={cn('rp-field', mounted && 'in', focused === 'password' && 'focused')}>
              <label className="rp-label">Password</label>
              <div className="rp-input-wrap">
                <span className="rp-ico"><LockIcon /></span>
                <input
                  className="rp-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  autoComplete="new-password"
                />
                <button type="button" className="rp-eye" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
              <div className="rp-line" />

              {/* Strength meter */}
              <div className={cn('rp-strength-wrap', form.password.length > 0 && 'visible')}>
                {/* Bars */}
                <div className="rp-bars">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="rp-bar"
                      style={{
                        background: strength >= i && meta
                          ? meta.color
                          : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  ))}
                </div>
                {/* Rules */}
                <div className="rp-rules">
                  {pwRules.map(r => (
                    <div key={r.label} className={cn('rp-rule', r.pass && 'pass')}>
                      <div className="rp-rule-dot">
                        {r.pass && <CheckIcon />}
                      </div>
                      {r.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={cn('rp-btn', mounted && 'in')}
              disabled={loading}
            >
              {loading ? <><Spinner /> Creating account…</> : 'Create account →'}
            </button>
          </form>

          <div className={cn('rp-divider', mounted && 'in')}>
            <div className="rp-divider-line" />
            <span>Already have an account?</span>
            <div className="rp-divider-line" />
          </div>

          <p className={cn('rp-footer', mounted && 'in')}>
            <a href="/login">Sign in instead</a>
          </p>
        </div>
      </div>
    </>
  );
}