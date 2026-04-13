import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function InsuranceModal({ onClose }) {
  const { insurance, buyInsurance, wallet } = useApp();
  const [loading, setLoading] = useState(null);
  const [showPolicy, setShowPolicy] = useState(null);

  const handleBuy = (id) => {
    setLoading(id);
    setTimeout(() => {
      buyInsurance(id);
      setLoading(null);
    }, 1800);
  };

  const statusColors = {
    available: "var(--accent-purple-light)",
    purchased: "var(--accent-green)",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "85dvh" }}>
        <div className="modal-handle" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <div style={{ fontWeight: 900, fontSize: "22px" }}>🛡️ Micro-Insurance</div>
          <span className="badge badge-cyan">AI-Contextual</span>
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: "1.5" }}>
          Plain-English covers that appear when you actually need them. No jargon. One tap. Done.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {insurance.map((ins) => (
            <div
              key={ins.id}
              className="card"
              style={{
                border: ins.status === "purchased"
                  ? "1px solid rgba(16,185,129,0.35)"
                  : "1px solid var(--glass-border)",
                background: ins.status === "purchased"
                  ? "rgba(16,185,129,0.06)"
                  : "var(--bg-card)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: "14px", flexShrink: 0,
                    background: ins.status === "purchased" ? "rgba(16,185,129,0.14)" : "rgba(124,58,237,0.12)",
                    border: ins.status === "purchased" ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(124,58,237,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px",
                  }}>{ins.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>{ins.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Valid: {ins.duration}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 900, fontSize: "22px", color: statusColors[ins.status] }}>
                    ₹{ins.premium}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>premium</div>
                </div>
              </div>

              {/* Plain English Policy */}
              <div style={{ borderRadius: "12px", marginBottom: "12px", overflow: "hidden" }}>
                <div style={{ padding: "9px 12px", background: "rgba(16,185,129,0.08)", borderBottom: "1px solid rgba(16,185,129,0.15)" }}>
                  <div style={{ fontSize: "11px", color: "var(--accent-green-light)", fontWeight: 700, marginBottom: "3px" }}>✓ COVERED</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{ins.coverage}</div>
                </div>
                <div style={{ padding: "9px 12px", background: "rgba(239,68,68,0.06)" }}>
                  <div style={{ fontSize: "11px", color: "var(--accent-red-light)", fontWeight: 700, marginBottom: "3px" }}>✗ NOT COVERED</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ins.notCovered}</div>
                </div>
              </div>

              {ins.status === "purchased" ? (
                <div>
                  <div className="badge badge-green" style={{ width: "100%", justifyContent: "center", padding: "10px" }}>
                    ✓ Active — Policy #{ins.policyNo}
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: "100%", marginTop: "8px" }}
                    onClick={() => setShowPolicy(ins)}
                  >
                    View Policy
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => handleBuy(ins.id)}
                  disabled={loading === ins.id || wallet.balance < ins.premium}
                >
                  {loading === ins.id
                    ? <><div className="spinner" /><span>Issuing policy...</span></>
                    : wallet.balance < ins.premium
                      ? "Insufficient balance"
                      : `Buy Cover — ₹${ins.premium}`}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* View Policy Modal */}
        {showPolicy && (
          <div className="modal-overlay" onClick={() => setShowPolicy(null)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="modal-handle" />
              <div style={{ fontSize: "32px", textAlign: "center" }}>{showPolicy.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: "20px", textAlign: "center", marginTop: "8px" }}>{showPolicy.title}</div>
              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <span className="badge badge-green">Policy #{showPolicy.policyNo}</span>
              </div>
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Coverage", value: showPolicy.coverage },
                  { label: "Not Covered", value: showPolicy.notCovered },
                  { label: "Duration", value: showPolicy.duration },
                  { label: "Premium Paid", value: `₹${showPolicy.premium}` },
                  { label: "Insurer", value: "Digit Insurance (Demo)" },
                  { label: "Claims", value: "Upload photo + short form via app" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", padding: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", flex: "0 0 100px" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", flex: 1 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary" style={{ width: "100%", marginTop: "20px" }} onClick={() => setShowPolicy(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
