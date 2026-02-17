import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, CategoryScale,
  LinearScale, Tooltip, Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .fa-root {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f9f4 0%, #e8f4ff 50%, #fff8f0 100%);
    font-family: 'Nunito', sans-serif;
    padding: 40px 20px 60px;
  }

  /* ── HEADER ── */
  .fa-header {
    text-align: center;
    margin-bottom: 40px;
    animation: faFadeUp 0.5s ease both;
  }

  .fa-header-icon {
    font-size: 3.5rem;
    display: block;
    margin-bottom: 12px;
    animation: faBounce 0.8s cubic-bezier(.22,1,.36,1) both;
  }

  .fa-title {
    font-family: 'Baloo 2', cursive;
    font-size: 2.2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #43cea2, #185a9d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }

  .fa-subtitle {
    font-size: 0.95rem;
    font-weight: 600;
    color: #aaa;
  }

  /* ── MAIN LAYOUT ── */
  .fa-layout {
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }

  /* ── INPUT CARD ── */
  .fa-input-card {
    background: #fff;
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 8px 32px rgba(24,90,157,0.08);
    animation: faFadeUp 0.5s 0.1s ease both;
  }

  .fa-card-title {
    font-family: 'Baloo 2', cursive;
    font-size: 1.1rem;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fa-input-wrap {
    position: relative;
    margin-bottom: 14px;
  }

  .fa-input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); font-size: 1.1rem; pointer-events: none;
  }

  .fa-input {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border: 2px solid #e8f4f0;
    border-radius: 14px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a2e;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .fa-input::placeholder { color: #ccc; font-weight: 600; }
  .fa-input:focus {
    border-color: #43cea2;
    box-shadow: 0 0 0 4px rgba(67,206,162,0.12);
  }

  /* Quick pick chips */
  .fa-quick-label {
    font-size: 0.72rem;
    font-weight: 800;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 10px;
  }

  .fa-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .fa-chip {
    background: #f0f9f4;
    border: 1.5px solid #c8edd8;
    border-radius: 20px;
    padding: 5px 13px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #00916e;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .fa-chip:hover, .fa-chip.selected {
    background: #43cea2;
    border-color: #43cea2;
    color: #fff;
    transform: scale(1.05);
  }

  /* Analyze button */
  .fa-btn {
    width: 100%;
    padding: 14px;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, #43cea2, #185a9d);
    color: #fff;
    font-family: 'Baloo 2', cursive;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 6px 20px rgba(67,206,162,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .fa-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(67,206,162,0.4); }
  .fa-btn:disabled { opacity: 0.6; pointer-events: none; }

  .fa-spinner {
    width: 18px; height: 18px;
    border: 3px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: faSpin 0.7s linear infinite;
  }

  /* Portion selector */
  .fa-portion-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .fa-portion-label {
    font-size: 0.78rem; font-weight: 800; color: #888;
    text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;
  }
  .fa-portion-btns { display: flex; gap: 6px; }
  .fa-portion-btn {
    padding: 6px 14px; border-radius: 20px; border: 2px solid #e8f4f0;
    background: #fff; font-family: 'Nunito', sans-serif;
    font-size: 0.78rem; font-weight: 800; color: #aaa; cursor: pointer; transition: all 0.2s;
  }
  .fa-portion-btn.active { background: #185a9d; border-color: #185a9d; color: #fff; }

  /* ── RESULT CARD ── */
  .fa-result-card {
    background: #fff;
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 8px 32px rgba(24,90,157,0.08);
    animation: faFadeUp 0.4s ease both;
  }

  .fa-empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #ccc;
  }
  .fa-empty-icon { font-size: 3.5rem; display: block; margin-bottom: 12px; }
  .fa-empty-text { font-size: 0.9rem; font-weight: 700; }

  /* Food identity */
  .fa-food-id {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f9f4;
  }

  .fa-food-emoji {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, #f0f9f4, #e0f5ec);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
  }

  .fa-food-name {
    font-family: 'Baloo 2', cursive;
    font-size: 1.3rem;
    font-weight: 800;
    color: #1a1a2e;
    text-transform: capitalize;
    margin-bottom: 4px;
  }

  .fa-food-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .fa-food-tag {
    font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 8px;
  }
  .fa-food-tag.veg  { background: #edfaf5; color: #00b37e; }
  .fa-food-tag.iron { background: #fff3e0; color: #fb8c00; }
  .fa-food-tag.prot { background: #e8f0ff; color: #185a9d; }
  .fa-food-tag.cal  { background: #fde8f4; color: #e91e8c; }

  /* Macro pills */
  .fa-macros {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 18px;
  }

  .fa-macro {
    text-align: center;
    padding: 14px 8px;
    border-radius: 16px;
    transition: transform 0.2s;
  }
  .fa-macro:hover { transform: scale(1.04); }
  .fa-macro-val { font-family:'Baloo 2',cursive; font-size:1.4rem; font-weight:800; line-height:1; }
  .fa-macro-unit{ font-size:0.65rem; font-weight:800; opacity:0.7; }
  .fa-macro-lbl { font-size:0.68rem; font-weight:700; margin-top:3px; text-transform:uppercase; letter-spacing:0.05em; opacity:0.75; }

  /* Micro nutrients */
  .fa-micros {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 18px;
  }

  .fa-micro-row { display: flex; align-items: center; gap: 10px; }
  .fa-micro-icon{ font-size: 0.9rem; width:20px; text-align:center; }
  .fa-micro-label{ font-size:0.78rem; font-weight:700; color:#555; width:80px; }
  .fa-micro-bar {
    flex:1; height:7px; background:#f0f0f0; border-radius:10px; overflow:hidden;
  }
  .fa-micro-fill {
    height:100%; border-radius:10px; transition: width 1s ease;
  }
  .fa-micro-val { font-size:0.75rem; font-weight:800; color:#1a1a2e; width:36px; text-align:right; }

  /* Recommendation banner */
  .fa-rec-banner {
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .fa-rec-icon { font-size: 1.5rem; }
  .fa-rec-title { font-size:0.85rem; font-weight:800; color:#1a1a2e; }
  .fa-rec-sub   { font-size:0.74rem; font-weight:600; color:#666; }

  /* Match children */
  .fa-match-title {
    font-size:0.72rem; font-weight:800; color:#bbb;
    text-transform:uppercase; letter-spacing:0.07em; margin-bottom:10px;
  }
  .fa-match-list { display:flex; gap:8px; flex-wrap:wrap; }
  .fa-match-chip {
    display:flex; align-items:center; gap:6px;
    background:#f0f9f4; border:1.5px solid #c8edd8;
    border-radius:20px; padding:5px 12px;
    font-size:0.78rem; font-weight:700; color:#00916e;
  }

  /* ── CHART SECTION ── */
  .fa-chart-wrap {
    max-width: 900px; margin: 24px auto 0;
    background:#fff; border-radius:24px; padding:28px;
    box-shadow:0 8px 32px rgba(24,90,157,0.08);
    animation:faFadeUp 0.5s 0.2s ease both;
  }

  @keyframes faFadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes faBounce {
    from { transform:scale(0.5); opacity:0; }
    to   { transform:scale(1); opacity:1; }
  }
  @keyframes faSpin { to { transform:rotate(360deg); } }

  @media (max-width:700px) {
    .fa-layout { grid-template-columns:1fr; }
    .fa-macros  { grid-template-columns:repeat(3,1fr); }
  }
`;

// Food database — real approximate values per 100g
const FOOD_DB = {
  rice:       { emoji:"🍚", protein:2.7,  iron:0.2, calories:130, carbs:28,  fat:0.3, vitamin_c:0,  calcium:10, tags:["carb","energy"], rec:"Good calorie source — pair with iron-rich foods",        recIcon:"⚡", recColor:"#fff3e0", matches:["Low Energy","Underweight"] },
  egg:        { emoji:"🥚", protein:13,   iron:1.8, calories:155, carbs:1.1, fat:11,  vitamin_c:0,  calcium:56, tags:["protein","iron"], rec:"Excellent protein & iron boost for growing children",   recIcon:"💪", recColor:"#e8f0ff", matches:["Iron Deficiency","Underweight"] },
  spinach:    { emoji:"🥬", protein:2.9,  iron:2.7, calories:23,  carbs:3.6, fat:0.4, vitamin_c:28, calcium:99, tags:["iron","vitamin"], rec:"Top iron source — great for anaemia prevention",        recIcon:"🩸", recColor:"#fde8f4", matches:["Iron Deficiency","Pale Skin"] },
  banana:     { emoji:"🍌", protein:1.1,  iron:0.3, calories:89,  carbs:23,  fat:0.3, vitamin_c:8,  calcium:5,  tags:["energy","carb"],  rec:"Quick energy boost — ideal for low-energy children",    recIcon:"⚡", recColor:"#fff3e0", matches:["Low Energy","Low Appetite"] },
  lentils:    { emoji:"🫘", protein:9.0,  iron:3.3, calories:116, carbs:20,  fat:0.4, vitamin_c:1,  calcium:19, tags:["protein","iron"],  rec:"Rich in iron & protein — excellent for malnourished",  recIcon:"🏆", recColor:"#edfaf5", matches:["Iron Deficiency","Underweight"] },
  milk:       { emoji:"🥛", protein:3.4,  iron:0.0, calories:61,  carbs:4.8, fat:3.3, vitamin_c:0,  calcium:113,tags:["calcium","protein"],rec:"High calcium for bone growth in children",            recIcon:"🦴", recColor:"#e8f0ff", matches:["Low Weight","Growth Issues"] },
  chicken:    { emoji:"🍗", protein:27,   iron:0.9, calories:165, carbs:0,   fat:3.6, vitamin_c:0,  calcium:15, tags:["protein","lean"],  rec:"High protein — supports muscle & immune health",       recIcon:"💪", recColor:"#e8f0ff", matches:["Underweight","Low Energy"] },
  orange:     { emoji:"🍊", protein:0.9,  iron:0.1, calories:47,  carbs:12,  fat:0.1, vitamin_c:53, calcium:40, tags:["vitamin_c","iron"], rec:"Vitamin C boosts iron absorption from other foods",   recIcon:"✨", recColor:"#fff3e0", matches:["Iron Deficiency","Frequent Illness"] },
  carrot:     { emoji:"🥕", protein:0.9,  iron:0.3, calories:41,  carbs:10,  fat:0.2, vitamin_c:6,  calcium:33, tags:["vitamin","fiber"], rec:"Beta-carotene for eye health & immunity",              recIcon:"👁️", recColor:"#fff3e0", matches:["Frequent Illness","Pale Skin"] },
  bread:      { emoji:"🍞", protein:9.0,  iron:3.6, calories:265, carbs:49,  fat:3.2, vitamin_c:0,  calcium:260,tags:["carb","iron"],     rec:"Fortified bread is a good iron source for daily diet", recIcon:"🩸", recColor:"#fde8f4", matches:["Iron Deficiency","Low Energy"] },
};

const QUICK_PICKS = [
  { label:"🥚 Egg",     val:"egg"     },
  { label:"🥬 Spinach", val:"spinach" },
  { label:"🫘 Lentils", val:"lentils" },
  { label:"🍌 Banana",  val:"banana"  },
  { label:"🍗 Chicken", val:"chicken" },
  { label:"🍊 Orange",  val:"orange"  },
];

const PORTIONS = [
  { label:"50g",  mult:0.5  },
  { label:"100g", mult:1.0  },
  { label:"200g", mult:2.0  },
];

const MACRO_COLORS = [
  { bg:"#edfaf5", val:"#00916e" },
  { bg:"#fff3e0", val:"#fb8c00" },
  { bg:"#e8f0ff", val:"#185a9d" },
];

export default function Donation() {
  const [food,      setFood]      = useState("");
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [portion,   setPortion]   = useState(1);   // multiplier index
  const [selected,  setSelected]  = useState("");
  const [notFound,  setNotFound]  = useState(false);

  const mult = PORTIONS[portion].mult;

  const analyze = (foodName) => {
    const key = (foodName || food).toLowerCase().trim();
    setNotFound(false);
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const data = FOOD_DB[key];
      if (data) {
        setResult({ ...data, name: key });
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 900);
  };

  const pickQuick = (val) => {
    setFood(val);
    setSelected(val);
    analyze(val);
  };

  const macros = result ? [
    { label:"Protein",  val:(result.protein  * mult).toFixed(1), unit:"g",   idx:0 },
    { label:"Calories", val:Math.round(result.calories * mult),  unit:"kcal",idx:1 },
    { label:"Carbs",    val:(result.carbs    * mult).toFixed(1), unit:"g",   idx:2 },
  ] : [];

  const micros = result ? [
    { icon:"🩸", label:"Iron",      val:(result.iron      * mult).toFixed(1)+" mg", pct:Math.min((result.iron*mult/8)*100,100),  color:"#e91e8c" },
    { icon:"🦴", label:"Calcium",   val:(result.calcium   * mult).toFixed(0)+" mg", pct:Math.min((result.calcium*mult/500)*100,100), color:"#185a9d" },
    { icon:"✨", label:"Vitamin C", val:(result.vitamin_c * mult).toFixed(0)+" mg", pct:Math.min((result.vitamin_c*mult/40)*100,100), color:"#fb8c00" },
    { icon:"🥑", label:"Fat",       val:(result.fat       * mult).toFixed(1)+" g",  pct:Math.min((result.fat*mult/20)*100,100),  color:"#43cea2" },
  ] : [];

  // Chart: compare this food vs daily RDA
  const chartData = result ? {
    labels: ["Protein (g)","Iron (mg)","Calcium (mg)","Vit C (mg)","Calories/10"],
    datasets:[
      {
        label: `${result.name} (${PORTIONS[portion].label})`,
        data:[
          +(result.protein*mult).toFixed(1),
          +(result.iron*mult).toFixed(1),
          +(result.calcium*mult/10).toFixed(1),
          +(result.vitamin_c*mult).toFixed(1),
          +(result.calories*mult/10).toFixed(1),
        ],
        backgroundColor:["#43cea2","#e91e8c","#185a9d","#fb8c00","#6c63ff"],
        borderRadius:10, borderSkipped:false,
      },
      {
        label:"Daily RDA (child)",
        data:[30, 8, 50, 40, 200],
        backgroundColor:"rgba(0,0,0,0.06)",
        borderRadius:10, borderSkipped:false,
      }
    ]
  } : null;

  return (
    <>
      <style>{styles}</style>
      <div className="fa-root">

        {/* Header */}
        <div className="fa-header">
          <span className="fa-header-icon">🧠</span>
          <h1 className="fa-title">Smart Food Analyzer</h1>
          <p className="fa-subtitle">Analyse nutrition value & match to children in need</p>
        </div>

        <div className="fa-layout">

          {/* ── Input Card ── */}
          <div className="fa-input-card">
            <div className="fa-card-title">🍽 Enter Food Item</div>

            <div className="fa-input-wrap">
              <span className="fa-input-icon">🔍</span>
              <input
                className="fa-input"
                placeholder="e.g. spinach, egg, lentils..."
                value={food}
                onChange={(e) => { setFood(e.target.value); setSelected(""); }}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
              />
            </div>

            <div className="fa-quick-label">Quick Picks</div>
            <div className="fa-chips">
              {QUICK_PICKS.map((c) => (
                <div
                  key={c.val}
                  className={`fa-chip ${selected === c.val ? "selected" : ""}`}
                  onClick={() => pickQuick(c.val)}
                >
                  {c.label}
                </div>
              ))}
            </div>

            <div className="fa-portion-row">
              <span className="fa-portion-label">Portion:</span>
              <div className="fa-portion-btns">
                {PORTIONS.map((p, i) => (
                  <button
                    key={p.label}
                    className={`fa-portion-btn ${portion === i ? "active" : ""}`}
                    onClick={() => setPortion(i)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="fa-btn" onClick={() => analyze()} disabled={loading || !food}>
              {loading
                ? <><div className="fa-spinner"/> Analysing...</>
                : <>🧠 Analyse Food</>
              }
            </button>

            {notFound && (
              <div style={{ marginTop:14, background:"#fff8f0", border:"1.5px solid #ffe0b2", borderRadius:12, padding:"12px 14px", fontSize:"0.82rem", fontWeight:700, color:"#e65100" }}>
                ⚠️ Food not found in database. Try: egg, spinach, lentils, banana, chicken, milk, rice, carrot, orange, bread.
              </div>
            )}
          </div>

          {/* ── Result Card ── */}
          <div className="fa-result-card">
            {!result ? (
              <div className="fa-empty-state">
                <span className="fa-empty-icon">🥦</span>
                <div className="fa-empty-text">Enter a food item and click<br/>Analyse to see its nutrition profile</div>
              </div>
            ) : (
              <>
                {/* Food identity */}
                <div className="fa-food-id">
                  <div className="fa-food-emoji">{result.emoji}</div>
                  <div>
                    <div className="fa-food-name">{result.name}</div>
                    <div className="fa-food-tags">
                      {result.tags.map((t) => (
                        <span key={t} className={`fa-food-tag ${t.includes("iron")?"iron":t.includes("prot")?"prot":t.includes("cal")?"cal":"veg"}`}>
                          {t}
                        </span>
                      ))}
                      <span className="fa-food-tag veg">{PORTIONS[portion].label}</span>
                    </div>
                  </div>
                </div>

                {/* Macros */}
                <div className="fa-macros">
                  {macros.map((m, i) => (
                    <div className="fa-macro" key={m.label} style={{ background:MACRO_COLORS[i].bg }}>
                      <div className="fa-macro-val" style={{ color:MACRO_COLORS[i].val }}>
                        {m.val}<span className="fa-macro-unit"> {m.unit}</span>
                      </div>
                      <div className="fa-macro-lbl" style={{ color:MACRO_COLORS[i].val }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Micros */}
                <div className="fa-micros">
                  {micros.map((m) => (
                    <div className="fa-micro-row" key={m.label}>
                      <span className="fa-micro-icon">{m.icon}</span>
                      <span className="fa-micro-label">{m.label}</span>
                      <div className="fa-micro-bar">
                        <div className="fa-micro-fill" style={{ width:`${m.pct}%`, background:m.color }}/>
                      </div>
                      <span className="fa-micro-val">{m.val}</span>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="fa-rec-banner" style={{ background:result.recColor }}>
                  <span className="fa-rec-icon">{result.recIcon}</span>
                  <div>
                    <div className="fa-rec-title">Recommendation</div>
                    <div className="fa-rec-sub">{result.rec}</div>
                  </div>
                </div>

                {/* Matched children */}
                {result.matches?.length > 0 && (
                  <>
                    <div className="fa-match-title">Best suited for children with</div>
                    <div className="fa-match-list">
                      {result.matches.map((m) => (
                        <div className="fa-match-chip" key={m}>✓ {m}</div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chart */}
        {result && chartData && (
          <div className="fa-chart-wrap">
            <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:"1rem", color:"#1a1a2e", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              📊 Nutrient Comparison vs Daily RDA (Child)
            </div>
            <Bar
              data={chartData}
              options={{
                responsive:true,
                plugins:{ legend:{ labels:{ font:{ family:"Nunito", weight:"700" }, boxWidth:12 } } },
                scales:{
                  y:{ beginAtZero:true, grid:{ color:"#f5f5f5" }, ticks:{ font:{ family:"Nunito", weight:"700" } } },
                  x:{ grid:{ display:false }, ticks:{ font:{ family:"Nunito", weight:"700" } } }
                }
              }}
            />
          </div>
        )}

      </div>
    </>
  );
}