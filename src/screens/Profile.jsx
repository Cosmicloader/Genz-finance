import { useState } from "react";
import { useApp } from "../context/AppContext";

const ACHIEVEMENTS = [
  { id: "a1", emoji: "🔥", title: "14-Day Streak",   desc: "Logged in 14 days straight",        unlocked: true  },
  { id: "a2", emoji: "💳", title: "Zero Impulse",    desc: "No impulse buys for 7 days",         unlocked: true  },
  { id: "a3", emoji: "🏆", title: "Goal Getter",     desc: "Created first savings goal",          unlocked: true  },
  { id: "a4", emoji: "🛡️", title: "Insured",         desc: "Bought micro-insurance policy",       unlocked: true  },
  { id: "a5", emoji: "📈", title: "Trader",           desc: "Completed 5 sandbox trades",          unlocked: false },
  { id: "a6", emoji: "👥", title: "Squad Goals",      desc: "Joined a shared wallet group",        unlocked: true  },
  { id: "a7", emoji: "🧠", title: "Finance Nerd",    desc: "Passed 3 financial quizzes",          unlocked: false },
  { id: "a8", emoji: "⭐", title: "Top Scorer",       desc: "Reach 800 Growth Score",              unlocked: false },
];

const XP_LEVELS = [
  { label: "Broke Beginner",  min: 0,   color: "#64748b" },
  { label: "Budget Buddy",    min: 300,  color: "#06b6d4" },
  { label: "Smart Spender",   min: 600,  color: "#8b5cf6" },
  { label: "Money Master",    min: 800,  color: "#ec4899" },
  { label: "Financial God",   min: 950,  color: "#f59e0b" },
];

function getLevel(score) {
  return [...XP_LEVELS].reverse().find((l) => score >= l.min) || XP_LEVELS[0];
}

