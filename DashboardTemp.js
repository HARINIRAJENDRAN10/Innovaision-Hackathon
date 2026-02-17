import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  LineElement, CategoryScale, LinearScale, PointElement, Filler
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const getStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .db-root { min-height:100vh; background:${dark?"#0f1117":"#f0f4ff"}; font-family:'Nunito',sans-serif; transition:background 0.3s; }
  .db-layout { display:flex; min-height:100vh; }

  /* SIDEBAR */
  .db-sidebar {
    width:240px; flex-shrink:0;
    background:${dark?"linear-gradient(180deg,#1a1f2e 0%,#0d1117 100%)":"linear-gradient(180deg,#185a9d 0%,#0d3b6e 100%)"};
    display:flex; flex-direction:column; padding:32px 0;
    position:sticky; top:0; height:100vh;
    box-shadow:4px 0 24px rgba(0,0,0,0.15); transition:background 0.3s;
  }
  .db-logo { display:flex; align-items:center; gap:10px; padding:0 24px 32px; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:24px; }
  .db-logo-icon { font-size:2rem; }
  .db-logo-text { font-family:'Baloo 2',cursive; font-size:1.1rem; font-weight:800; color:#fff; line-height:1.2; }
  .db-logo-sub  { font-size:0.68rem; color:rgba(255,255,255,0.55); font-weight:700; text-transform:uppercase; letter-spacing:0.08em; }
  .db-nav-label { font-size:0.65rem; font-weight:800; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.1em; padding:0 24px; margin-bottom:8px; }
  .db-nav-item {
    display:flex; align-items:center; gap:12px; padding:12px 24px; cursor:pointer;
    font-size:0.9rem; font-weight:700; color:rgba(255,255,255,0.65);
    transition:all 0.2s; border-left:3px solid transparent; margin-bottom:2px;
  }
  .db-nav-item:hover { background:rgba(255,255,255,0.08); color:#fff; }
  .db-nav-item.active { background:rgba(255,255,255,0.12); color:#fff; border-left-color:#43cea2; }
  .db-nav-item.danger:hover { background:rgba(229,57,53,0.15); color:#ff6b6b; }
  .db-nav-icon { font-size:1.1rem; width:22px; text-align:center; }
  .db-sidebar-footer { margin-top:auto; padding:20px 24px; border-top:1px solid rgba(255,255,255,0.1); }
  .db-user-row { display:flex; align-items:center; gap:10px; }
  .db-user-av { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#43cea2,#185a9d); display:flex; align-items:center; justify-content:center; font-size:1rem; color:#fff; font-weight:800; flex-shrink:0; }
  .db-user-name { font-size:0.85rem; font-weight:800; color:#fff; }
  .db-user-role { font-size:0.7rem; color:rgba(255,255,255,0.5); font-weight:600; }

  /* MAIN */
  .db-main { flex:1; overflow-x:hidden; }
  .db-topbar { background:${dark?"#1a1f2e":"#fff"}; padding:16px 32px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 2px 12px rgba(0,0,0,${dark?"0.3":"0.05"}); position:sticky; top:0; z-index:10; transition:background 0.3s; }
  .db-topbar-title { font-family:'Baloo 2',cursive; font-size:1.2rem; font-weight:800; color:${dark?"#fff":"#1a1a2e"}; }
  .db-topbar-date  { font-size:0.82rem; font-weight:700; color:${dark?"#666":"#aaa"}; }
  .db-topbar-right { display:flex; align-items:center; gap:12px; }
  .db-notif { width:38px; height:38px; border-radius:50%; background:${dark?"#252b3b":"#f0f4ff"}; border:none; cursor:pointer; font-size:1.1rem; display:flex; align-items:center; justify-content:center; position:relative; transition:background 0.2s; }
  .db-notif:hover { background:${dark?"#2e3650":"#e0e8ff"}; }
  .db-notif-dot { position:absolute; top:6px; right:6px; width:8px; height:8px; background:#e91e8c; border-radius:50%; border:2px solid #fff; }
  .db-body { padding:28px 32px; }

  /* WELCOME */
  .db-welcome { background:linear-gradient(135deg,#185a9d 0%,#43cea2 100%); border-radius:24px; padding:28px 32px; display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; overflow:hidden; position:relative; animation:dbFadeUp 0.5s ease both; }
  .db-welcome::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='40' cy='40' r='30'/%3E%3C/g%3E%3C/svg%3E"); }
  .db-welcome-text { position:relative; z-index:1; }
  .db-welcome-hi  { font-family:'Baloo 2',cursive; font-size:1.6rem; font-weight:800; color:#fff; margin-bottom:4px; }
  .db-welcome-sub { font-size:0.9rem; color:rgba(255,255,255,0.82); font-weight:600; }
  .db-welcome-emoji { font-size:4rem; position:relative; z-index:1; animation:dbFloat 3s ease-in-out infinite; }
  @keyframes dbFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }

  /* STATS */
  .db-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-bottom:28px; }
  .db-stat-card { background:${dark?"#1a1f2e":"#fff"}; border-radius:20px; padding:22px 20px; box-shadow:0 4px 20px rgba(0,0,0,${dark?"0.3":"0.06"}); display:flex; flex-direction:column; gap:12px; animation:dbFadeUp 0.5s ease both; transition:transform 0.2s,background 0.3s; }
  .db-stat-card:hover { transform:translateY(-4px); }
  .db-stat-top { display:flex; align-items:center; justify-content:space-between; }
  .db-stat-icon-wrap { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; }
  .db-stat-trend { font-size:0.72rem; font-weight:800; padding:3px 8px; border-radius:20px; display:flex; align-items:center; gap:3px; }
  .db-stat-trend.up   { background:#edfaf5; color:#00b37e; }
  .db-stat-trend.down { background:#fde8f4; color:#e91e8c; }
  .db-stat-trend.flat { background:#f3f0ff; color:#6c63ff; }
  .db-stat-val   { font-family:'Baloo 2',cursive; font-size:2rem; font-weight:800; color:${dark?"#fff":"#1a1a2e"}; line-height:1; }
  .db-stat-label { font-size:0.78rem; font-weight:700; color:${dark?"#666":"#aaa"}; text-transform:uppercase; letter-spacing:0.05em; }
  .db-stat-bar { height:4px; background:${dark?"#252b3b":"#f0f0f0"}; border-radius:4px; overflow:hidden; }
  .db-stat-bar-fill { height:100%; border-radius:4px; transition:width 1s ease; }

  /* CARDS */
  .db-mid-grid    { display:grid; grid-template-columns:1.4fr 1fr; gap:20px; margin-bottom:28px; }
  .db-bottom-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px; }
  .db-card { background:${dark?"#1a1f2e":"#fff"}; border-radius:20px; padding:24px; box-shadow:0 4px 20px rgba(0,0,0,${dark?"0.3":"0.06"}); animation:dbFadeUp 0.5s 0.15s ease both; transition:background 0.3s; }
  .db-card-title { font-family:'Baloo 2',cursive; font-size:1rem; font-weight:800; color:${dark?"#fff":"#1a1a2e"}; margin-bottom:16px; display:flex; align-items:center; gap:8px; }

  /* RISK */
  .db-risk-list { display:flex; flex-direction:column; gap:10px; }
  .db-risk-row { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:14px; background:${dark?"#252b3b":"#f8f9ff"}; cursor:pointer; transition:background 0.2s; }
  .db-risk-row:hover { background:${dark?"#2e3650":"#eef1ff"}; }
  .db-risk-av { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1rem; color:#fff; flex-shrink:0; }
  .db-risk-name  { font-size:0.88rem; font-weight:800; color:${dark?"#fff":"#1a1a2e"}; }
  .db-risk-issue { font-size:0.72rem; font-weight:600; color:${dark?"#666":"#aaa"}; }
  .db-risk-badge { margin-left:auto; font-size:0.7rem; font-weight:800; padding:3px 10px; border-radius:20px; }
  .db-risk-badge.high   { background:#fde8f4; color:#e91e8c; }
  .db-risk-badge.medium { background:#fff3e0; color:#fb8c00; }

  /* DOUGHNUT */
  .db-donut-wrap { display:flex; flex-direction:column; align-items:center; gap:16px; }
  .db-donut-legend { display:flex; flex-direction:column; gap:8px; width:100%; }
  .db-legend-row { display:flex; align-items:center; justify-content:space-between; }
  .db-legend-left { display:flex; align-items:center; gap:8px; }
  .db-legend-dot  { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .db-legend-label{ font-size:0.8rem; font-weight:700; color:${dark?"#aaa":"#555"}; }
  .db-legend-val  { font-size:0.82rem; font-weight:800; color:${dark?"#fff":"#1a1a2e"}; }

  /* ACTIONS */
  .db-actions-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .db-action-btn { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; padding:20px 12px; border-radius:18px; border:none; cursor:pointer; font-family:'Nunito',sans-serif; font-size:0.85rem; font-weight:800; transition:all 0.2s; text-align:center; line-height:1.3; }
  .db-action-btn:hover { transform:translateY(-4px); }
  .db-action-icon { font-size:1.8rem; }
  .db-action-btn.teal   { background:linear-gradient(135deg,#edfaf5,#d0f5ea); color:#00916e; }
  .db-action-btn.blue   { background:linear-gradient(135deg,#e8f0ff,#d0e0ff); color:#185a9d; }
  .db-action-btn.pink   { background:linear-gradient(135deg,#fde8f4,#fcd0e8); color:#c01c72; }
  .db-action-btn.orange { background:linear-gradient(135deg,#fff3e0,#ffe0b0); color:#e65100; }
  .db-action-btn.teal:hover   { background:linear-gradient(135deg,#43cea2,#00b37e); color:#fff; }
  .db-action-btn.blue:hover   { background:linear-gradient(135deg,#185a9d,#0d3b6e); color:#fff; }
  .db-action-btn.pink:hover   { background:linear-gradient(135deg,#e91e8c,#c01c72); color:#fff; }
  .db-action-btn.orange:hover { background:linear-gradient(135deg,#fb8c00,#e65100); color:#fff; }

  /* FEED */
  .db-feed { display:flex; flex-direction:column; }
  .db-feed-item { display:flex; gap:14px; padding:12px 0; border-bottom:1px solid ${dark?"#252b3b":"#f5f5f5"}; }
  .db-feed-item:last-child { border-bottom:none; }
  .db-feed-dot { width:36px; height:36px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:0.9rem; }
  .db-feed-msg  { font-size:0.84rem; font-weight:700; color:${dark?"#fff":"#1a1a2e"}; }
  .db-feed-time { font-size:0.72rem; font-weight:600; color:${dark?"#555":"#bbb"}; margin-top:2px; }
  .db-feed-dot.green  { background:#edfaf5; }
  .db-feed-dot.red    { background:#fde8f4; }
  .db-feed-dot.blue   { background:#e8f0ff; }
  .db-feed-dot.orange { background:#fff3e0; }

  /* LINE CHART */
  .db-line-card { background:${dark?"#1a1f2e":"#fff"}; border-radius:20px; padding:24px; box-shadow:0 4px 20px rgba(0,0,0,${dark?"0.3":"0.06"}); margin-bottom:28px; animation:dbFadeUp 0.5s 0.25s ease both; transition:background 0.3s; }

  @keyframes dbFadeUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  /* ── OVERLAY ── */
  .db-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(6px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; animation:dbFadeIn 0.2s ease; }
  @keyframes dbFadeIn { from{opacity:0;} to{opacity:1;} }
  @keyframes dbSlideUp { from{transform:translateY(40px);opacity:0;} to{transform:translateY(0);opacity:1;} }

  /* ── SETTINGS MODAL ── */
  .db-settings-modal { background:${dark?"#1a1f2e":"#fff"}; border-radius:28px; width:100%; max-width:480px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 80px rgba(0,0,0,0.25); animation:dbSlideUp 0.3s cubic-bezier(.22,1,.36,1); }
  .db-modal-header { background:linear-gradient(135deg,#185a9d,#43cea2); padding:24px 28px; display:flex; align-items:center; justify-content:space-between; }
  .db-modal-title { font-family:'Baloo 2',cursive; font-size:1.3rem; font-weight:800; color:#fff; margin:0; }
  .db-modal-close { width:34px; height:34px; border-radius:50%; border:none; background:rgba(255,255,255,0.2); color:#fff; font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:900; transition:background 0.2s; }
  .db-modal-close:hover { background:rgba(255,255,255,0.35); }
  .db-modal-body { padding:24px 28px 28px; }

  .db-settings-section { margin-bottom:24px; }
  .db-settings-section-title { font-size:0.7rem; font-weight:800; color:${dark?"#555":"#bbb"}; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px; }

  .db-setting-row { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-radius:14px; background:${dark?"#252b3b":"#f8f9ff"}; margin-bottom:8px; transition:background 0.2s; }
  .db-setting-row:hover { background:${dark?"#2e3650":"#eef1ff"}; }
  .db-setting-left { display:flex; align-items:center; gap:12px; }
  .db-setting-icon  { font-size:1.2rem; width:28px; text-align:center; }
  .db-setting-label { font-size:0.9rem; font-weight:700; color:${dark?"#fff":"#1a1a2e"}; }
  .db-setting-desc  { font-size:0.72rem; font-weight:600; color:${dark?"#555":"#aaa"}; }

  .db-toggle { width:44px; height:24px; border-radius:12px; cursor:pointer; border:none; position:relative; transition:background 0.25s; flex-shrink:0; }
  .db-toggle.on  { background:linear-gradient(135deg,#43cea2,#185a9d); }
  .db-toggle.off { background:#ddd; }
  .db-toggle-knob { position:absolute; top:3px; width:18px; height:18px; background:#fff; border-radius:50%; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:left 0.25s; }
  .db-toggle.on  .db-toggle-knob { left:23px; }
  .db-toggle.off .db-toggle-knob { left:3px; }

  .db-theme-grid { display:flex; gap:10px; margin-bottom:10px; }
  .db-theme-opt { flex:1; padding:14px 8px; border-radius:14px; border:2px solid transparent; cursor:pointer; text-align:center; transition:all 0.2s; font-family:'Nunito',sans-serif; font-size:0.8rem; font-weight:800; }
  .db-theme-opt.selected { border-color:#43cea2; }
  .db-theme-opt.light { background:#f0f4ff; color:#185a9d; }
  .db-theme-opt.dark  { background:#1a1f2e; color:#43cea2; }
  .db-theme-icon { font-size:1.6rem; display:block; margin-bottom:6px; }

  .db-accent-row { display:flex; gap:10px; margin-bottom:10px; }
  .db-accent-dot { width:30px; height:30px; border-radius:50%; cursor:pointer; border:3px solid transparent; transition:transform 0.2s,border-color 0.2s; }
  .db-accent-dot:hover { transform:scale(1.2); }
  .db-accent-dot.selected { border-color:#fff; outline:2px solid #43cea2; }

  .db-font-btns { display:flex; gap:8px; }
  .db-font-btn { flex:1; padding:9px; border-radius:12px; border:2px solid ${dark?"#252b3b":"#e8e6ff"}; background:${dark?"#252b3b":"#fff"}; font-family:'Nunito',sans-serif; font-weight:800; cursor:pointer; transition:all 0.2s; color:${dark?"#aaa":"#888"}; }
  .db-font-btn.active { background:#43cea2; border-color:#43cea2; color:#fff; }

  .db-lang-select { width:100%; padding:11px 14px; border-radius:12px; border:2px solid ${dark?"#252b3b":"#e8e6ff"}; background:${dark?"#252b3b":"#fff"}; font-family:'Nunito',sans-serif; font-size:0.9rem; font-weight:700; color:${dark?"#fff":"#1a1a2e"}; outline:none; cursor:pointer; }

  /* ── LOGOUT MODAL ── */
  .db-logout-modal { background:${dark?"#1a1f2e":"#fff"}; border-radius:24px; padding:36px 32px; max-width:360px; width:100%; text-align:center; box-shadow:0 24px 80px rgba(0,0,0,0.25); animation:dbSlideUp 0.3s cubic-bezier(.22,1,.36,1); }
  .db-logout-icon  { font-size:3rem; margin-bottom:14px; display:block; }
  .db-logout-title { font-family:'Baloo 2',cursive; font-size:1.3rem; font-weight:800; color:${dark?"#fff":"#1a1a2e"}; margin-bottom:8px; }
  .db-logout-sub   { font-size:0.88rem; font-weight:600; color:${dark?"#666":"#aaa"}; margin-bottom:28px; }
  .db-logout-actions { display:flex; gap:12px; }
  .db-logout-cancel  { flex:1; padding:13px; border-radius:14px; border:2px solid ${dark?"#252b3b":"#e8e6ff"}; background:${dark?"#252b3b":"#fff"}; color:${dark?"#aaa":"#888"}; font-family:'Nunito',sans-serif; font-size:0.9rem; font-weight:800; cursor:pointer; transition:all 0.2s; }
  .db-logout-cancel:hover { border-color:#43cea2; color:#43cea2; }
  .db-logout-confirm { flex:1; padding:13px; border-radius:14px; border:none; background:linear-gradient(135deg,#e53935,#ff6b6b); color:#fff; font-family:'Nunito',sans-serif; font-size:0.9rem; font-weight:800; cursor:pointer; box-shadow:0 4px 14px rgba(229,57,53,0.3); transition:all 0.2s; }
  .db-logout-confirm:hover { transform:scale(1.03); }

  @media (max-width:900px) {
    .db-sidebar { display:none; }
    .db-stats-grid { grid-template-columns:1fr 1fr; }
    .db-mid-grid { grid-template-columns:1fr; }
    .db-bottom-grid { grid-template-columns:1fr; }
    .db-body { padding:20px; }
  }
`;

const RISK_CHILDREN = [
  { name:"Ananya", issue:"Severe BMI + Low Appetite",    sev:"high",   color:"#e91e8c", avatar:"👧" },
  { name:"Rohan",  issue:"Frequent Illness + Pale Skin", sev:"high",   color:"#185a9d", avatar:"👦" },
  { name:"Priya",  issue:"Low Energy + Hair Loss",       sev:"medium", color:"#43cea2", avatar:"👧" },
];

const FEED = [
  { icon:"✅", cls:"green",  msg:"Ananya's weight updated by admin",           time:"2 min ago"  },
  { icon:"⚠️", cls:"red",   msg:"New high-risk flag: Rohan — iron deficiency", time:"15 min ago" },
  { icon:"🍎", cls:"orange", msg:"Donation matched for 3 children in Galle",   time:"1 hr ago"   },
  { icon:"📊", cls:"blue",   msg:"Monthly nutrition report generated",          time:"3 hrs ago"  },
  { icon:"👶", cls:"green",  msg:"New child registered: Kavya, Colombo",        time:"5 hrs ago"  },
];

const ACCENT_COLORS = ["#43cea2","#185a9d","#e91e8c","#fb8c00","#6c63ff","#e53935"];

function Toggle({ on, onChange }) {
  return (
    <button className={`db-toggle ${on?"on":"off"}`} onClick={() => onChange(!on)}>
      <div className="db-toggle-knob"/>
    </button>
  );
}

function SettingsModal({ settings, onChange, onClose }) {
  const { dark } = settings;
  return (
    <div className="db-overlay" onClick={onClose}>
      <div className="db-settings-modal" onClick={e => e.stopPropagation()}>
        <div className="db-modal-header">
          <p className="db-modal-title">⚙️ Settings</p>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="db-modal-body">

          {/* Appearance */}
          <div className="db-settings-section">
            <div className="db-settings-section-title">🎨 Appearance</div>

            <div style={{marginBottom:14}}>
              <div style={{fontSize:"0.8rem",fontWeight:700,color:dark?"#aaa":"#888",marginBottom:8}}>Theme</div>
              <div className="db-theme-grid">
                {[{key:false,icon:"☀️",label:"Light"},{key:true,icon:"🌙",label:"Dark"}].map(t => (
                  <div
                    key={String(t.key)}
                    className={`db-theme-opt ${t.key?"dark":"light"} ${settings.dark===t.key?"selected":""}`}
                    onClick={() => onChange("dark", t.key)}
                  >
                    <span className="db-theme-icon">{t.icon}</span>{t.label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{marginBottom:14}}>
              <div style={{fontSize:"0.8rem",fontWeight:700,color:dark?"#aaa":"#888",marginBottom:8}}>Accent Colour</div>
              <div className="db-accent-row">
                {ACCENT_COLORS.map(c => (
                  <div key={c} className={`db-accent-dot ${settings.accent===c?"selected":""}`}
                    style={{background:c}} onClick={() => onChange("accent",c)}/>
                ))}
              </div>
            </div>

            <div>
              <div style={{fontSize:"0.8rem",fontWeight:700,color:dark?"#aaa":"#888",marginBottom:8}}>Font Size</div>
              <div className="db-font-btns">
                {["Small","Medium","Large"].map(f => (
                  <button key={f} className={`db-font-btn ${settings.fontSize===f?"active":""}`} onClick={() => onChange("fontSize",f)}>{f}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="db-settings-section">
            <div className="db-settings-section-title">🔧 Preferences</div>
            {[
              {key:"notifications", icon:"🔔", label:"Push Notifications",  desc:"Alerts for high-risk children"},
              {key:"compactMode",   icon:"📐", label:"Compact Mode",         desc:"Reduce spacing for more content"},
              {key:"autoSave",      icon:"💾", label:"Auto Save",            desc:"Automatically save all changes"},
              {key:"animations",    icon:"✨", label:"Animations",           desc:"Enable UI transitions & effects"},
            ].map(item => (
              <div className="db-setting-row" key={item.key}>
                <div className="db-setting-left">
                  <span className="db-setting-icon">{item.icon}</span>
                  <div>
                    <div className="db-setting-label">{item.label}</div>
                    <div className="db-setting-desc">{item.desc}</div>
                  </div>
                </div>
                <Toggle on={settings[item.key]} onChange={v => onChange(item.key,v)}/>
              </div>
            ))}
          </div>

          {/* Language */}
          <div className="db-settings-section">
            <div className="db-settings-section-title">🌐 Language</div>
            <select className="db-lang-select" value={settings.language} onChange={e => onChange("language",e.target.value)}>
              <option value="en">🇬🇧 English</option>
              <option value="si">🇱🇰 Sinhala</option>
              <option value="ta">🇮🇳 Tamil</option>
              <option value="fr">🇫🇷 French</option>
              <option value="de">🇩🇪 German</option>
            </select>
          </div>

          <button onClick={onClose} style={{width:"100%",padding:"14px",borderRadius:16,border:"none",background:"linear-gradient(135deg,#43cea2,#185a9d)",color:"#fff",fontFamily:"'Baloo 2',cursive",fontSize:"1rem",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 18px rgba(67,206,162,0.3)"}}>
            ✅ Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div className="db-overlay" onClick={onCancel}>
      <div className="db-logout-modal" onClick={e => e.stopPropagation()}>
        <span className="db-logout-icon">🚪</span>
        <div className="db-logout-title">Sign Out?</div>
        <div className="db-logout-sub">You'll be returned to the login screen. Any unsaved changes will be lost.</div>
        <div className="db-logout-actions">
          <button className="db-logout-cancel"  onClick={onCancel}>Stay</button>
          <button className="db-logout-confirm" onClick={onConfirm}>Yes, Logout</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [time,         setTime]         = useState(new Date());
  const [barFill,      setBarFill]      = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogout,   setShowLogout]   = useState(false);

  const [settings, setSettings] = useState({
    dark: false, notifications: true, compactMode: false,
    autoSave: true, animations: true,
    fontSize: "Medium", language: "en", accent: "#43cea2",
  });

  const changeSetting = (key, val) => setSettings(s => ({...s, [key]: val}));
  const dark = settings.dark;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    setTimeout(() => setBarFill(true), 300);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("email");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const userName = (localStorage.getItem("userEmail") || "Admin").split("@")[0];
  const greeting = time.getHours() < 12 ? "Good Morning" : time.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  const donutData = {
    labels:["Healthy","At Risk","Iron Deficient","Underweight"],
    datasets:[{data:[14,3,5,2],backgroundColor:["#43cea2","#e91e8c","#fb8c00","#185a9d"],borderWidth:0,hoverOffset:6}]
  };

  const lineData = {
    labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],
    datasets:[
      {label:"Healthy Children",data:[16,17,18,17,19,20,21],borderColor:"#43cea2",backgroundColor:"rgba(67,206,162,0.08)",fill:true,tension:0.4,pointBackgroundColor:"#43cea2",pointRadius:4},
      {label:"At Risk",         data:[8,7,6,7,5,4,3],        borderColor:"#e91e8c",backgroundColor:"rgba(233,30,140,0.06)",fill:true,tension:0.4,pointBackgroundColor:"#e91e8c",pointRadius:4},
    ]
  };

  const STATS = [
    {icon:"👶",label:"Total Children",val:24,trend:"+2", trendCls:"up",  color:"#e8f0ff",barColor:"#185a9d",barW:80},
    {icon:"⚠️",label:"High Risk",     val:3, trend:"-1", trendCls:"down",color:"#fde8f4",barColor:"#e91e8c",barW:12},
    {icon:"🩸",label:"Iron Deficient",val:5, trend:"same",trendCls:"flat",color:"#fff3e0",barColor:"#fb8c00",barW:20},
    {icon:"🍎",label:"Donations",     val:12,trend:"+3", trendCls:"up",  color:"#edfaf5",barColor:"#43cea2",barW:50},
  ];

  return (
    <>
      <style>{getStyles(dark)}</style>
      <div className="db-root">
        <div className="db-layout">

          {/* Sidebar */}
          <div className="db-sidebar">
            <div className="db-logo">
              <span className="db-logo-icon">🥗</span>
              <div><div className="db-logo-text">Nutrition</div><div className="db-logo-sub">Passport</div></div>
            </div>

            <div className="db-nav-label">Main Menu</div>
            {[
              {icon:"📊",label:"Dashboard",     path:"/dashboard",active:true},
              {icon:"👶",label:"Child Profiles",path:"/children"},
              {icon:"🍎",label:"Donations",     path:"/donation"},
              {icon:"📈",label:"Reports",       path:"/reports"},
            ].map(n => (
              <div key={n.label} className={`db-nav-item ${n.active?"active":""}`} onClick={() => navigate(n.path)}>
                <span className="db-nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}

            <div className="db-nav-label" style={{marginTop:20}}>Account</div>
            <div className="db-nav-item" onClick={() => setShowSettings(true)}>
              <span className="db-nav-icon">⚙️</span>Settings
            </div>
            <div className="db-nav-item danger" onClick={() => setShowLogout(true)}>
              <span className="db-nav-icon">🚪</span>Logout
            </div>

            <div className="db-sidebar-footer">
              <div className="db-user-row">
                <div className="db-user-av">{userName[0]?.toUpperCase()}</div>
                <div><div className="db-user-name">{userName}</div><div className="db-user-role">Admin</div></div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="db-main">
            <div className="db-topbar">
              <div>
                <div className="db-topbar-title">Dashboard Overview</div>
                <div className="db-topbar-date">
                  {time.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
                  {" · "}{time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                </div>
              </div>
              <div className="db-topbar-right">
                <button className="db-notif" onClick={() => setShowSettings(true)} title="Settings">⚙️</button>
                <button className="db-notif">🔔<span className="db-notif-dot"/></button>
              </div>
            </div>

            <div className="db-body">
              <div className="db-welcome">
                <div className="db-welcome-text">
                  <div className="db-welcome-hi">{greeting}, {userName}! 👋</div>
                  <div className="db-welcome-sub">Here's what's happening with children's nutrition today.</div>
                </div>
                <div className="db-welcome-emoji">🥗</div>
              </div>

              <div className="db-stats-grid">
                {STATS.map((s,i) => (
                  <div className="db-stat-card" key={i} style={{animationDelay:`${i*0.07}s`}}>
                    <div className="db-stat-top">
                      <div className="db-stat-icon-wrap" style={{background:s.color}}>{s.icon}</div>
                      <span className={`db-stat-trend ${s.trendCls}`}>{s.trendCls==="up"?"↑":s.trendCls==="down"?"↓":"→"} {s.trend}</span>
                    </div>
                    <div><div className="db-stat-val">{s.val}</div><div className="db-stat-label">{s.label}</div></div>
                    <div className="db-stat-bar"><div className="db-stat-bar-fill" style={{width:barFill?`${s.barW}%`:"0%",background:s.barColor}}/></div>
                  </div>
                ))}
              </div>

              <div className="db-mid-grid">
                <div className="db-card">
                  <div className="db-card-title">⚠️ At-Risk Children</div>
                  <div className="db-risk-list">
                    {RISK_CHILDREN.map((c,i) => (
                      <div className="db-risk-row" key={i} onClick={() => navigate("/children")}>
                        <div className="db-risk-av" style={{background:c.color}}>{c.avatar}</div>
                        <div><div className="db-risk-name">{c.name}</div><div className="db-risk-issue">{c.issue}</div></div>
                        <span className={`db-risk-badge ${c.sev}`}>{c.sev==="high"?"High Risk":"Medium"}</span>
                      </div>
                    ))}
                    <div style={{textAlign:"center",paddingTop:10,fontSize:"0.82rem",fontWeight:800,color:"#185a9d",cursor:"pointer"}} onClick={() => navigate("/children")}>View all children →</div>
                  </div>
                </div>
                <div className="db-card">
                  <div className="db-card-title">🎯 Health Split</div>
                  <div className="db-donut-wrap">
                    <div style={{width:160,height:160}}><Doughnut data={donutData} options={{cutout:"72%",plugins:{legend:{display:false}}}}/></div>
                    <div className="db-donut-legend">
                      {donutData.labels.map((l,i) => (
                        <div className="db-legend-row" key={l}>
                          <div className="db-legend-left"><div className="db-legend-dot" style={{background:donutData.datasets[0].backgroundColor[i]}}/><span className="db-legend-label">{l}</span></div>
                          <span className="db-legend-val">{donutData.datasets[0].data[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="db-line-card">
                <div className="db-card-title">📈 Health Trend — Last 7 Months</div>
                <Line data={lineData} options={{responsive:true,plugins:{legend:{labels:{font:{family:"Nunito",weight:"700"},boxWidth:12}}},scales:{y:{beginAtZero:true,grid:{color:dark?"#252b3b":"#f5f5f5"},ticks:{font:{family:"Nunito",weight:"700"},color:dark?"#666":"#aaa"}},x:{grid:{display:false},ticks:{font:{family:"Nunito",weight:"700"},color:dark?"#666":"#aaa"}}}}}/>
              </div>

              <div className="db-bottom-grid">
                <div className="db-card">
                  <div className="db-card-title">⚡ Quick Actions</div>
                  <div className="db-actions-grid">
                    {[
                      {icon:"👶",label:"View Child\nProfiles",    cls:"teal",  path:"/children"},
                      {icon:"🍎",label:"Smart Donation\nAnalyzer",cls:"orange",path:"/donation"},
                      {icon:"➕",label:"Register\nNew Child",     cls:"blue",  path:"/register"},
                      {icon:"📋",label:"Generate\nReport",        cls:"pink",  path:"/reports"},
                    ].map(a => (
                      <button key={a.label} className={`db-action-btn ${a.cls}`} onClick={() => navigate(a.path)}>
                        <span className="db-action-icon">{a.icon}</span>{a.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="db-card">
                  <div className="db-card-title">🕐 Recent Activity</div>
                  <div className="db-feed">
                    {FEED.map((f,i) => (
                      <div className="db-feed-item" key={i}>
                        <div className={`db-feed-dot ${f.cls}`}>{f.icon}</div>
                        <div><div className="db-feed-msg">{f.msg}</div><div className="db-feed-time">{f.time}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSettings && <SettingsModal settings={settings} onChange={changeSetting} onClose={() => setShowSettings(false)}/>}
      {showLogout   && <LogoutModal   onCancel={() => setShowLogout(false)} onConfirm={handleLogout}/>}
    </>
  );
}