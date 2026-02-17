import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Nunito', sans-serif;
    background: #f0f8ff;
    overflow: hidden;
  }

  /* ── LEFT PANEL ── */
  .rp-left {
    flex: 1;
    background: linear-gradient(160deg, #43cea2 0%, #185a9d 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    position: relative;
    overflow: hidden;
  }

  .rp-bubble {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    animation: rpFloat 6s ease-in-out infinite;
  }
  .rp-bubble:nth-child(1) { width:200px; height:200px; top:-60px; right:-60px; animation-delay:0s; }
  .rp-bubble:nth-child(2) { width:130px; height:130px; bottom:40px; right:20px; animation-delay:1.5s; }
  .rp-bubble:nth-child(3) { width:80px;  height:80px;  top:40%;   left:-20px; animation-delay:3s; }
  .rp-bubble:nth-child(4) { width:50px;  height:50px;  bottom:25%; left:40px; animation-delay:0.8s; }

  @keyframes rpFloat {
    0%,100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-18px) scale(1.04); }
  }

  .rp-brand {
    position: relative;
    z-index: 2;
    text-align: center;
    animation: rpFadeUp 0.7s ease both;
  }

  .rp-brand-icon {
    font-size: 5rem;
    margin-bottom: 16px;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
    animation: rpBounceIn 0.9s cubic-bezier(.22,1,.36,1) both;
  }

  .rp-brand-title {
    font-family: 'Baloo 2', cursive;
    font-size: 2.4rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 10px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  .rp-brand-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.85);
    font-weight: 600;
    max-width: 280px;
    line-height: 1.5;
    margin: 0 auto 36px;
  }

  /* Steps strip */
  /* Features grid */
  .rp-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
    max-width: 320px;
    position: relative;
    z-index: 2;
    animation: rpFadeUp 0.7s 0.2s ease both;
  }

  .rp-feature-card {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 18px;
    padding: 16px 14px;
    transition: transform 0.2s, background 0.2s;
  }
  .rp-feature-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.22); }

  .rp-feature-icon { font-size: 1.8rem; display: block; margin-bottom: 8px; }
  .rp-feature-title { font-size: 0.82rem; font-weight: 800; color: #fff; margin-bottom: 3px; }
  .rp-feature-desc  { font-size: 0.7rem; color: rgba(255,255,255,0.75); font-weight: 600; line-height: 1.4; }

  /* Nutrition stats */
  .rp-nut-stats {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 320px;
    position: relative;
    z-index: 2;
    margin-top: 14px;
    animation: rpFadeUp 0.7s 0.35s ease both;
  }

  .rp-nut-stat {
    flex: 1;
    background: rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 12px 8px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .rp-nut-val   { font-family: 'Baloo 2', cursive; font-size: 1.3rem; font-weight: 800; color: #fff; line-height: 1; }
  .rp-nut-label { font-size: 0.65rem; color: rgba(255,255,255,0.78); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 3px; }

  .rp-tagline {
    position: relative; z-index: 2;
    margin-top: 16px;
    background: rgba(255,255,255,0.15);
    border-radius: 40px;
    padding: 10px 22px;
    font-size: 0.85rem; color: #fff; font-weight: 700;
    display: flex; align-items: center; gap: 8px;
    animation: rpFadeUp 0.7s 0.4s ease both;
  }

  /* ── RIGHT PANEL ── */
  .rp-right {
    width: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 48px;
    background: #f0f8ff;
    position: relative;
    overflow-y: auto;
  }

  .rp-right::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(circle at 10% 10%, rgba(67,206,162,0.08) 0%, transparent 50%),
      radial-gradient(circle at 90% 90%, rgba(24,90,157,0.06) 0%, transparent 50%);
    pointer-events: none;
  }

  .rp-form-wrap {
    width: 100%;
    max-width: 400px;
    position: relative; z-index: 1;
    animation: rpFadeUp 0.6s 0.1s ease both;
  }

  .rp-form-header { margin-bottom: 28px; }

  .rp-welcome {
    font-family: 'Baloo 2', cursive;
    font-size: 2rem; font-weight: 800; color: #1a1a2e;
    line-height: 1.1; margin-bottom: 6px;
  }

  .rp-welcome span {
    background: linear-gradient(135deg, #43cea2, #185a9d);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .rp-sub { font-size: 0.9rem; color: #999; font-weight: 600; }

  /* Progress bar */
  .rp-progress-wrap { margin-bottom: 24px; }
  .rp-progress-label {
    display: flex; justify-content: space-between;
    font-size: 0.75rem; font-weight: 800; color: #aaa;
    text-transform: uppercase; letter-spacing: 0.05em;
    margin-bottom: 8px;
  }
  .rp-progress-bar {
    height: 6px; background: #e8f4f0; border-radius: 10px; overflow: hidden;
  }
  .rp-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #43cea2, #185a9d);
    border-radius: 10px;
    transition: width 0.4s ease;
  }

  /* 2-col grid */
  .rp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .rp-grid.full { grid-template-columns: 1fr; }

  .rp-field { display: flex; flex-direction: column; gap: 5px; }
  .rp-field.span2 { grid-column: 1 / -1; }

  .rp-label {
    font-size: 0.75rem; font-weight: 800; color: #888;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  .rp-input-wrap { position: relative; }

  .rp-input-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%); font-size: 1rem; pointer-events: none;
  }

  .rp-input, .rp-select {
    width: 100%;
    padding: 12px 13px 12px 40px;
    border: 2px solid #e0eef8;
    border-radius: 13px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem; font-weight: 700; color: #1a1a2e;
    background: #fff; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .rp-input::placeholder { color: #ccc; font-weight: 600; }
  .rp-input:focus, .rp-select:focus {
    border-color: #43cea2;
    box-shadow: 0 0 0 4px rgba(67,206,162,0.12);
  }

  .rp-eye {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; font-size: 1rem;
    color: #ccc; padding: 0; transition: color 0.2s;
  }
  .rp-eye:hover { color: #43cea2; }

  .rp-select { padding-left: 40px; appearance: none; cursor: pointer; }

  /* Password strength */
  .rp-strength { display: flex; gap: 5px; margin-top: 7px; }
  .rp-strength-bar {
    flex: 1; height: 4px; border-radius: 4px; background: #e8f4f0;
    transition: background 0.3s;
  }
  .rp-strength-bar.weak   { background: #e53935; }
  .rp-strength-bar.medium { background: #fb8c00; }
  .rp-strength-bar.strong { background: #43cea2; }
  .rp-strength-lbl { font-size: 0.7rem; font-weight: 700; margin-top: 4px; }
  .rp-strength-lbl.weak   { color: #e53935; }
  .rp-strength-lbl.medium { color: #fb8c00; }
  .rp-strength-lbl.strong { color: #43cea2; }

  /* Terms */
  .rp-terms {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 22px; cursor: pointer; user-select: none;
  }
  .rp-terms input[type="checkbox"] { display: none; }
  .rp-check-box {
    width: 18px; height: 18px; border-radius: 6px; border: 2px solid #e0eef8;
    background: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; transition: all 0.2s; flex-shrink: 0; margin-top: 2px;
  }
  .rp-check-box.checked { background: #43cea2; border-color: #43cea2; color: #fff; }
  .rp-terms-txt { font-size: 0.82rem; font-weight: 600; color: #aaa; line-height: 1.4; }
  .rp-terms-txt span { color: #185a9d; font-weight: 800; cursor: pointer; }

  /* Register button */
  .rp-btn {
    width: 100%; padding: 15px; border-radius: 16px; border: none;
    background: linear-gradient(135deg, #43cea2, #185a9d);
    color: #fff; font-family: 'Baloo 2', cursive;
    font-size: 1.1rem; font-weight: 700; cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 6px 20px rgba(24,90,157,0.3);
    letter-spacing: 0.03em; margin-bottom: 20px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .rp-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(24,90,157,0.4); }
  .rp-btn:active { transform: translateY(0); }
  .rp-btn.loading { opacity: 0.75; pointer-events: none; }

  .rp-spinner {
    width: 18px; height: 18px;
    border: 3px solid rgba(255,255,255,0.4); border-top-color: #fff;
    border-radius: 50%; animation: rpSpin 0.7s linear infinite;
  }
  @keyframes rpSpin { to { transform: rotate(360deg); } }

  /* Error */
  .rp-error {
    background: #fff0f0; border: 1.5px solid #ffd0d0;
    border-radius: 12px; padding: 10px 14px;
    font-size: 0.82rem; font-weight: 700; color: #e53935;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
    animation: rpShake 0.4s ease;
  }
  @keyframes rpShake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-6px); }
    40%,80%  { transform: translateX(6px); }
  }

  /* Login link */
  .rp-login { text-align: center; font-size: 0.88rem; font-weight: 600; color: #aaa; }
  .rp-login-link {
    color: #185a9d; font-weight: 800; cursor: pointer;
    border: none; background: none; font-family: 'Nunito', sans-serif;
    font-size: 0.88rem; transition: opacity 0.2s;
  }
  .rp-login-link:hover { opacity: 0.7; }

  @keyframes rpFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rpBounceIn {
    0%   { transform: scale(0.3); opacity: 0; }
    60%  { transform: scale(1.1); }
    80%  { transform: scale(0.95); }
    100% { transform: scale(1); opacity: 1; }
  }

  @media (max-width: 768px) {
    .rp-left  { display: none; }
    .rp-right { width: 100%; padding: 32px 24px; }
    .rp-grid  { grid-template-columns: 1fr; }
  }
`;

// Password strength checker
const getStrength = (pw) => {
  if (!pw) return { level: 0, label: "", cls: "" };
  let score = 0;
  if (pw.length >= 6)                      score++;
  if (pw.length >= 10)                     score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak",   cls: "weak" };
  if (score === 2) return { level: 2, label: "Medium", cls: "medium" };
  return              { level: 3, label: "Strong",  cls: "strong" };
};

export default function Register() {
  const navigate = useNavigate();

  const [fullName,  setFullName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [phone,     setPhone]     = useState("");
  const [district,  setDistrict]  = useState("");
  const [role,      setRole]      = useState("");
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const strength = getStrength(password);

  // Progress: count filled fields out of 6
  const filled  = [fullName, email, password, phone, district, role].filter(Boolean).length;
  const progress = Math.round((filled / 6) * 100);

  const handleRegister = () => {
    setError("");
    if (!fullName || !email || !password) {
      setError("Name, email and password are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms & conditions.");
      return;
    }

    setLoading(true);

    const existing = JSON.parse(localStorage.getItem("children")) || [];
    const newChild = {
      child_id: "C" + (existing.length + 101),
      name:     fullName,
      email:    email.toLowerCase(),
      password,
      phone,
      district,
      role,
    };

    localStorage.setItem("children", JSON.stringify([...existing, newChild]));
    // Also store as logged-in user so ChildList filter works
    localStorage.setItem("userEmail", email.toLowerCase());

    setTimeout(() => {
      setLoading(false);
      navigate("/children");
    }, 1200);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rp-root">

        {/* ── Left Panel ── */}
        <div className="rp-left">
          <div className="rp-bubble" /><div className="rp-bubble" />
          <div className="rp-bubble" /><div className="rp-bubble" />

          <div className="rp-brand">
            <span className="rp-brand-icon">🥗</span>
            <h1 className="rp-brand-title">Nutrition<br/>Passport</h1>
            <p className="rp-brand-sub">
              Monitor, track and improve children's health — one meal at a time.
            </p>
          </div>

          {/* Feature cards */}
          <div className="rp-features">
            {[
              { icon: "📊", title: "12 Health Metrics",  desc: "BMI, height, weight & more tracked" },
              { icon: "🥦", title: "Nutrition Insights",  desc: "Personalised diet recommendations"  },
              { icon: "🔔", title: "Health Alerts",       desc: "Get notified on risk indicators"    },
              { icon: "📈", title: "Growth Reports",      desc: "Visual charts & progress tracking"  },
            ].map((f) => (
              <div className="rp-feature-card" key={f.title}>
                <span className="rp-feature-icon">{f.icon}</span>
                <div className="rp-feature-title">{f.title}</div>
                <div className="rp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Nutrition stats */}
          <div className="rp-nut-stats">
            {[
              { val: "1 in 4",  label: "Children malnourished" },
              { val: "2,400+",  label: "Kids tracked"          },
              { val: "98%",     label: "Accuracy rate"         },
            ].map((s) => (
              <div className="rp-nut-stat" key={s.label}>
                <div className="rp-nut-val">{s.val}</div>
                <div className="rp-nut-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="rp-tagline">🔒 Your data is safe & encrypted</div>
        </div>

        {/* ── Right Panel ── */}
        <div className="rp-right">
          <div className="rp-form-wrap">
            <div className="rp-form-header">
              <h2 className="rp-welcome">Create your<br/><span>account ✨</span></h2>
              <p className="rp-sub">Fill in the details below to get started</p>
            </div>

            {/* Progress */}
            <div className="rp-progress-wrap">
              <div className="rp-progress-label">
                <span>Profile Completion</span>
                <span>{progress}%</span>
              </div>
              <div className="rp-progress-bar">
                <div className="rp-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {error && <div className="rp-error">⚠️ {error}</div>}

            {/* Row 1 */}
            <div className="rp-grid">
              <div className="rp-field span2">
                <label className="rp-label">Full Name</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">👤</span>
                  <input
                    className="rp-input" placeholder="Your full name"
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="rp-grid" style={{ marginBottom: 14 }}>
              <div className="rp-field span2">
                <label className="rp-label">Email Address</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">📧</span>
                  <input
                    className="rp-input" type="email" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="rp-grid" style={{ marginBottom: 14 }}>
              <div className="rp-field">
                <label className="rp-label">Phone</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">📱</span>
                  <input
                    className="rp-input" placeholder="+94 77 000 0000"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="rp-field">
                <label className="rp-label">District</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">📍</span>
                  <select className="rp-select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                    <option value="">Select</option>
                    {["Colombo","Gampaha","Kandy","Galle","Jaffna","Kurunegala","Matara","Ratnapura","Badulla","Anuradhapura"].map(d => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="rp-grid" style={{ marginBottom: 14 }}>
              <div className="rp-field span2">
                <label className="rp-label">I am a</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Parent", "Guardian", "Teacher"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 13,
                        border: `2px solid ${role === r ? "#43cea2" : "#e0eef8"}`,
                        background: role === r ? "#edfaf5" : "#fff",
                        color: role === r ? "#185a9d" : "#aaa",
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: "0.85rem", fontWeight: 800, cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {r === "Parent" ? "👨‍👩‍👧 " : r === "Guardian" ? "🧑 " : "🏫 "}{r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="rp-grid" style={{ marginBottom: 6 }}>
              <div className="rp-field span2">
                <label className="rp-label">Password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">🔑</span>
                  <input
                    className="rp-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: 44 }}
                  />
                  <button className="rp-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {password && (
                  <>
                    <div className="rp-strength">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`rp-strength-bar ${i <= strength.level ? strength.cls : ""}`} />
                      ))}
                    </div>
                    <div className={`rp-strength-lbl ${strength.cls}`}>{strength.label} password</div>
                  </>
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="rp-terms" onClick={() => setAgreed(!agreed)} style={{ marginTop: 12 }}>
              <div className={`rp-check-box ${agreed ? "checked" : ""}`}>{agreed && "✓"}</div>
              <span className="rp-terms-txt">
                I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span> of Nutrition Passport
              </span>
            </label>

            {/* Register Button */}
            <button className={`rp-btn ${loading ? "loading" : ""}`} onClick={handleRegister}>
              {loading
                ? <><div className="rp-spinner" /> Creating account...</>
                : <>Create Account 🚀</>
              }
            </button>

            <p className="rp-login">
              Already have an account?{" "}
              <button className="rp-login-link" onClick={() => navigate("/")}>
                Sign in →
              </button>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}