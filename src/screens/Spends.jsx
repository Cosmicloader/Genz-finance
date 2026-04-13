import { useState } from "react";
import { useApp } from "../context/AppContext";

const categoryColors = {
  food:         "#f59e0b",
  transport:    "#06b6d4",
  shopping:     "#ec4899",
  subscription: "#7c3aed",
  utilities:    "#10b981",
  inflow:       "#10b981",
};

const CATEGORIES = [
  { label: "Food",       pct: 28, color: "#f59e0b", amount: "₹745"  },
  { label: "Shopping",   pct: 30, color: "#ec4899", amount: "₹799"  },
  { label: "Subs",       pct: 12, color: "#7c3aed", amount: "₹318"  },
  { label: "Transport",  pct:  5, color: "#06b6d4", amount: "₹120"  },
  { label: "Rent",       pct: 25, color: "#10b981", amount: "₹2,000"},
];

export default function Spends() {
  const { transactions, subscriptions, goals, wallet, cancelSubscription, addGoal } = useApp();
  const [activeTab, setActiveTab] = useState("transactions");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalEmoji, setGoalEmoji] = useState("🎯");
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const totalPhantomSavings = subscriptions
    .filter((s) => s.phantomDrain)
    .reduce((sum, s) => sum + (s.savingsIfCancelled || 0), 0);

  const usedPct = Math.round((wallet.totalOutflow / wallet.totalInflow) * 100);

  const handleCancelSub = (id) => {
    setCancellingId(id);
    setTimeout(() => {
      cancelSubscription(id);
      setCancellingId(null);
    }, 1500);
  };

  const handleAddGoal = () => {
    if (!goalTitle || !goalAmount) return;
    setLoading(true);
    setTimeout(() => {
      addGoal({
        id: `g${Date.now()}`,
        title: goalTitle,
        emoji: goalEmoji,
        targetAmount: parseInt(goalAmount),
        savedAmount: 0,
        deadline: "TBD",
        weeksLeft: null,
        status: "building",
      });
      setGoalTitle("");
      setGoalAmount("");
      setGoalEmoji("🎯");
      setShowGoalModal(false);
      setLoading(false);
    }, 1500);
  };

  const EMOJI_PICKS = ["🎯","👟","✈️","💻","📱","🎮","🏖️","🎵","📚","🛒","🏋️","🎨"];

  return (
    <div>
      {/* Header */}
      <div className="screen-header">
        <div>
          <div className="screen-title">Spends</div>
          <div className="screen-subtitle">₹{wallet.totalOutflow.toLocaleString()} out this month</div>
        </div>
        <button id="add-goal-btn" className="btn btn-primary btn-sm" onClick={() => setShowGoalModal(true)}>
          + Goal
        </button>
      </div>

      {/* Analytics Card */}
      <div style={{ margin: "0 20px 16px" }}>
        <div className="card" style={{
          background: "linear-gradient(145deg, rgba(245,158,11,0.12), rgba(236,72,153,0.07), rgba(10,10,20,0.6))",
          border: "1px solid rgba(245,158,11,0.22)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                Spend Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "3px" }}>
                <span style={{ fontSize: "36px", fontWeight: 900, color: "var(--accent-amber)" }}>68</span>
                <span style={{ fontSize: "16px", color: "var(--text-muted)" }}>/100</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Moderate spender 😌</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Budget used</div>
              <div style={{ fontSize: "22px", fontWeight: 900, color: usedPct > 80 ? "var(--accent-red)" : "var(--text-primary)" }}>
                {usedPct}%
              </div>
              <div className="progress-bar" style={{ width: "80px", marginTop: "5px", height: "5px" }}>
                <div className="progress-fill" style={{
                  width: `${usedPct}%`,
                  background: usedPct > 80
                    ? "linear-gradient(90deg, #ef4444, #f97316)"
                    : "linear-gradient(90deg, #f59e0b, #ec4899)",
                }} />
              </div>
            </div>
          </div>

          {/* Category stacked bar */}
          <div style={{ marginBottom: "4px" }}>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "7px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              By Category
            </div>
            <div style={{ display: "flex", height: "10px", borderRadius: "100px", overflow: "hidden", gap: "2px" }}>
              {CATEGORIES.map((cat, i) => (
                <div
                  key={i}
                  style={{
                    width: `${cat.pct}%`,
                    background: cat.color,
                    borderRadius: i === 0 ? "100px 0 0 100px" : i === CATEGORIES.length - 1 ? "0 100px 100px 0" : "0",
                    transition: `width 0.8s ease ${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "9px" }}>
              {CATEGORIES.map((cat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: cat.color, boxShadow: `0 0 5px ${cat.color}80` }} />
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{cat.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700 }}>{cat.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pill-tabs">
        {["transactions", "subscriptions", "goals"].map((t) => (
          <button
            key={t}
            id={`spends-tab-${t}`}
            className={`pill-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t === "transactions" ? "💸 Txns" : t === "subscriptions" ? "📱 Subs" : "🎯 Goals"}
          </button>
        ))}
      </div>

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "8px" }} className="stagger">
          {transactions.map((tx) => {
            const col = categoryColors[tx.category] || "#7c3aed";
            return (
              <div key={tx.id} className="card card-hover" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", flexShrink: 0,
                  background: `${col}18`,
                  border: `1px solid ${col}28`,
                }}>
                  {tx.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tx.description}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {tx.platform} • {tx.date}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{
                    fontWeight: 800, fontSize: "15px",
                    color: tx.type === "credit" ? "var(--accent-green-light)" : "var(--text-primary)",
                  }}>
                    {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: `${col}18`,
                      color: col,
                      border: `1px solid ${col}30`,
                      fontSize: "9px", padding: "2px 6px",
                      marginTop: "4px",
                    }}
                  >
                    {tx.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <div style={{ padding: "0 20px" }}>
          {totalPhantomSavings > 0 && (
            <div className="card animate-fade-in-up" style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.22)",
              marginBottom: "14px",
            }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "28px" }}>🚨</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--accent-red-light)" }}>
                    Phantom Drain Detected!
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Cancel unused subs → save ₹{totalPhantomSavings}/month
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} className="stagger">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="card" style={{
                border: sub.phantomDrain ? "1px solid rgba(239,68,68,0.28)" : "1px solid var(--glass-border)",
                background: sub.phantomDrain ? "rgba(239,68,68,0.06)" : "var(--bg-card)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "14px",
                    background: sub.phantomDrain ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", flexShrink: 0,
                  }}>
                    {sub.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                      {sub.name}
                      {sub.phantomDrain && <span className="badge badge-red" style={{ fontSize: "10px" }}>💸 Drain</span>}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      ₹{sub.amount}/mo • Last used {sub.lastUsed}
                    </div>
                  </div>
                  {sub.phantomDrain && (
                    <button
                      id={`cancel-sub-${sub.id}`}
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelSub(sub.id)}
                      disabled={cancellingId === sub.id}
                      style={{ flexShrink: 0 }}
                    >
                      {cancellingId === sub.id
                        ? <div className="spinner" style={{ width: 14, height: 14 }} />
                        : "Kill It"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === "goals" && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "10px" }} className="stagger">
          {goals.map((goal) => {
            const pct = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
            return (
              <div key={goal.id} className="card card-hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "14px",
                      background: "rgba(124,58,237,0.12)",
                      border: "1px solid rgba(124,58,237,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "24px", flexShrink: 0,
                    }}>
                      {goal.emoji}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px" }}>{goal.title}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{goal.deadline}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${goal.status === "on-track" ? "green" : "amber"}`}>
                    {goal.status === "on-track" ? "On Track ✓" : "Building"}
                  </span>
                </div>
                <div style={{ marginTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>₹{goal.savedAmount.toLocaleString()} saved</span>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>₹{goal.targetAmount.toLocaleString()} goal</span>
                  </div>
                  <div className="progress-bar" style={{ height: "8px" }}>
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: pct >= 75 ? "linear-gradient(90deg, #10b981, #06b6d4)"
                        : pct >= 40 ? "linear-gradient(90deg, #f59e0b, #ec4899)"
                        : "linear-gradient(90deg, #7c3aed, #ec4899)",
                    }} />
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{pct}% complete</div>
                  {goal.bestDeal && (
                    <div style={{ marginTop: "10px", padding: "8px 10px", background: "rgba(16,185,129,0.08)", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.18)" }}>
                      <div style={{ fontSize: "11px", color: "var(--accent-green-light)", fontWeight: 600 }}>
                        🏷 Best deal: {goal.bestDeal.platform} on {goal.bestDeal.saleDate} — ₹{goal.bestDeal.price}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ fontWeight: 900, fontSize: "22px", marginBottom: "4px" }}>✦ Set a New Goal</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Tell Fin what you want to save for.
            </div>

            {/* Emoji picker */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 700 }}>PICK AN EMOJI</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {EMOJI_PICKS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setGoalEmoji(e)}
                    style={{
                      width: 38, height: 38, borderRadius: "10px", border: "none", cursor: "pointer",
                      background: goalEmoji === e ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.07)",
                      fontSize: "18px",
                      outline: goalEmoji === e ? "2px solid var(--accent-purple)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: 700 }}>WHAT DO YOU WANT?</div>
              <input
                className="input"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. New iPhone, Goa trip, AirPods..."
              />
            </div>
            <div style={{ marginBottom: "22px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: 700 }}>TARGET AMOUNT (₹)</div>
              <input
                className="input"
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="e.g. 7500"
              />
            </div>
            <button id="submit-goal-btn" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px" }} onClick={handleAddGoal} disabled={loading}>
              {loading ? <div className="spinner" /> : "Set Goal with Fin ✦"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
