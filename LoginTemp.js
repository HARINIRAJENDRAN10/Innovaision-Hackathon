import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Nunito', sans-serif;
    background: #fff8f0;
    overflow: hidden;
  }

  /* ── LEFT PANEL ── */
  .lp-left {
    flex: 1;
    background: linear-gradient(160deg, #ff9a3c 0%, #ff6b35 40%, #e8445a 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    position: relative;
    overflow: hidden;
  }

  /* Floating bubbles */
  .lp-bubble {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    animation: float 6s ease-in-out infinite;
  }
  .lp-bubble:nth-child(1) { width:180px; height:180px; top:-40px; left:-60px; animation-delay:0s; }
  .lp-bubble:nth-child(2) { width:120px; height:120px; bottom:60px; left:20px; animation-delay:1.5s; }
  .lp-bubble:nth-child(3) { width:80px;  height:80px;  top:40%;  right:-20px; animation-delay:3s; }
  .lp-bubble:nth-child(4) { width:50px;  height:50px;  bottom:20%; right:30px; animation-delay:0.8s; }

  @keyframes float {
    0%,100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-18px) scale(1.04); }
  }

  .lp-brand {
    position: relative;
    z-index: 2;
    text-align: center;
    animation: fadeUp 0.7s ease both;
  }

  .lp-brand-icon {
    font-size: 5rem;
    margin-bottom: 16px;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
    animation: bounceIn 0.9s cubic-bezier(.22,1,.36,1) both;
  }

  .lp-brand-title {
    font-family: 'Baloo 2', cursive;
    font-size: 2.4rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 10px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  .lp-brand-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.85);
    font-weight: 600;
    max-width: 280px;
    line-height: 1.5;
    margin-bottom: 36px;
  }

  /* Nutrition stats strip */
  .lp-stats {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    z-index: 2;
    animation: fadeUp 0.7s 0.2s ease both;
  }

  .lp-stat-card {
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 18px;
    padding: 14px 18px;
    text-align: center;
    min-width: 80px;
    transition: transform 0.2s;
  }
  .lp-stat-card:hover { transform: translateY(-4px) scale(1.05); }

  .lp-stat-icon  { font-size: 1.6rem; display: block; margin-bottom: 4px; }
  .lp-stat-val   { font-family: 'Baloo 2', cursive; font-size: 1.2rem; font-weight: 800; color: #fff; line-height: 1; }
  .lp-stat-label { font-size: 0.68rem; color: rgba(255,255,255,0.8); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

  .lp-tagline {
    position: relative;
    z-index: 2;
    margin-top: 28px;
    background: rgba(255,255,255,0.15);
    border-radius: 40px;
    padding: 10px 22px;
    font-size: 0.85rem;
    color: #fff;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeUp 0.7s 0.4s ease both;
  }

  /* ── RIGHT PANEL ── */
  .lp-right {
    width: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 48px;
    background: #fff8f0;
    position: relative;
  }

  .lp-right::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 90% 10%, rgba(255,154,60,0.08) 0%, transparent 50%),
      radial-gradient(circle at 10% 90%, rgba(232,68,90,0.06) 0%, transparent 50%);
    pointer-events: none;
  }

  .lp-form-wrap {
    width: 100%;
    max-width: 360px;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.6s 0.1s ease both;
  }

  .lp-form-header {
    margin-bottom: 32px;
  }

  .lp-welcome {
    font-family: 'Baloo 2', cursive;
    font-size: 2rem;
    font-weight: 800;
    color: #1a1a2e;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .lp-welcome span {
    background: linear-gradient(135deg, #ff6b35, #e8445a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lp-sub {
    font-size: 0.9rem;
    color: #999;
    font-weight: 600;
  }

  /* Input groups */
  .lp-field {
    margin-bottom: 18px;
  }

  .lp-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 800;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 7px;
  }

  .lp-input-wrap {
    position: relative;
  }

  .lp-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    pointer-events: none;
  }

  .lp-input {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border: 2px solid #f0ebe3;
    border-radius: 14px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a2e;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .lp-input::placeholder { color: #ccc; font-weight: 600; }

  .lp-input:focus {
    border-color: #ff6b35;
    box-shadow: 0 0 0 4px rgba(255,107,53,0.1);
  }

  .lp-eye {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: #ccc;
    padding: 0;
    transition: color 0.2s;
  }
  .lp-eye:hover { color: #ff6b35; }

  /* Remember & Forgot row */
  .lp-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .lp-remember {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .lp-remember input[type="checkbox"] { display: none; }

  .lp-check-box {
    width: 18px; height: 18px;
    border-radius: 6px;
    border: 2px solid #f0ebe3;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .lp-check-box.checked { background: #ff6b35; border-color: #ff6b35; color: #fff; }

  .lp-remember-txt { font-size: 0.82rem; font-weight: 700; color: #aaa; }

  .lp-forgot {
    font-size: 0.82rem;
    font-weight: 700;
    color: #ff6b35;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Nunito', sans-serif;
    transition: opacity 0.2s;
  }
  .lp-forgot:hover { opacity: 0.7; }

  /* Login button */
  .lp-btn {
    width: 100%;
    padding: 15px;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, #ff9a3c, #e8445a);
    color: #fff;
    font-family: 'Baloo 2', cursive;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 6px 20px rgba(232,68,90,0.35);
    letter-spacing: 0.03em;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .lp-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(232,68,90,0.45);
  }
  .lp-btn:active { transform: translateY(0); }

  .lp-btn.loading { opacity: 0.75; pointer-events: none; }

  .lp-spinner {
    width: 18px; height: 18px;
    border: 3px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Divider */
  .lp-divider {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 20px;
  }
  .lp-divider-line { flex: 1; height: 1.5px; background: #f0ebe3; }
  .lp-divider-txt  { font-size: 0.78rem; font-weight: 700; color: #ccc; }

  /* Social buttons */
  .lp-socials { display: flex; gap: 12px; margin-bottom: 28px; }
  .lp-social {
    flex: 1; padding: 11px; border-radius: 14px; border: 2px solid #f0ebe3;
    background: #fff; font-size: 1.2rem; cursor: pointer;
    transition: all 0.2s; font-family: 'Nunito', sans-serif;
    font-size: 0.85rem; font-weight: 700; color: #555;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .lp-social:hover { border-color: #ff6b35; background: #fff5f0; transform: translateY(-2px); }

  /* Register link */
  .lp-register {
    text-align: center;
    font-size: 0.88rem;
    font-weight: 600;
    color: #aaa;
  }
  .lp-register-link {
    color: #ff6b35; font-weight: 800; cursor: pointer;
    border: none; background: none; font-family: 'Nunito', sans-serif;
    font-size: 0.88rem; transition: opacity 0.2s;
  }
  .lp-register-link:hover { opacity: 0.7; }

  /* Error message */
  .lp-error {
    background: #fff0f0; border: 1.5px solid #ffd0d0;
    border-radius: 12px; padding: 10px 14px;
    font-size: 0.82rem; font-weight: 700; color: #e53935;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
    animation: shake 0.4s ease;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-6px); }
    40%,80%  { transform: translateX(6px); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes bounceIn {
    0%   { transform: scale(0.3); opacity: 0; }
    60%  { transform: scale(1.1); }
    80%  { transform: scale(0.95); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .lp-left  { display: none; }
    .lp-right { width: 100%; padding: 32px 24px; }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const handleLogin = () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    // Save logged-in email for ChildList filtering
    localStorage.setItem("userEmail", email.toLowerCase());
    if (remember) localStorage.setItem("rememberedEmail", email);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lp-root">

        {/* ── Left Panel ── */}
        <div className="lp-left">
          <div className="lp-bubble" />
          <div className="lp-bubble" />
          <div className="lp-bubble" />
          <div className="lp-bubble" />

          <div className="lp-brand">
            <span className="lp-brand-icon">🥗</span>
            <h1 className="lp-brand-title">Nutrition<br/>Passport</h1>
            <p className="lp-brand-sub">
              Track your child's health journey — from first bite to bright future.
            </p>
          </div>

          <div className="lp-stats">
            {[
              { icon: "🧒", val: "2,400+", label: "Children" },
              { icon: "🥦", val: "98%",    label: "Healthy" },
              { icon: "📊", val: "12",     label: "Metrics" },
              { icon: "🏅", val: "Top",    label: "Rated" },
            ].map((s) => (
              <div className="lp-stat-card" key={s.label}>
                <span className="lp-stat-icon">{s.icon}</span>
                <div className="lp-stat-val">{s.val}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="lp-tagline">
            🌟 Trusted by 500+ schools across the region
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="lp-right">
          <div className="lp-form-wrap">
            <div className="lp-form-header">
              <h2 className="lp-welcome">
                Welcome<br/>back <span>👋</span>
              </h2>
              <p className="lp-sub">Sign in to access your nutrition dashboard</p>
            </div>

            {error && (
              <div className="lp-error">⚠️ {error}</div>
            )}

            {/* Email */}
            <div className="lp-field">
              <label className="lp-label">Email Address</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">📧</span>
                <input
                  className="lp-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            {/* Password */}
            <div className="lp-field">
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">🔑</span>
                <input
                  className="lp-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{ paddingRight: "44px" }}
                />
                <button className="lp-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="lp-row">
              <label className="lp-remember" onClick={() => setRemember(!remember)}>
                <div className={`lp-check-box ${remember ? "checked" : ""}`}>
                  {remember && "✓"}
                </div>
                <span className="lp-remember-txt">Remember me</span>
              </label>
              <button className="lp-forgot">Forgot password?</button>
            </div>

            {/* Login Button */}
            <button
              className={`lp-btn ${loading ? "loading" : ""}`}
              onClick={handleLogin}
            >
              {loading
                ? <><div className="lp-spinner" /> Signing in...</>
                : <>Enter Dashboard 🚀</>
              }
            </button>

            {/* Divider */}
            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-txt">or continue with</span>
              <div className="lp-divider-line" />
            </div>

            {/* Social */}
            <div className="lp-socials">
              <button className="lp-social">🌐 Google</button>
              <button className="lp-social">🍎 Apple</button>
            </div>

            {/* Register */}
            <p className="lp-register">
              Not registered yet?{" "}
              <button className="lp-register-link" onClick={() => navigate("/register")}>
                Create account →
              </button>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}