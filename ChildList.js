import React, { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .cl-root {
    min-height: 100vh;
    background: linear-gradient(135deg, #e0f7f4 0%, #f0f4ff 50%, #fce4f0 100%);
    font-family: 'Nunito', sans-serif;
    padding: 40px 20px;
  }

  .cl-header { text-align: center; margin-bottom: 48px; }
  .cl-header h2 {
    font-size: 2.4rem; font-weight: 900;
    background: linear-gradient(135deg, #6c63ff, #e91e8c);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; margin: 0 0 8px;
  }
  .cl-header p { color: #888; font-size: 1rem; font-weight: 600; margin: 0; }

  .cl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 28px; max-width: 1200px; margin: 0 auto;
  }

  .cl-card {
    background: #fff; border-radius: 24px;
    box-shadow: 0 8px 32px rgba(108,99,255,0.10);
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: cardIn 0.5s ease both;
  }
  .cl-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(108,99,255,0.18); }
  @keyframes cardIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

  .cl-card-banner { height: 90px; position: relative; }
  .cl-avatar {
    width: 72px; height: 72px; border-radius: 50%; border: 4px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; font-weight: 900; color: #fff;
    position: absolute; bottom: -36px; left: 24px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15); z-index: 2;
  }
  .cl-card-body { padding: 48px 24px 20px; }
  .cl-name { font-size: 1.25rem; font-weight: 800; color: #1a1a2e; margin: 0 0 4px; }
  .cl-id { font-size: 0.78rem; color: #aaa; font-weight: 600; margin: 0 0 16px; }

  .cl-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .cl-chip {
    background: #f3f0ff; color: #6c63ff; border-radius: 20px;
    padding: 4px 12px; font-size: 0.78rem; font-weight: 700;
  }
  .cl-chip.green  { background: #e6faf3; color: #00b37e; }
  .cl-chip.pink   { background: #fde8f4; color: #e91e8c; }
  .cl-chip.orange { background: #fff3e0; color: #fb8c00; }

  .cl-stats {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
    background: #f8f7ff; border-radius: 14px; padding: 14px 10px; margin-bottom: 20px;
  }
  .cl-stat { text-align: center; }
  .cl-stat-val { font-size: 1.1rem; font-weight: 800; color: #6c63ff; line-height: 1; }
  .cl-stat-lbl { font-size: 0.68rem; color: #aaa; font-weight: 700; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.04em; }

  .cl-divider { border: none; border-top: 1.5px solid #f0f0f0; margin: 0 0 16px; }

  .cl-health-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
  .cl-health-badge { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 10px; }
  .cl-health-badge.yes { background: #fde8f4; color: #e91e8c; }
  .cl-health-badge.no  { background: #e6faf3; color: #00b37e; }

  .cl-card-actions { display: flex; gap: 10px; align-items: stretch; }

  .cl-btn {
    flex: 1; padding: 11px 0; border-radius: 14px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 0.88rem; font-weight: 800;
    cursor: pointer; transition: all 0.2s ease; letter-spacing: 0.02em;
  }
  .cl-btn-view {
    background: linear-gradient(135deg, #6c63ff, #a855f7);
    color: #fff; box-shadow: 0 4px 14px rgba(108,99,255,0.3);
  }
  .cl-btn-view:hover { transform: scale(1.03); box-shadow: 0 6px 20px rgba(108,99,255,0.45); }
  .cl-btn-edit { background: #fff; color: #6c63ff; border: 2px solid #e0ddff; }
  .cl-btn-edit:hover { background: #f3f0ff; border-color: #6c63ff; }

  .cl-btn-delete {
    flex: 0 0 44px !important;
    padding: 0 !important;
    font-size: 1.15rem;
    background: #fff;
    color: #e53935;
    border: 2px solid #ffd0d0 !important;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Nunito', sans-serif;
    display: flex; align-items: center; justify-content: center;
  }
  .cl-btn-delete:hover { background: #fff0f0; border-color: #e53935 !important; transform: scale(1.1); }

  /* ── Confirm Dialog ── */
  .cl-confirm-overlay {
    position: fixed; inset: 0;
    background: rgba(20,10,40,0.6);
    backdrop-filter: blur(8px);
    z-index: 1100; display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.2s ease;
  }
  .cl-confirm-box {
    background: #fff; border-radius: 24px; padding: 36px 32px 28px;
    max-width: 360px; width: 100%; text-align: center;
    box-shadow: 0 24px 80px rgba(0,0,0,0.22);
    animation: slideUp 0.3s cubic-bezier(.22,1,.36,1);
  }
  .cl-confirm-icon { font-size: 3.2rem; margin-bottom: 14px; }
  .cl-confirm-title { font-size: 1.2rem; font-weight: 900; color: #1a1a2e; margin: 0 0 8px; }
  .cl-confirm-sub { font-size: 0.88rem; color: #aaa; font-weight: 600; margin: 0 0 28px; }
  .cl-confirm-name { color: #6c63ff; }
  .cl-confirm-actions { display: flex; gap: 12px; }
  .cl-confirm-cancel {
    flex: 1; padding: 13px; border-radius: 14px; border: 2px solid #e8e6ff;
    background: #fff; color: #6c63ff; font-family: 'Nunito', sans-serif;
    font-size: 0.9rem; font-weight: 800; cursor: pointer; transition: all 0.2s;
  }
  .cl-confirm-cancel:hover { background: #f3f0ff; }
  .cl-confirm-delete {
    flex: 1; padding: 13px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #e53935, #ff6b6b);
    color: #fff; font-family: 'Nunito', sans-serif;
    font-size: 0.9rem; font-weight: 800; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(229,57,53,0.3);
  }
  .cl-confirm-delete:hover { transform: scale(1.03); box-shadow: 0 6px 20px rgba(229,57,53,0.45); }

  /* ── Modals ── */
  .cl-overlay {
    position: fixed; inset: 0; background: rgba(20,10,40,0.55);
    backdrop-filter: blur(6px); z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .cl-modal {
    background: #fff; border-radius: 28px; width: 100%;
    max-width: 520px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0,0,0,0.25);
    animation: slideUp 0.3s cubic-bezier(.22,1,.36,1);
  }
  @keyframes slideUp { from { transform:translateY(40px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .cl-modal-header {
    padding: 28px 28px 0; display: flex; align-items: center; justify-content: space-between;
  }
  .cl-modal-title { font-size: 1.35rem; font-weight: 900; color: #1a1a2e; margin: 0; }
  .cl-modal-close {
    width: 36px; height: 36px; border-radius: 50%; border: none;
    background: #f3f0ff; color: #6c63ff; font-size: 1.2rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-weight: 900; transition: background 0.2s;
  }
  .cl-modal-close:hover { background: #e0ddff; }
  .cl-modal-body { padding: 20px 28px 28px; }

  /* View Modal */
  .cl-view-banner { height: 100px; border-radius: 18px; margin-bottom: 40px; position: relative; }
  .cl-view-avatar {
    width: 80px; height: 80px; border-radius: 50%; border: 5px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.2rem; font-weight: 900; color: #fff;
    position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .cl-view-name { text-align: center; font-size: 1.4rem; font-weight: 900; color: #1a1a2e; margin: 0 0 2px; }
  .cl-view-id   { text-align: center; color: #aaa; font-size: 0.8rem; font-weight: 600; margin-bottom: 24px; }

  .cl-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .cl-detail-item { background: #f8f7ff; border-radius: 14px; padding: 12px 14px; }
  .cl-detail-lbl { font-size: 0.7rem; font-weight: 700; color: #bbb; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
  .cl-detail-val { font-size: 0.95rem; font-weight: 800; color: #1a1a2e; }
  .cl-section-title { font-size: 0.8rem; font-weight: 800; color: #aaa; text-transform: uppercase; letter-spacing: 0.08em; margin: 20px 0 10px; }
  .cl-health-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .cl-health-item { display: flex; align-items: center; justify-content: space-between; background: #f8f7ff; border-radius: 12px; padding: 10px 14px; }
  .cl-health-lbl { font-size: 0.82rem; font-weight: 700; color: #555; }
  .cl-pill { font-size: 0.7rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; }
  .cl-pill.yes { background: #fde8f4; color: #e91e8c; }
  .cl-pill.no  { background: #e6faf3; color: #00b37e; }

  /* Edit Modal */
  .cl-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .cl-form-group { display: flex; flex-direction: column; gap: 5px; }
  .cl-form-group.full { grid-column: 1 / -1; }
  .cl-form-label { font-size: 0.75rem; font-weight: 800; color: #888; text-transform: uppercase; letter-spacing: 0.06em; }
  .cl-form-input, .cl-form-select {
    border: 2px solid #e8e6ff; border-radius: 12px; padding: 10px 14px;
    font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 700;
    color: #1a1a2e; outline: none; transition: border-color 0.2s; background: #fff;
  }
  .cl-form-input:focus, .cl-form-select:focus { border-color: #6c63ff; }
  .cl-toggle-group { display: flex; gap: 8px; }
  .cl-toggle {
    flex: 1; padding: 9px 0; border-radius: 12px; border: 2px solid #e8e6ff;
    background: #fff; font-family: 'Nunito', sans-serif; font-size: 0.82rem;
    font-weight: 800; cursor: pointer; transition: all 0.2s; color: #aaa;
  }
  .cl-toggle.active-yes { background: #fde8f4; border-color: #e91e8c; color: #e91e8c; }
  .cl-toggle.active-no  { background: #e6faf3; border-color: #00b37e; color: #00b37e; }
  .cl-save-btn {
    width: 100%; margin-top: 22px; padding: 14px; border-radius: 16px; border: none;
    background: linear-gradient(135deg, #6c63ff, #e91e8c); color: #fff;
    font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 900;
    cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 18px rgba(108,99,255,0.3);
  }
  .cl-save-btn:hover { transform: scale(1.02); box-shadow: 0 8px 28px rgba(108,99,255,0.45); }

  /* Toast */
  .cl-toast {
    position: fixed; bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(80px);
    color: #fff; padding: 14px 32px; border-radius: 40px;
    font-weight: 800; font-size: 0.95rem;
    z-index: 2000; transition: transform 0.4s cubic-bezier(.22,1,.36,1);
    pointer-events: none; white-space: nowrap;
  }
  .cl-toast.save   { background: linear-gradient(135deg, #6c63ff, #e91e8c); box-shadow: 0 8px 30px rgba(108,99,255,0.35); }
  .cl-toast.delete { background: linear-gradient(135deg, #e53935, #ff6b6b); box-shadow: 0 8px 30px rgba(229,57,53,0.35); }
  .cl-toast.show   { transform: translateX(-50%) translateY(0); }

  .cl-empty { text-align: center; padding: 80px 20px; color: #bbb; font-size: 1.1rem; font-weight: 700; }
  .cl-empty span { font-size: 3rem; display: block; margin-bottom: 12px; }

  .cl-access-denied {
    text-align: center; padding: 32px; background: #fff8f0;
    border-radius: 18px; color: #fb8c00; font-weight: 800;
    font-size: 1rem; border: 2px solid #ffe0b2;
  }
`;

const PALETTES = [
  { banner: "linear-gradient(135deg,#6c63ff,#a855f7)", avatar: "#6c63ff" },
  { banner: "linear-gradient(135deg,#e91e8c,#ff6b6b)", avatar: "#e91e8c" },
  { banner: "linear-gradient(135deg,#00b37e,#00d4aa)", avatar: "#00b37e" },
  { banner: "linear-gradient(135deg,#fb8c00,#ffd600)", avatar: "#fb8c00" },
  { banner: "linear-gradient(135deg,#1976d2,#42a5f5)", avatar: "#1976d2" },
];
const palette  = (i) => PALETTES[i % PALETTES.length];
const isYesVal = (v) => v === true || v === "yes" || v === "Yes" || v === 1;

const BoolPill = ({ val }) => (
  <span className={`cl-pill ${isYesVal(val) ? "yes" : "no"}`}>
    {isYesVal(val) ? "Yes" : "No"}
  </span>
);

const HealthBadge = ({ label, val }) => (
  <span className={`cl-health-badge ${isYesVal(val) ? "yes" : "no"}`}>
    {isYesVal(val) ? "⚠ " : "✓ "}{label}
  </span>
);

// ── Confirm Delete Dialog ────────────────────────────────────────────────────
function ConfirmDelete({ childName, onCancel, onConfirm }) {
  return (
    <div className="cl-confirm-overlay" onClick={onCancel}>
      <div className="cl-confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="cl-confirm-icon">🗑️</div>
        <p className="cl-confirm-title">Delete Child Record?</p>
        <p className="cl-confirm-sub">
          This will permanently remove{" "}
          <span className="cl-confirm-name">{childName}</span> from the list.
          This cannot be undone.
        </p>
        <div className="cl-confirm-actions">
          <button className="cl-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="cl-confirm-delete" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── ViewModal ────────────────────────────────────────────────────────────────
function ViewModal({ child, idx, loggedInEmail, onClose }) {
  const p = palette(idx);
  const storedEmail = (child.email || child.parentEmail || child.registeredEmail || "").toLowerCase();
  const hasAccess   = !loggedInEmail || !storedEmail || storedEmail === loggedInEmail.toLowerCase();

  return (
    <div className="cl-overlay" onClick={onClose}>
      <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cl-modal-header">
          <p className="cl-modal-title">Child Profile</p>
          <button className="cl-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cl-modal-body">
          {!hasAccess ? (
            <div className="cl-access-denied">
              🔒 You can only view your own child's details.
            </div>
          ) : (
            <>
              <div className="cl-view-banner" style={{ background: p.banner }}>
                <div className="cl-view-avatar" style={{ background: p.avatar }}>
                  {child.name ? child.name[0].toUpperCase() : "?"}
                </div>
              </div>
              <h3 className="cl-view-name">{child.name}</h3>
              <p className="cl-view-id">ID: {child.child_id || "—"}</p>
              <div className="cl-detail-grid">
                {[
                  { l: "Age",            v: child.age            ? `${child.age} yrs` : "—" },
                  { l: "Gender",         v: child.gender         || "—" },
                  { l: "Height",         v: child.height         ? `${child.height} cm` : "—" },
                  { l: "Weight",         v: child.weight         ? `${child.weight} kg` : "—" },
                  { l: "BMI",            v: child.bmi            || "—" },
                  { l: "Activity Level", v: child.activity_level || "—" },
                  { l: "Energy Level",   v: child.energy_level   || "—" },
                  { l: "Appetite",       v: child.appetite       || "—" },
                ].map(({ l, v }) => (
                  <div className="cl-detail-item" key={l}>
                    <div className="cl-detail-lbl">{l}</div>
                    <div className="cl-detail-val">{v}</div>
                  </div>
                ))}
              </div>
              <div className="cl-section-title">Health Indicators</div>
              <div className="cl-health-grid">
                {[
                  { l: "Frequent Illness", v: child.frequent_illness },
                  { l: "Pale Skin",        v: child.pale_skin },
                  { l: "Hair Loss",        v: child.hair_loss },
                ].map(({ l, v }) => (
                  <div className="cl-health-item" key={l}>
                    <span className="cl-health-lbl">{l}</span>
                    <BoolPill val={v} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── EditModal ────────────────────────────────────────────────────────────────
function EditModal({ child, onClose, onSave }) {
  const [form, setForm] = useState({ ...child });
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (form.height && form.weight) {
      const h   = parseFloat(form.height) / 100;
      const bmi = (parseFloat(form.weight) / (h * h)).toFixed(1);
      onSave({ ...form, bmi });
    } else {
      onSave(form);
    }
  };

  const BoolToggle = ({ field }) => (
    <div className="cl-toggle-group">
      {["Yes", "No"].map((opt) => {
        const active = opt === "Yes" ? isYesVal(form[field])
          : !isYesVal(form[field]) && form[field] !== undefined && form[field] !== "";
        return (
          <button
            key={opt}
            className={`cl-toggle ${active ? (opt === "Yes" ? "active-yes" : "active-no") : ""}`}
            onClick={() => set(field, opt)}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="cl-overlay" onClick={onClose}>
      <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cl-modal-header">
          <p className="cl-modal-title">Edit — {child.name}</p>
          <button className="cl-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cl-modal-body">
          <div className="cl-form-grid">
            <div className="cl-form-group full">
              <label className="cl-form-label">Full Name</label>
              <input className="cl-form-input" value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Age</label>
              <input type="number" className="cl-form-input" value={form.age || ""} onChange={(e) => set("age", e.target.value)} />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Gender</label>
              <select className="cl-form-select" value={form.gender || ""} onChange={(e) => set("gender", e.target.value)}>
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Height (cm)</label>
              <input type="number" className="cl-form-input" value={form.height || ""} onChange={(e) => set("height", e.target.value)} />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Weight (kg)</label>
              <input type="number" className="cl-form-input" value={form.weight || ""} onChange={(e) => set("weight", e.target.value)} />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Activity Level</label>
              <select className="cl-form-select" value={form.activity_level || ""} onChange={(e) => set("activity_level", e.target.value)}>
                <option value="">Select</option>
                <option>Low</option><option>Moderate</option><option>High</option>
              </select>
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Energy Level</label>
              <select className="cl-form-select" value={form.energy_level || ""} onChange={(e) => set("energy_level", e.target.value)}>
                <option value="">Select</option>
                <option>Low</option><option>Moderate</option><option>High</option>
              </select>
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Appetite</label>
              <select className="cl-form-select" value={form.appetite || ""} onChange={(e) => set("appetite", e.target.value)}>
                <option value="">Select</option>
                <option>Poor</option><option>Normal</option><option>Good</option>
              </select>
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Frequent Illness</label>
              <BoolToggle field="frequent_illness" />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Pale Skin</label>
              <BoolToggle field="pale_skin" />
            </div>
            <div className="cl-form-group full">
              <label className="cl-form-label">Hair Loss</label>
              <BoolToggle field="hair_loss" />
            </div>
          </div>
          <button className="cl-save-btn" onClick={handleSave}>💾 Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ── ChildCard ────────────────────────────────────────────────────────────────
function ChildCard({ child, idx, onView, onEdit, onDelete }) {
  const p       = palette(idx);
  const initial = child.name ? child.name[0].toUpperCase() : "?";

  return (
    <div className="cl-card" style={{ animationDelay: `${idx * 0.08}s` }}>
      <div className="cl-card-banner" style={{ background: p.banner }}>
        <div className="cl-avatar" style={{ background: p.avatar }}>{initial}</div>
      </div>
      <div className="cl-card-body">
        <p className="cl-name">{child.name || "—"}</p>
        <p className="cl-id">ID: {child.child_id || "—"}</p>
        <div className="cl-chips">
          {child.age            && <span className="cl-chip">🎂 {child.age} yrs</span>}
          {child.gender         && <span className="cl-chip pink">⚧ {child.gender}</span>}
          {child.activity_level && <span className="cl-chip green">⚡ {child.activity_level}</span>}
          {child.appetite       && <span className="cl-chip orange">🍽 {child.appetite}</span>}
        </div>
        <div className="cl-stats">
          <div className="cl-stat">
            <div className="cl-stat-val">{child.height || "—"}</div>
            <div className="cl-stat-lbl">Height</div>
          </div>
          <div className="cl-stat">
            <div className="cl-stat-val">{child.weight || "—"}</div>
            <div className="cl-stat-lbl">Weight</div>
          </div>
          <div className="cl-stat">
            <div className="cl-stat-val">{child.bmi || "—"}</div>
            <div className="cl-stat-lbl">BMI</div>
          </div>
        </div>
        <hr className="cl-divider" />
        <div className="cl-health-row">
          <HealthBadge label="Illness"   val={child.frequent_illness} />
          <HealthBadge label="Pale Skin" val={child.pale_skin} />
          <HealthBadge label="Hair Loss" val={child.hair_loss} />
        </div>
        <div className="cl-card-actions">
          <button className="cl-btn cl-btn-view" onClick={() => onView(child, idx)}>👁 View Details</button>
          <button className="cl-btn cl-btn-edit" onClick={() => onEdit(child, idx)}>✏️ Edit</button>
          <button className="cl-btn-delete" onClick={() => onDelete(child, idx)} title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ChildList ───────────────────────────────────────────────────────────
function ChildList() {
  const [children,       setChildren]       = useState([]);
  const [viewTarget,     setViewTarget]     = useState(null);
  const [editTarget,     setEditTarget]     = useState(null);
  const [deleteTarget,   setDeleteTarget]   = useState(null); // { child, idx }
  const [toast,          setToast]          = useState(null); // "save" | "delete" | null

  const loggedInEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email")     ||
    localStorage.getItem("loggedInUser") || "";

  useEffect(() => {
    const stored       = JSON.parse(localStorage.getItem("children")) || [];
    const loggedEmail  = (localStorage.getItem("userEmail") || localStorage.getItem("email") || "").toLowerCase();
    const loggedUser   = (localStorage.getItem("username")  || localStorage.getItem("userName") || "").toLowerCase();
    const emailPrefix  = loggedEmail.includes("@") ? loggedEmail.split("@")[0] : "";

    const filtered = stored.filter((c) => {
      const cEmail = (c.email || c.parentEmail || c.registeredEmail || "").toLowerCase();
      const cUser  = (c.username || c.userName || "").toLowerCase();
      const cName  = (c.name || "").toLowerCase();
      return (
        (loggedEmail  && cEmail === loggedEmail)  ||
        (loggedUser   && cUser  === loggedUser)   ||
        (loggedUser   && cName  === loggedUser)   ||
        (emailPrefix  && cName  === emailPrefix)  ||
        (emailPrefix  && cUser  === emailPrefix)
      );
    });

    setChildren(filtered.length > 0 ? filtered : stored);
  }, []);

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), 2800);
  };

  // ── Save edit ──────────────────────────────────────────────────────────────
  const handleSaveEdit = (updated) => {
    const updatedFiltered = children.map((c, i) => i === editTarget.idx ? updated : c);
    setChildren(updatedFiltered);
    const allStored  = JSON.parse(localStorage.getItem("children")) || [];
    const targetId   = editTarget.child.child_id || editTarget.child.name;
    const updatedAll = allStored.map((c) => (c.child_id || c.name) === targetId ? updated : c);
    localStorage.setItem("children", JSON.stringify(updatedAll));
    setEditTarget(null);
    showToast("save");
  };

  // ── Confirm delete ─────────────────────────────────────────────────────────
  const handleConfirmDelete = () => {
    const { child } = deleteTarget;
    const targetId  = child.child_id || child.name;

    // Remove from screen
    const updatedFiltered = children.filter((c) => (c.child_id || c.name) !== targetId);
    setChildren(updatedFiltered);

    // Remove from full localStorage list
    const allStored  = JSON.parse(localStorage.getItem("children")) || [];
    const updatedAll = allStored.filter((c) => (c.child_id || c.name) !== targetId);
    localStorage.setItem("children", JSON.stringify(updatedAll));

    setDeleteTarget(null);
    showToast("delete");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cl-root">
        <div className="cl-header">
          <h2>👧 Registered Children</h2>
          <p>{children.length} child{children.length !== 1 ? "ren" : ""} on record</p>
        </div>

        {children.length === 0 ? (
          <div className="cl-empty">
            <span>🧒</span>
            No children registered under your account.
          </div>
        ) : (
          <div className="cl-grid">
            {children.map((child, idx) => (
              <ChildCard
                key={idx}
                child={child}
                idx={idx}
                onView={(c, i)   => setViewTarget({ child: c, idx: i })}
                onEdit={(c, i)   => setEditTarget({ child: c, idx: i })}
                onDelete={(c, i) => setDeleteTarget({ child: c, idx: i })}
              />
            ))}
          </div>
        )}
      </div>

      {viewTarget && (
        <ViewModal
          child={viewTarget.child}
          idx={viewTarget.idx}
          loggedInEmail={loggedInEmail}
          onClose={() => setViewTarget(null)}
        />
      )}

      {editTarget && (
        <EditModal
          child={editTarget.child}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          childName={deleteTarget.child.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <div className={`cl-toast ${toast ? toast : ""} ${toast ? "show" : ""}`}>
        {toast === "save"   && "✅ Changes saved successfully!"}
        {toast === "delete" && "🗑️ Child record deleted!"}
      </div>
    </>
  );
}

export default ChildList;