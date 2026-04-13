import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import InsuranceModal from "../components/InsuranceModal";
import MacroModal from "../components/MacroModal";

// Animated number counter
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

const headsUpColors = {
  "price-drop": { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", dot: "#10b981", glow: "rgba(16,185,129,0.15)" },
  "score":      { bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.25)", dot: "#a78bfa", glow: "rgba(124,58,237,0.15)" },
  "drain":      { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)",  dot: "#ef4444", glow: "rgba(239,68,68,0.15)" },
  "friend":     { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", dot: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 6)  return "Up late? 🌙";
  if (h < 12) return "Good morning ☀️";
  if (h < 17) return "Good afternoon 👋";
  if (h < 21) return "Good evening 🌆";
  return "Night owl mode 🦉";
};

export default function Dashboard({ onOpenFin }) {
  const {
    user, wallet, growthScore, goals, headsUp, sharedWallet,
    coupons, dashboardWidgets, toggleWidget, dismissHeadsUp,
  } = useApp();

  const [showCustomize, setShowCustomize] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [showMacros, setShowMacros] = useState(false);

  const enabledWidgets = dashboardWidgets
    .filter((w) => w.enabled)
    .sort((a, b) => a.order - b.order);
  const scorePercent = Math.round((growthScore.current / growthScore.max) * 100);
  const circumference = 2 * Math.PI * 34;

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* ── Header ── */}
      <div style={{ padding: "22px 20px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.4px" }}>
            {getGreeting()}
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "-0.8px", marginTop: "2px", lineHeight: 1.1 }}>
            {user.name}
          </div>
          {user.guardian && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "5px" }}>
              <div className="glow-dot glow-dot-green" style={{ width: 5, height: 5 }} />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
                {user.guardian.name} is watching your score
              </span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowCustomize(!showCustomize)}
            style={{ fontSize: "12px" }}
          >
            ⚙ Widgets
          </button>
          <div
            className="avatar"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              width: 40, height: 40, fontSize: "14px",
              boxShadow: "0 0 16px rgba(124,58,237,0.4)",
            }}
          >
            {user.avatar}
          </div>
        </div>
      </div>

      {/* ── Customize Panel ── */}
      {showCustomize && (
        <div className="card animate-fade-in-up" style={{ margin: "12px 20px", padding: "14px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, marginBottom: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Dashboard Widgets
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {dashboardWidgets.map((w) => (
              <div key={w.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "14px", fontWeight: 500 }}>{w.name}</span>
                <button
                  id={`toggle-widget-${w.id}`}
                  onClick={() => toggleWidget(w.id)}
                  style={{
                    width: "44px", height: "24px", borderRadius: "100px",
                    background: w.enabled ? "linear-gradient(135deg, #7c3aed, #9333ea)" : "rgba(255,255,255,0.08)",
                    border: "none", cursor: "pointer", position: "relative", transition: "all 0.25s",
                    boxShadow: w.enabled ? "0 0 10px rgba(124,58,237,0.4)" : "none",
                  }}
                >
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "white",
                    position: "absolute", top: "3px",
                    left: w.enabled ? "23px" : "3px",
                    transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Heads Up Feed ── */}
      {headsUp.length > 0 && (
        <div style={{ margin: "16px 0 0" }}>
          <div className="scroll-x" style={{ paddingBottom: "6px", gap: "10px" }}>
            {headsUp.map((h, idx) => {
              const colors = headsUpColors[h.type] || headsUpColors["score"];
              return (
                <div
                  key={h.id}
                  className="animate-fade-in-up"
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "16px",
                    padding: "11px 14px",
                    minWidth: "248px",
                    flexShrink: 0,
                    animationDelay: `${idx * 0.07}s`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                    <div className="glow-dot" style={{
                      background: colors.dot,
                      boxShadow: `0 0 6px ${colors.dot}`,
                      marginTop: "6px",
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", lineHeight: "1.5", fontWeight: 500 }}>{h.message}</div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{h.time}</span>
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => dismissHeadsUp(h.id)}
                          style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px" }}
                        >
                          {h.action}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Widget Area ── */}
      <div style={{ padding: "0 20px", marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }} className="stagger">

        {/* Growth Score Widget */}
        {enabledWidgets.find((w) => w.name === "Growth Score") && (
          <div
            className="card"
            style={{
              background: "linear-gradient(145deg, rgba(124,58,237,0.18), rgba(236,72,153,0.08), rgba(10,10,20,0.6))",
              border: "1px solid rgba(124,58,237,0.28)",
              boxShadow: "0 4px 30px rgba(124,58,237,0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  Growth Score
                </div>
                <div style={{ fontSize: "52px", fontWeight: 900, lineHeight: 1, marginTop: "4px" }} className="gradient-text count-up">
                  <AnimatedNumber value={growthScore.current} />
                </div>
                <div style={{ marginTop: "6px", display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className="badge badge-green">+{growthScore.change} this week</span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{growthScore.level}</span>
                </div>
              </div>

              {/* Circular ring */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <svg width="84" height="84" className="donut-ring" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                  <circle
                    cx="42" cy="42" r="34" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="7"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={`${circumference * (1 - scorePercent / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.34,1.2,0.64,1)" }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{scorePercent}% to max</div>
              </div>
            </div>

            {/* Progress to next unlock */}
            <div style={{ marginTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Trading unlocks at 750</span>
                <span style={{ fontSize: "11px", color: "var(--accent-purple-light)", fontWeight: 700 }}>
                  {750 - growthScore.current > 0 ? `${750 - growthScore.current} pts left` : "🔓 Unlocked!"}
                </span>
              </div>
              <div className="progress-bar" style={{ height: "7px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min((growthScore.current / 750) * 100, 100)}%`,
                    background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                  }}
                />
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                7-week trend
              </div>
              <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {(() => {
                  const data = growthScore.history;
                  const min = Math.min(...data) - 20;
                  const max = Math.max(...data) + 20;
                  const w = 200, h = 40;
                  const pts = data.map((v, i) => ({
                    x: (i / (data.length - 1)) * w,
                    y: h - ((v - min) / (max - min)) * h,
                  }));
                  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                  const area = path + ` L${pts[pts.length - 1].x},${h} L0,${h} Z`;
                  return (
                    <>
                      <path d={area} fill="url(#sparkFill)" />
                      <path d={path} fill="none" stroke="url(#sparkGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {pts.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2}
                          fill={i === pts.length - 1 ? "#ec4899" : "rgba(124,58,237,0.6)"}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        )}

        {/* Wallet Balance Widget */}
        {enabledWidgets.find((w) => w.name === "Wallet Balance") && (
          <div className="card" style={{
            background: "linear-gradient(145deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06), rgba(10,10,20,0.6))",
            border: "1px solid rgba(16,185,129,0.22)",
            boxShadow: "0 4px 28px rgba(16,185,129,0.1)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  Wallet Balance
                </div>
                <div style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-1.5px", marginTop: "4px", lineHeight: 1 }} className="gradient-text-green count-up">
                  ₹<AnimatedNumber value={wallet.balance} />
                </div>
                <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
                  <div className="stat-chip">
                    <span className="stat-chip-label">In</span>
                    <span className="stat-chip-value" style={{ color: "var(--accent-green-light)" }}>+₹{wallet.totalInflow.toLocaleString()}</span>
                  </div>
                  <div className="stat-chip">
                    <span className="stat-chip-label">Out</span>
                    <span className="stat-chip-value" style={{ color: "var(--accent-red-light)" }}>-₹{wallet.totalOutflow.toLocaleString()}</span>
                  </div>
                  <div className="stat-chip">
                    <span className="stat-chip-label">Coins</span>
                    <span className="stat-chip-value" style={{ color: "var(--accent-amber-light)" }}>✦ {wallet.coins}</span>
                  </div>
                </div>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.15))",
                border: "1px solid rgba(16,185,129,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px",
              }}>
                💳
              </div>
            </div>

            {/* Mini spend bar */}
            <div style={{ marginTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Budget used</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-green-light)" }}>
                  {Math.round((wallet.totalOutflow / wallet.totalInflow) * 100)}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: "5px" }}>
                <div className="progress-fill" style={{
                  width: `${(wallet.totalOutflow / wallet.totalInflow) * 100}%`,
                  background: "linear-gradient(90deg, #10b981, #06b6d4)",
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Active Goals Widget */}
        {enabledWidgets.find((w) => w.name === "Active Goals") && (
          <div>
            <div style={{
              fontSize: "11px", fontWeight: 700, color: "var(--text-muted)",
              textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px",
            }}>
              Active Goals
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {goals.map((goal) => {
                const pct = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
                const barColor = pct >= 75 ? "linear-gradient(90deg, #10b981, #06b6d4)"
                  : pct >= 40 ? "linear-gradient(90deg, #f59e0b, #ec4899)"
                  : "linear-gradient(90deg, #7c3aed, #ec4899)";
                return (
                  <div key={goal.id} className="card card-hover">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div style={{
                          width: 46, height: 46, borderRadius: "14px",
                          background: "rgba(124,58,237,0.12)",
                          border: "1px solid rgba(124,58,237,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "22px", flexShrink: 0,
                        }}>
                          {goal.emoji}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "14px" }}>{goal.title}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                            {goal.deadline}
                            {goal.unidays && <span className="badge badge-purple" style={{ fontSize: "10px" }}>{goal.discount}</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "17px", fontWeight: 800 }}>₹{goal.savedAmount.toLocaleString()}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>of ₹{goal.targetAmount.toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: "12px" }}>
                      <div className="progress-bar" style={{ height: "6px" }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{pct}% saved</span>
                        {goal.bestDeal && (
                          <span style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 600 }}>
                            🏷 {goal.bestDeal.platform} deal available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Shared Wallet Widget */}
        {enabledWidgets.find((w) => w.name === "Shared Wallet") && (
          <div className="card" style={{ border: "1px solid rgba(245,158,11,0.22)", background: "rgba(245,158,11,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                  Shared Wallet
                </div>
                <div style={{ fontWeight: 800, fontSize: "18px", marginTop: "3px" }}>{sharedWallet.groupName}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "26px", fontWeight: 900 }} className="gradient-text-amber">
                  ₹{sharedWallet.totalPool.toLocaleString()}
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Pool Total</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {sharedWallet.members.map((m) => (
                <div key={m.id} title={m.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div
                    className="avatar"
                    style={{
                      background: m.isYou ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(255,255,255,0.1)",
                      fontSize: "11px", width: "32px", height: "32px",
                      outline: m.status === "pending" ? "2px solid var(--accent-amber)" : m.isYou ? "2px solid rgba(124,58,237,0.5)" : "none",
                      outlineOffset: "2px",
                    }}
                  >
                    {m.avatar}
                  </div>
                  <div style={{ fontSize: "9px", color: m.status === "pending" ? "var(--accent-amber-light)" : "var(--text-muted)" }}>
                    {m.status === "pending" ? "⏳" : "✓"}
                  </div>
                </div>
              ))}
            </div>
            {sharedWallet.pendingRequests.length > 0 && (
              <div style={{
                marginTop: "12px", padding: "8px 10px",
                background: "rgba(245,158,11,0.1)",
                borderRadius: "10px", fontSize: "12px",
                border: "1px solid rgba(245,158,11,0.2)",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <span>🔔</span>
                <span>{sharedWallet.pendingRequests[0].from} requested ₹{sharedWallet.pendingRequests[0].amount}</span>
              </div>
            )}
          </div>
        )}

        {/* Coupon Cartel Widget */}
        {enabledWidgets.find((w) => w.name === "Coupon Cartel") && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
              🎟 Coupon Cartel
            </div>
            <div className="scroll-x" style={{ padding: 0, gap: "10px" }}>
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="card"
                  style={{
                    minWidth: "148px", flexShrink: 0,
                    background: c.unlocked
                      ? "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(236,72,153,0.12))"
                      : "var(--bg-card)",
                    border: c.unlocked
                      ? "1px solid rgba(124,58,237,0.35)"
                      : "1px dashed rgba(255,255,255,0.1)",
                    opacity: c.unlocked ? 1 : 0.65,
                  }}
                >
                  <div style={{ fontSize: "26px" }}>{c.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: "15px", marginTop: "6px" }} className={c.unlocked ? "gradient-text" : ""}>
                    {c.discount}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{c.brand}</div>
                  <div style={{ marginTop: "8px" }}>
                    {c.unlocked
                      ? <span className="badge badge-green">Unlocked ✓</span>
                      : <span className="badge badge-purple">✦ {c.coinsRequired}</span>
                    }
                  </div>
                  {c.unlocked && (
                    <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace", letterSpacing: "1px" }}>
                      {c.code}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <button
            id="insurance-btn"
            className="card card-hover btn"
            style={{ flexDirection: "column", gap: "6px", padding: "18px 16px", alignItems: "flex-start", borderColor: "rgba(6,182,212,0.2)" }}
            onClick={() => setShowInsurance(true)}
          >
            <div style={{
              width: 40, height: 40, borderRadius: "12px",
              background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
            }}>🛡️</div>
            <span style={{ fontWeight: 700, fontSize: "14px" }}>Insurance</span>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>1 active policy</span>
          </button>
          <button
            id="macros-btn"
            className="card card-hover btn"
            style={{ flexDirection: "column", gap: "6px", padding: "18px 16px", alignItems: "flex-start", borderColor: "rgba(245,158,11,0.2)" }}
            onClick={() => setShowMacros(true)}
          >
            <div style={{
              width: 40, height: 40, borderRadius: "12px",
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
            }}>⚡</div>
            <span style={{ fontWeight: 700, fontSize: "14px" }}>Macros</span>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Hostel Mode ON</span>
          </button>
        </div>

        {/* Fin CTA */}
        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "16px", fontSize: "15px", borderRadius: "18px", gap: "8px" }}
          onClick={onOpenFin}
        >
          <span>✦</span>
          Ask Fin anything
        </button>
      </div>

      {/* Modals */}
      {showInsurance && <InsuranceModal onClose={() => setShowInsurance(false)} />}
      {showMacros && <MacroModal onClose={() => setShowMacros(false)} />}
    </div>
  );
}
