import { useParams } from "react-router-dom";
import { useState } from "react";
import { Bar, Radar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale,
  RadialLinearScale, PointElement, LineElement, ArcElement,
  Tooltip, Legend, Filler
} from "chart.js";
import Navbar from "../components/Navbar";

ChartJS.register(
  BarElement, CategoryScale, LinearScale,
  RadialLinearScale, PointElement, LineElement, ArcElement,
  Tooltip, Legend, Filler
);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap');

  .cp-root {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f4ff 0%, #e8faf5 50%, #fff8f0 100%);
    font-family: 'Nunito', sans-serif;
    padding-bottom: 60px;
  }

  /* ── HERO BANNER ── */
  .cp-hero {
    background: linear-gradient(135deg, #185a9d 0%, #43cea2 100%);
    padding: 48px 40px 80px;
    position: relative;
    overflow: hidden;
  }

  .cp-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .cp-hero-bubble {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.07);
    animation: cpFloat 7s ease-in-out infinite;
  }
  .cp-hero-bubble:nth-child(1) { width:220px;height:220px;top:-80px;right:-60px;animation-delay:0s; }
  .cp-hero-bubble:nth-child(2) { width:140px;height:140px;bottom:-40px;left:10%;animation-delay:2s; }
  .cp-hero-bubble:nth-child(3) { width:80px;height:80px;top:30%;right:20%;animation-delay:4s; }

  @keyframes cpFloat {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-16px); }
  }

  .cp-hero-content {
    position: relative; z-index: 2;
    max-width: 900px; margin: 0 auto;
    display: flex; align-items: center; gap: 28px;
  }

  .cp-avatar {
    width: 90px; height: 90px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 4px solid rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    font-size: 2.8rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    flex-shrink: 0;
    animation: cpBounce 0.8s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes cpBounce {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  .cp-hero-info { flex: 1; }

  .cp-hero-name {
    font-family: 'Baloo 2', cursive;
    font-size: 2.2rem; font-weight: 800; color: #fff;
    margin: 0 0 4px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }

  .cp-hero-meta {
    display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;
  }

  .cp-hero-chip {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 20px; padding: 4px 14px;
    font-size: 0.82rem; font-weight: 700; color: #fff;
  }

  .cp-bmi-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 18px; border-radius: 30px;
    font-size: 0.9rem; font-weight: 800;
    backdrop-filter: blur(6px);
  }
  .cp-bmi-badge.danger  { background: rgba(229,57,53,0.25); border: 1.5px solid rgba(229,57,53,0.5); color: #fff; }
  .cp-bmi-badge.success { background: rgba(67,206,162,0.25); border: 1.5px solid rgba(67,206,162,0.5); color: #fff; }
  .cp-bmi-badge.warning { background: rgba(251,192,45,0.25); border: 1.5px solid rgba(251,192,45,0.5); color: #fff; }

  /* Quick stats row */
  .cp-quick-stats {
    max-width: 900px; margin: -36px auto 0;
    padding: 0 40px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    position: relative; z-index: 3;
  }

  .cp-qs-card {
    background: #fff;
    border-radius: 20px;
    padding: 20px 16px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(24,90,157,0.10);
    animation: cpFadeUp 0.5s ease both;
    transition: transform 0.2s;
  }
  .cp-qs-card:hover { transform: translateY(-4px); }
  .cp-qs-card:nth-child(1) { animation-delay: 0.05s; }
  .cp-qs-card:nth-child(2) { animation-delay: 0.10s; }
  .cp-qs-card:nth-child(3) { animation-delay: 0.15s; }
  .cp-qs-card:nth-child(4) { animation-delay: 0.20s; }

  @keyframes cpFadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .cp-qs-icon  { font-size: 1.6rem; margin-bottom: 6px; display: block; }
  .cp-qs-val   { font-family: 'Baloo 2', cursive; font-size: 1.5rem; font-weight: 800; color: #1a1a2e; line-height: 1; }
  .cp-qs-label { font-size: 0.7rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 3px; }

  /* ── MAIN CONTENT ── */
  .cp-body {
    max-width: 900px; margin: 32px auto 0; padding: 0 40px;
  }

  .cp-section-title {
    font-family: 'Baloo 2', cursive;
    font-size: 1.1rem; font-weight: 700; color: #1a1a2e;
    margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
  }

  /* ── HEALTH INDICATORS ── */
  .cp-health-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
    margin-bottom: 32px;
  }

  .cp-hi-card {
    background: #fff; border-radius: 18px;
    padding: 18px 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    display: flex; align-items: center; gap: 14px;
    animation: cpFadeUp 0.5s ease both;
    transition: transform 0.2s;
  }
  .cp-hi-card:hover { transform: translateY(-3px); }

  .cp-hi-dot {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }
  .cp-hi-dot.good    { background: #edfaf5; }
  .cp-hi-dot.bad     { background: #fde8f4; }
  .cp-hi-dot.neutral { background: #f3f0ff; }
  .cp-hi-dot.warning { background: #fff3e0; }

  .cp-hi-label { font-size: 0.75rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; }
  .cp-hi-val   { font-size: 1rem; font-weight: 800; color: #1a1a2e; margin-top: 2px; }

  .cp-hi-badge {
    margin-left: auto; font-size: 0.7rem; font-weight: 800;
    padding: 3px 10px; border-radius: 20px;
  }
  .cp-hi-badge.good    { background: #edfaf5; color: #00b37e; }
  .cp-hi-badge.bad     { background: #fde8f4; color: #e91e8c; }
  .cp-hi-badge.warning { background: #fff3e0; color: #fb8c00; }

  /* ── CHARTS ── */
  .cp-charts-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
    margin-bottom: 32px;
  }

  .cp-chart-card {
    background: #fff; border-radius: 20px; padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    animation: cpFadeUp 0.6s 0.2s ease both;
  }

  .cp-chart-card.full { grid-column: 1 / -1; }

  /* ── RISK PANEL ── */
  .cp-risk-panel {
    background: linear-gradient(135deg, #fff8f0, #fff0f5);
    border: 2px solid #ffe0b2;
    border-radius: 20px; padding: 24px;
    margin-bottom: 32px;
    animation: cpFadeUp 0.6s 0.3s ease both;
  }

  .cp-risk-title {
    font-family: 'Baloo 2', cursive;
    font-size: 1rem; font-weight: 700; color: #e65100;
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }

  .cp-risk-items { display: flex; flex-direction: column; gap: 10px; }

  .cp-risk-item {
    display: flex; align-items: center; gap: 12px;
    background: #fff; border-radius: 12px; padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .cp-risk-icon { font-size: 1.2rem; }
  .cp-risk-text { flex: 1; }
  .cp-risk-label { font-size: 0.82rem; font-weight: 800; color: #1a1a2e; }
  .cp-risk-desc  { font-size: 0.74rem; font-weight: 600; color: #aaa; }
  .cp-risk-sev   { font-size: 0.72rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; }
  .cp-risk-sev.high   { background: #fde8f4; color: #e91e8c; }
  .cp-risk-sev.medium { background: #fff3e0; color: #fb8c00; }
  .cp-risk-sev.low    { background: #edfaf5; color: #00b37e; }

  /* ── RECOMMENDATION ── */
  .cp-rec-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;
    margin-bottom: 32px;
  }

  .cp-rec-card {
    background: #fff; border-radius: 18px; padding: 20px 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border-top: 4px solid transparent;
    animation: cpFadeUp 0.6s 0.35s ease both;
    transition: transform 0.2s;
  }
  .cp-rec-card:hover { transform: translateY(-4px); }
  .cp-rec-card.food     { border-color: #43cea2; }
  .cp-rec-card.activity { border-color: #185a9d; }
  .cp-rec-card.health   { border-color: #e91e8c; }

  .cp-rec-icon  { font-size: 2rem; margin-bottom: 10px; display: block; }
  .cp-rec-title { font-size: 0.88rem; font-weight: 800; color: #1a1a2e; margin-bottom: 6px; }
  .cp-rec-list  { list-style: none; padding: 0; margin: 0; }
  .cp-rec-list li { font-size: 0.78rem; font-weight: 600; color: #666; padding: 3px 0; display: flex; gap: 6px; }
  .cp-rec-list li::before { content: "→"; color: #43cea2; font-weight: 800; }

  @media (max-width: 768px) {
    .cp-hero { padding: 32px 20px 70px; }
    .cp-hero-content { flex-direction: column; text-align: center; }
    .cp-quick-stats { grid-template-columns: 1fr 1fr; padding: 0 20px; }
    .cp-body { padding: 0 20px; }
    .cp-health-grid { grid-template-columns: 1fr; }
    .cp-charts-grid { grid-template-columns: 1fr; }
    .cp-rec-grid { grid-template-columns: 1fr; }
  }
`;

// BMI classification helper
const getBMIStatus = (bmi) => {
  if (bmi < 16)  return { label: "Severely Underweight ⚠️", cls: "danger",  emoji: "⚠️" };
  if (bmi < 18.5)return { label: "Underweight",              cls: "warning", emoji: "📉" };
  if (bmi < 25)  return { label: "Healthy Weight ✅",         cls: "success", emoji: "✅" };
  return               { label: "Overweight",                cls: "warning", emoji: "📈" };
};

// Indicator config
const indicatorConfig = (label, value, icon) => {
  const low  = ["Low",  "Yes", "Poor"].includes(value);
  const high = ["High", "Good"].includes(value);
  const cls  = low ? "bad" : high ? "good" : "neutral";
  const badgeCls = low ? "bad" : high ? "good" : "warning";
  return { label, value, icon, cls, badgeCls };
};

export default function ChildProfile() {
  const { id } = useParams();

  const [child] = useState({
    child_id:         "C101",
    name:             "Ananya",
    age:              8,
    gender:           "Female",
    height:           120,
    weight:           22,
    bmi:              15.2,
    activity_level:   "Moderate",
    energy_level:     "Low",
    frequent_illness: "Yes",
    pale_skin:        "Yes",
    hair_loss:        "No",
    appetite:         "Low",
  });

  const bmiStatus = getBMIStatus(child.bmi);

  const indicators = [
    indicatorConfig("Energy Level",      child.energy_level,      "⚡"),
    indicatorConfig("Activity Level",    child.activity_level,    "🏃"),
    indicatorConfig("Frequent Illness",  child.frequent_illness,  "🤒"),
    indicatorConfig("Pale Skin",         child.pale_skin,         "🩸"),
    indicatorConfig("Hair Loss",         child.hair_loss,         "💇"),
    indicatorConfig("Appetite",          child.appetite,          "🍽"),
  ];

  // Risk analysis
  const risks = [
    child.bmi < 16          && { icon:"⚠️", label:"Severe BMI Deficiency",   desc:"BMI below 16 indicates severe underweight — immediate attention needed.", sev:"high" },
    child.frequent_illness === "Yes" && { icon:"🤒", label:"Frequent Illness Pattern",  desc:"Recurrent illness may indicate weakened immune function.",               sev:"high" },
    child.pale_skin === "Yes"        && { icon:"🩸", label:"Possible Anaemia Signs",     desc:"Pale skin alongside low appetite may suggest iron deficiency.",          sev:"medium" },
    child.energy_level === "Low"     && { icon:"⚡", label:"Low Energy Levels",          desc:"Low energy could be linked to poor nutritional intake.",                 sev:"medium" },
    child.appetite === "Low"         && { icon:"🍽", label:"Reduced Appetite",           desc:"Poor appetite may lead to inadequate caloric and nutrient intake.",      sev:"medium" },
  ].filter(Boolean);

  // Bar chart
  const barData = {
    labels: ["BMI", "Energy", "Activity", "Appetite"],
    datasets: [{
      label: "Score",
      data: [
        child.bmi,
        child.energy_level   === "Low" ? 2 : child.energy_level   === "High" ? 5 : 3.5,
        child.activity_level === "Low" ? 2 : child.activity_level === "High" ? 5 : 3.5,
        child.appetite       === "Poor"? 2 : child.appetite        === "Good" ? 5 : 3.5,
      ],
      backgroundColor: ["#43cea2","#185a9d","#e91e8c","#fb8c00"],
      borderRadius: 10, borderSkipped: false,
    }],
  };

  // Radar chart
  const radarData = {
    labels: ["BMI","Energy","Activity","Immunity","Appetite","Skin Health"],
    datasets: [{
      label: child.name,
      data: [
        Math.min((child.bmi / 20) * 10, 10),
        child.energy_level   === "Low" ? 3 : child.energy_level   === "High" ? 9 : 6,
        child.activity_level === "Low" ? 3 : child.activity_level === "High" ? 9 : 6,
        child.frequent_illness === "Yes" ? 3 : 8,
        child.appetite === "Poor" ? 3 : child.appetite === "Good" ? 9 : 6,
        child.pale_skin === "Yes" ? 4 : 8,
      ],
      backgroundColor: "rgba(67,206,162,0.15)",
      borderColor: "#43cea2",
      pointBackgroundColor: "#185a9d",
      pointRadius: 5,
    }],
  };

  // Doughnut chart
  const doughnutData = {
    labels: ["Healthy", "At Risk"],
    datasets: [{
      data: [
        indicators.filter(i => i.cls === "good" || i.cls === "neutral").length,
        indicators.filter(i => i.cls === "bad").length,
      ],
      backgroundColor: ["#43cea2","#e91e8c"],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">
        <Navbar />

        {/* ── Hero ── */}
        <div className="cp-hero">
          <div className="cp-hero-bubble"/><div className="cp-hero-bubble"/><div className="cp-hero-bubble"/>
          <div className="cp-hero-content">
            <div className="cp-avatar">
              {child.gender === "Female" ? "👧" : "👦"}
            </div>
            <div className="cp-hero-info">
              <h1 className="cp-hero-name">{child.name}'s Nutrition Passport</h1>
              <div className="cp-hero-meta">
                <span className="cp-hero-chip">🆔 {child.child_id}</span>
                <span className="cp-hero-chip">🎂 {child.age} years old</span>
                <span className="cp-hero-chip">⚧ {child.gender}</span>
              </div>
              <span className={`cp-bmi-badge ${bmiStatus.cls}`}>
                {bmiStatus.emoji} BMI {child.bmi} — {bmiStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="cp-quick-stats">
          {[
            { icon:"📏", val:`${child.height} cm`, label:"Height" },
            { icon:"⚖️", val:`${child.weight} kg`, label:"Weight" },
            { icon:"📊", val:child.bmi,             label:"BMI"    },
            { icon:"🏃", val:child.activity_level,  label:"Activity"},
          ].map((s, i) => (
            <div className="cp-qs-card" key={i}>
              <span className="cp-qs-icon">{s.icon}</span>
              <div className="cp-qs-val">{s.val}</div>
              <div className="cp-qs-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="cp-body" style={{ marginTop: 40 }}>

          {/* Health Indicators */}
          <div className="cp-section-title">🩺 Health Indicators</div>
          <div className="cp-health-grid">
            {indicators.map((ind, i) => (
              <div className="cp-hi-card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className={`cp-hi-dot ${ind.cls}`}>{ind.icon}</div>
                <div>
                  <div className="cp-hi-label">{ind.label}</div>
                  <div className="cp-hi-val">{ind.value}</div>
                </div>
                <span className={`cp-hi-badge ${ind.badgeCls}`}>{ind.value}</span>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="cp-section-title">📊 Health Visualisation</div>
          <div className="cp-charts-grid">
            <div className="cp-chart-card">
              <div className="cp-section-title" style={{ fontSize:"0.9rem", marginBottom:12 }}>📈 Metric Scores</div>
              <Bar data={barData} options={{
                responsive: true, plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 20, grid: { color:"#f0f0f0" } }, x: { grid: { display: false } } }
              }} />
            </div>
            <div className="cp-chart-card">
              <div className="cp-section-title" style={{ fontSize:"0.9rem", marginBottom:12 }}>🎯 Overall Risk Split</div>
              <Doughnut data={doughnutData} options={{
                responsive: true, cutout: "70%",
                plugins: { legend: { position: "bottom", labels: { font: { family:"Nunito", weight:"700" } } } }
              }} />
            </div>
            <div className="cp-chart-card full">
              <div className="cp-section-title" style={{ fontSize:"0.9rem", marginBottom:12 }}>🕸 Health Radar</div>
              <div style={{ maxWidth: 420, margin:"0 auto" }}>
                <Radar data={radarData} options={{
                  responsive: true,
                  scales: { r: { min:0, max:10, ticks:{ display:false }, grid:{ color:"#e8f4f0" }, pointLabels:{ font:{ family:"Nunito", weight:"700", size:12 } } } },
                  plugins: { legend: { display: false } }
                }} />
              </div>
            </div>
          </div>

          {/* Risk Panel */}
          {risks.length > 0 && (
            <>
              <div className="cp-section-title">⚠️ Risk Analysis</div>
              <div className="cp-risk-panel">
                <div className="cp-risk-title">🔍 Detected Health Concerns</div>
                <div className="cp-risk-items">
                  {risks.map((r, i) => (
                    <div className="cp-risk-item" key={i}>
                      <span className="cp-risk-icon">{r.icon}</span>
                      <div className="cp-risk-text">
                        <div className="cp-risk-label">{r.label}</div>
                        <div className="cp-risk-desc">{r.desc}</div>
                      </div>
                      <span className={`cp-risk-sev ${r.sev}`}>{r.sev.charAt(0).toUpperCase()+r.sev.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Recommendations */}
          <div className="cp-section-title">💡 Recommendations</div>
          <div className="cp-rec-grid">
            <div className="cp-rec-card food">
              <span className="cp-rec-icon">🥗</span>
              <div className="cp-rec-title">Nutrition Plan</div>
              <ul className="cp-rec-list">
                <li>Iron-rich foods: spinach, lentils</li>
                <li>Protein: eggs, lean meat, beans</li>
                <li>Vitamin C to boost iron absorption</li>
                <li>5 small meals per day</li>
              </ul>
            </div>
            <div className="cp-rec-card activity">
              <span className="cp-rec-icon">🏃</span>
              <div className="cp-rec-title">Activity Plan</div>
              <ul className="cp-rec-list">
                <li>30 min light play daily</li>
                <li>Outdoor activities 3x/week</li>
                <li>Avoid strenuous exercise</li>
                <li>Yoga or stretching for energy</li>
              </ul>
            </div>
            <div className="cp-rec-card health">
              <span className="cp-rec-icon">🩺</span>
              <div className="cp-rec-title">Medical Advice</div>
              <ul className="cp-rec-list">
                <li>Check haemoglobin levels</li>
                <li>Consult paediatrician soon</li>
                <li>Monitor weight weekly</li>
                <li>Iron supplement if prescribed</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}