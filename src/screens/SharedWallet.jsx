import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function SharedWallet() {
  const { sharedWallet, approveRequest, wallet, setGrowthScore } = useApp();
  const [activeTab,            setActiveTab]            = useState("pool");
  const [loading,              setLoading]              = useState(null);
  const [showRequestModal,     setShowRequestModal]     = useState(false);
  const [requestAmount,        setRequestAmount]        = useState("");
  const [requestReason,        setRequestReason]        = useState("");
  const [requestSent,          setRequestSent]          = useState(false);
  const [showContributeModal,  setShowContributeModal]  = useState(false);
  const [contributeAmount,     setContributeAmount]     = useState("");
  const [contributed,          setContributed]          = useState(false);

  const handleApprove = (id) => {
    setLoading(id);
    setTimeout(() => {
      approveRequest(id);
      setGrowthScore((g) => ({ ...g, current: g.current + 5 }));
      setLoading(null);
    }, 1500);
  };

  const handleSendRequest = () => {
    if (!requestAmount) return;
    setLoading("req");
    setTimeout(() => {
      setLoading(null);
      setRequestSent(true);
    }, 2000);
  };

  const handleContribute = () => {
    if (!contributeAmount) return;
    setLoading("contrib");
    setTimeout(() => {
      setLoading(null);
      setContributed(true);
      setTimeout(() => {
        setShowContributeModal(false);
        setContributed(false);
        setContributeAmount("");
      }, 1400);
    }, 1800);
  };

  return (
    <div>
      {/* Header */}
      <div className="screen-header">
        <div>
          <div className="screen-title">Shared Wallet</div>
          <div className="screen-subtitle">{sharedWallet.groupName}</div>
        </div>
        <button id="add-funds-btn" className="btn btn-primary btn-sm" onClick={() => setShowContributeModal(true)}>
          + Add Funds
        </button>
      </div>

      {/* Pool Overview Card */}
      <div style={{ padding: "0 20px 16px" }}>
        <div className="card" style={{
          background: "linear-gradient(145deg, rgba(245,158,11,0.18), rgba(236,72,153,0.08), rgba(10,10,20,0.6))",
          border: "1px solid rgba(245,158,11,0.28)",
          boxShadow: "0 4px 28px rgba(245,158,11,0.1)",
        }}>
          <div style={{ textAlign: "center", padding: "8px 0 14px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
              Total Pool
            </div>
            <div style={{ fontSize: "56px", fontWeight: 900, letterSpacing: "-2px", marginTop: "4px", lineHeight: 1 }} className="gradient-text-amber">
              ₹{sharedWallet.totalPool.toLocaleString()}
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>
              Your contribution: <strong style={{ color: "var(--text-primary)" }}>₹{sharedWallet.myContribution.toLocaleString()}</strong>
            </div>
          </div>

          {/* Member contribution bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sharedWallet.members.map((m) => {
              const pct = Math.round((m.contribution / sharedWallet.totalPool) * 100);
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className="avatar" style={{
                    background: m.isYou ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(255,255,255,0.12)",
                    width: 30, height: 30, fontSize: "11px", borderRadius: "9px",
                    flexShrink: 0,
                  }}>
                    {m.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>
                        {m.name}{m.isYou ? " (you)" : ""}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700 }}>₹{m.contribution.toLocaleString()}</span>
                    </div>
                    <div className="progress-bar" style={{ height: "4px" }}>
                      <div className="progress-fill" style={{
                        width: `${pct}%`,
                        background: m.status === "pending"
                          ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                          : m.isYou
                            ? "linear-gradient(90deg, #7c3aed, #ec4899)"
                            : "linear-gradient(90deg, #10b981, #06b6d4)",
                      }} />
                    </div>
                  </div>
                  <span className={`badge badge-${m.status === "pending" ? "amber" : "green"}`} style={{ fontSize: "10px", flexShrink: 0 }}>
                    {m.status === "pending" ? "⏳ Due" : "✓ Paid"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pill-tabs">
        {["pool", "instances", "requests"].map((t) => (
          <button
            key={t}
            id={`wallet-tab-${t}`}
            className={`pill-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
            style={{ position: "relative" }}
          >
            {t === "pool" ? "🏠 Pool" : t === "instances" ? "📋 Plans" : "🔔 Requests"}
            {t === "requests" && sharedWallet.pendingRequests.length > 0 && (
              <span className="notif-badge">{sharedWallet.pendingRequests.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Pool Tab */}
      {activeTab === "pool" && (
        <div style={{ padding: "0 20px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <button id="request-emergency-btn" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowRequestModal(true)}>
              🆘 Emergency
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }}>
              💸 Split Bill
            </button>
          </div>

          {/* Fin Ledger Summary */}
          <div className="card" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px",
              }}>
                ✦
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--accent-purple-light)", fontWeight: 700, marginBottom: "5px" }}>
                  Fin's Ledger Summary
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  The group pool is <strong style={{ color: "var(--accent-green-light)" }}>healthy</strong>.
                  Rent is fully covered for April. Rohan's share is pending — nudge sent.
                  Goa Trip fund is 25% there, on track for June. 🏖️
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "14px" }}>
            {[
              { label: "Members", value: sharedWallet.members.length, icon: "👥", color: "#7c3aed" },
              { label: "Plans",   value: sharedWallet.instances.length, icon: "📋", color: "#f59e0b" },
              { label: "Pending", value: sharedWallet.pendingRequests.length, icon: "⏳", color: "#ef4444" },
            ].map((s, i) => (
              <div key={i} className="card" style={{
                padding: "12px",
                background: `${s.color}12`,
                border: `1px solid ${s.color}25`,
                textAlign: "center",
              }}>
                <div style={{ fontSize: "20px" }}>{s.icon}</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: s.color, marginTop: "4px" }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instances Tab */}
      {activeTab === "instances" && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "10px" }} className="stagger">
          {sharedWallet.instances.map((inst) => (
            <div key={inst.id} className="card card-hover">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "14px",
                    background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", flexShrink: 0,
                  }}>
                    {inst.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>{inst.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Due: {inst.due}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: "18px" }}>₹{inst.total.toLocaleString()}</div>
                  <span className={`badge badge-${inst.status === "active" ? "green" : "cyan"}`} style={{ marginTop: "4px" }}>
                    {inst.status === "active" ? "Active" : "Saving"}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <div className="progress-bar" style={{ height: "6px" }}>
                  <div className="progress-fill" style={{
                    width: inst.status === "active" ? "100%" : "28%",
                    background: "linear-gradient(90deg, #f59e0b, #10b981)",
                  }} />
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {inst.status === "active" ? "Fully funded ✓" : "₹2,200 contributed so far (28%)"}
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" style={{ width: "100%", borderStyle: "dashed" }}>
            + Create New Plan
          </button>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {sharedWallet.pendingRequests.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "50px" }} className="animate-fade-in-up">
              <div style={{ fontSize: "48px" }}>✅</div>
              <div style={{ fontSize: "14px", marginTop: "10px" }}>No pending requests</div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>Everything's settled up.</div>
            </div>
          ) : (
            sharedWallet.pendingRequests.map((req) => (
              <div key={req.id} className="card animate-fade-in-up" style={{
                border: "1px solid rgba(245,158,11,0.28)",
                background: "rgba(245,158,11,0.06)",
              }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div className="avatar" style={{
                    background: "rgba(255,255,255,0.12)", fontSize: "13px",
                    width: 42, height: 42, borderRadius: "12px",
                  }}>
                    {req.from.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "16px" }}>
                      {req.from} needs <span style={{ color: "var(--accent-amber-light)" }}>₹{req.amount}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "3px" }}>{req.reason}</div>
                    <div style={{ marginTop: "10px", padding: "10px 12px", background: "rgba(124,58,237,0.1)", borderRadius: "10px", border: "1px solid rgba(124,58,237,0.2)" }}>
                      <div style={{ fontSize: "11px", color: "var(--accent-purple-light)", fontWeight: 700 }}>✦ Fin's Verdict</div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.5" }}>{req.aiVerdict}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <button
                        id={`approve-req-${req.id}`}
                        className="btn btn-green btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => handleApprove(req.id)}
                        disabled={loading === req.id}
                      >
                        {loading === req.id
                          ? <div className="spinner" style={{ width: 14, height: 14 }} />
                          : "✓ Approve"
                        }
                      </button>
                      <button className="btn btn-danger btn-sm" style={{ flex: 1 }}>
                        ✕ Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Emergency Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            {!requestSent ? (
              <>
                <div style={{ fontWeight: 900, fontSize: "22px", marginBottom: "4px" }}>🆘 Emergency Request</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: "1.6" }}>
                  Fin will ask the group on your behalf — no awkward texts needed.
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "7px", fontWeight: 700 }}>AMOUNT NEEDED (₹)</div>
                  <input
                    className="input"
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    placeholder="e.g. 800"
                  />
                </div>
                <div style={{ marginBottom: "22px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "7px", fontWeight: 700 }}>WHAT'S IT FOR?</div>
                  <input
                    className="input"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    placeholder="e.g. Charger broke, need cash for meds..."
                  />
                </div>
                <button
                  id="send-request-btn"
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                  onClick={handleSendRequest}
                  disabled={loading === "req"}
                >
                  {loading === "req"
                    ? <><div className="spinner" /><span>Fin is checking...</span></>
                    : "Send Request via Fin ✦"
                  }
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0" }} className="animate-scale-in">
                <div style={{ fontSize: "56px" }}>✅</div>
                <div style={{ fontWeight: 900, fontSize: "22px", marginTop: "14px" }}>Request Sent!</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "8px", lineHeight: "1.7" }}>
                  Fin has notified the group. Arjun has ₹1,200 idle — they'll see your request shortly.
                  Zero awkwardness. 🙌
                </div>
                <button className="btn btn-secondary" style={{ width: "100%", marginTop: "22px" }} onClick={() => setShowRequestModal(false)}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="modal-overlay" onClick={() => setShowContributeModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            {!contributed ? (
              <>
                <div style={{ fontWeight: 900, fontSize: "22px", marginBottom: "4px" }}>💸 Add Funds to Pool</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                  Move from your wallet to the group pool.
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "7px", fontWeight: 700 }}>AMOUNT (₹)</div>
                  <input
                    className="input"
                    type="number"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    placeholder="e.g. 500"
                  />
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "22px" }}>
                  Available: ₹{wallet.balance.toLocaleString()}
                </div>
                <button
                  id="contribute-btn"
                  className="btn btn-green"
                  style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                  onClick={handleContribute}
                  disabled={loading === "contrib"}
                >
                  {loading === "contrib"
                    ? <><div className="spinner" /><span>Processing...</span></>
                    : "Contribute ✓"
                  }
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0" }} className="animate-scale-in">
                <div style={{ fontSize: "56px" }}>🎉</div>
                <div style={{ fontWeight: 900, fontSize: "22px", marginTop: "14px" }}>Added to pool!</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "8px" }}>
                  ₹{contributeAmount} added to {sharedWallet.groupName}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
