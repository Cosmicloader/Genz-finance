import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function MacroModal({ onClose }) {
  const { macros, activateMacro } = useApp();
  const [loading, setLoading] = useState(null);
  const [activated, setActivated] = useState(null);

  const handleActivate = (id) => {
    setLoading(id);
    setTimeout(() => {
      activateMacro(id);
      setLoading(null);
      setActivated(id);
    }, 1500);
  };

  const macroColors = {
    mac1: { from: "#7c3aed", to: "#6366f1" },
    mac2: { from: "#ef4444", to: "#f59e0b" },
    mac3: { from: "#06b6d4", to: "#7c3aed" },
    mac4: { from: "#10b981", to: "#06b6d4" },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90dvh", overflowY: "auto" }}>
        <div className="modal-handle" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <div style={{ fontWeight: 800, fontSize: "22px" }}>⚡ Smart Macros</div>
          <span className="badge badge-cyan">Auto-Pilot</span>
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
          Pick your life situation. Fin sets up your budget instantly — like an equalizer preset for your money.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {macros.map((macro) => {
            const colors = macroColors[macro.id] || macroColors.mac1;
            const isActive = macro.active;
            const justActivated = activated === macro.id;

            return (
              <div
                key={macro.id}
                className="card"
                style={{
                  border: isActive ? `1px solid ${colors.from}55` : "1px solid var(--glass-border)",
                  background: isActive
                    ? `linear-gradient(135deg, ${colors.from}15, ${colors.to}08)`
                    : "var(--bg-card)",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ fontSize: "28px" }}>{macro.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        {macro.name}
                        {isActive && <span className="badge badge-green" style={{ fontSize: "10px" }}>Active</span>}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px", maxWidth: "200px" }}>
                        {macro.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Splits */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                  {macro.splits.map((split, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: split.color, flexShrink: 0,
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{split.label}</span>
                          <span style={{ fontSize: "12px", fontWeight: 700 }}>₹{split.amount.toLocaleString()} ({split.percent}%)</span>
                        </div>
                        <div className="progress-bar" style={{ height: "3px" }}>
                          <div
                            className="progress-fill"
                            style={{ width: `${split.percent}%`, background: split.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {isActive ? (
                  <div style={{
                    padding: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px",
                    fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5",
                  }}>
                    ✦ Fin: "{justActivated
                      ? `I've set up your ${macro.name} budget. I'll nudge you if any category goes over limit.`
                      : `Your ${macro.name} macro is running. Track your spending below.`}"
                  </div>
                ) : (
                  <button
                    className="btn"
                    style={{
                      width: "100%",
                      background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                      color: "white", padding: "12px",
                      boxShadow: `0 4px 15px ${colors.from}40`,
                    }}
                    onClick={() => handleActivate(macro.id)}
                    disabled={loading === macro.id}
                  >
                    {loading === macro.id
                      ? <><div className="spinner" /><span>Fin is configuring...</span></>
                      : `Activate ${macro.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button className="btn btn-secondary" style={{ width: "100%", marginTop: "16px" }} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