export default function Profile() {
  const { user, wallet, growthScore, goals, trading } = useApp();
  const [activeTab, setActiveTab] = useState("stats");
  const level = getLevel(growthScore.current);
  const nextLevel = XP_LEVELS[XP_LEVELS.indexOf(level) + 1];
  const scorePercent = Math.round((growthScore.current / growthScore.max) * 100);

  const stats = [
    { label: "Balance",       value: `₹${wallet.balance.toLocaleString()}`, icon: "💳", color: "#10b981" },
    { label: "Goals Active",  value: goals.length,                            icon: "🎯", color: "#7c3aed" },
    { label: "Coins",         value: `✦ ${wallet.coins}`,                    icon: "⚡", color: "#f59e0b" },
    { label: "Trades Done",   value: trading.quizzesPassed * 3,              icon: "📈", color: "#06b6d4" },
    { label: "Day Streak",    value: `${trading.dayStreak}🔥`,               icon: "🔥", color: "#ec4899" },
    { label: "Score",         value: growthScore.current,                     icon: "⭐", color: "#a78bfa" },
  ];

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.unlocked);

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Hero Banner */}
      <div style={{
        margin: "0 0 0",
        padding: "32px 20px 24px",
        background: "linear-gradient(160deg, rgba(124,58,237,0.2), rgba(236,72,153,0.12), rgba(10,10,20,0.8))",
        borderBottom: "1px solid var(--glass-border)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow orb */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", display: "flex", gap: "16px", alignItems: "center" }}>
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "22px",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", fontWeight: 800, color: "white",
              boxShadow: "0 0 30px rgba(124,58,237,0.5)",
            }}>
              {user.avatar}
            </div>
            <div style={{
              position: "absolute", bottom: -4, right: -4,
              background: level.color, borderRadius: "100px",
              padding: "2px 7px", fontSize: "9px", fontWeight: 800,
              color: "white", border: "2px solid var(--bg-primary)",
              whiteSpace: "nowrap",
            }}>
              Lv.{XP_LEVELS.indexOf(level) + 1}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px" }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{user.email}</div>
            <div style={{ marginTop: "6px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span className="badge badge-purple" style={{ fontSize: "10px" }}>✦ {level.label}</span>
              <span className="badge badge-green" style={{ fontSize: "10px" }}>Member since {user.joined}</span>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
              Growth Score — <span style={{ color: "var(--accent-purple-light)" }}>{growthScore.current}</span>
            </span>
            {nextLevel && (
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {nextLevel.min - growthScore.current} to {nextLevel.label}
              </span>
            )}
          </div>
          <div className="progress-bar" style={{ height: "8px" }}>
            <div className="progress-fill" style={{
              width: `${scorePercent}%`,
              background: `linear-gradient(90deg, ${level.color}, #ec4899)`,
            }} />
          </div>
        </div>

        {/* Guardian info */}
        {user.guardian && (
          <div style={{
            marginTop: "14px", display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 12px", background: "rgba(16,185,129,0.08)",
            borderRadius: "10px", border: "1px solid rgba(16,185,129,0.18)",
          }}>
            <div className="glow-dot glow-dot-green" />
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{user.guardian.name}</strong> can see your score & goals
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="pill-tabs" style={{ marginTop: "16px" }}>
        {["stats", "achievements", "settings"].map((t) => (
          <button
            key={t}
            className={`pill-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
            id={`profile-tab-${t}`}
          >
            {t === "stats" ? "📊 Stats" : t === "achievements" ? "🏆 Badges" : "⚙ Settings"}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div style={{ padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }} className="stagger">
            {stats.map((s, i) => (
              <div key={i} className="card" style={{
                padding: "14px 12px",
                background: `linear-gradient(135deg, ${s.color}18, rgba(10,10,20,0.6))`,
                border: `1px solid ${s.color}28`,
              }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{s.icon}</div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Level progression */}
          <div className="card" style={{ marginTop: "14px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>
              Level Progression
            </div>
            <div style={{ display: "flex", gap: "0", position: "relative" }}>
              {XP_LEVELS.map((lv, i) => {
                const reached = growthScore.current >= lv.min;
                const isCurrent = level.label === lv.label;
                return (
                  <div key={i} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", margin: "0 auto",
                      background: reached ? lv.color : "rgba(255,255,255,0.08)",
                      border: isCurrent ? `3px solid ${lv.color}` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px",
                      boxShadow: reached ? `0 0 10px ${lv.color}60` : "none",
                      transition: "all 0.3s",
                    }}>
                      {reached ? "✓" : i + 1}
                    </div>
                    {i < XP_LEVELS.length - 1 && (
                      <div style={{
                        position: "absolute", top: "14px",
                        left: "50%", width: "100%", height: "2px",
                        background: reached && growthScore.current >= XP_LEVELS[i + 1]?.min
                          ? `linear-gradient(90deg, ${lv.color}, ${XP_LEVELS[i+1].color})`
                          : "rgba(255,255,255,0.07)",
                        zIndex: -1,
                      }} />
                    )}
                    <div style={{ fontSize: "9px", color: reached ? "var(--text-secondary)" : "var(--text-muted)", marginTop: "6px", fontWeight: 600, lineHeight: 1.2 }}>
                      {lv.label.split(" ")[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div style={{ padding: "0 20px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }} className="stagger">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                className="card"
                style={{
                  opacity: a.unlocked ? 1 : 0.4,
                  background: a.unlocked
                    ? "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(236,72,153,0.08))"
                    : "var(--bg-card)",
                  border: a.unlocked ? "1px solid rgba(124,58,237,0.25)" : "1px dashed rgba(255,255,255,0.08)",
                  padding: "14px",
                  filter: a.unlocked ? "none" : "grayscale(50%)",
                }}
              >
                <div style={{ fontSize: "28px" }}>{a.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: "13px", marginTop: "8px" }}>{a.title}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "3px", lineHeight: "1.4" }}>{a.desc}</div>
                <div style={{ marginTop: "8px" }}>
                  {a.unlocked
                    ? <span className="badge badge-green" style={{ fontSize: "9px" }}>Earned ✓</span>
                    : <span className="badge" style={{ fontSize: "9px", background: "rgba(255,255,255,0.06)", color: "var(--text-muted)", border: "1px solid var(--glass-border)" }}>Locked</span>
                  }
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "var(--text-muted)" }}>
            {unlockedAchievements.length}/{ACHIEVEMENTS.length} badges earned
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "10px" }} className="stagger">
          {[
            { label: "Push Notifications", value: true,  icon: "🔔" },
            { label: "Fin AI Suggestions", value: true,  icon: "✦"  },
            { label: "Guardian Mode",      value: true,  icon: "👀" },
            { label: "Dark Mode",          value: true,  icon: "🌙" },
            { label: "Heads-Up Alerts",    value: true,  icon: "⚡" },
          ].map((setting, i) => (
            <div key={i} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "18px" }}>{setting.icon}</span>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{setting.label}</span>
              </div>
              <div style={{
                width: "44px", height: "24px", borderRadius: "100px",
                background: setting.value ? "linear-gradient(135deg, #7c3aed, #9333ea)" : "rgba(255,255,255,0.08)",
                position: "relative",
                boxShadow: setting.value ? "0 0 10px rgba(124,58,237,0.35)" : "none",
              }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "white", position: "absolute", top: "3px",
                  left: setting.value ? "23px" : "3px",
                }} />
              </div>
            </div>
          ))}

          <div className="divider" />

          <div className="card" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
            <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px", color: "var(--accent-red-light)" }}>⚠️ Danger Zone</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "14px" }}>These actions cannot be undone.</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-danger btn-sm" style={{ flex: 1 }}>Reset Score</button>
              <button className="btn btn-danger btn-sm" style={{ flex: 1 }}>Delete Account</button>
            </div>
          </div>

          <div className="card" style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✦</div>
            <div style={{ fontWeight: 800, fontSize: "16px" }} className="gradient-text">FinOS v1.0</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Your Gen-Z Financial Godfather</div>
          </div>
        </div>
      )}
    </div>
  );
}
