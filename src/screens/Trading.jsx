import { useState } from "react";
import { useApp } from "../context/AppContext";

const QUIZ_BANK = [
  {
    question: "What does P/E ratio stand for?",
    options: ["Price-to-Earnings","Profit-to-Expense","Price-to-Equity","Portfolio-to-Earning"],
    correct: 0,
    explanation: "P/E ratio measures a company's stock price relative to its earnings per share.",
  },
  {
    question: "What is a mutual fund?",
    options: ["A pool of money from many investors", "A government scheme", "A type of bank account", "A loan product"],
    correct: 0,
    explanation: "A mutual fund pools money from many investors to invest in diversified assets.",
  },
  {
    question: "What does SIP stand for in investing?",
    options: ["Systematic Investment Plan","Savings Interest Plan","Stock Inflow Plan","Simple Index Purchase"],
    correct: 0,
    explanation: "SIP allows you to invest fixed amounts at regular intervals.",
  },
  {
    question: "Bull market means?",
    options: ["Rising prices", "Falling prices", "Stagnant market", "Bear attack 🐻"],
    correct: 0,
    explanation: "A bull market is characterized by rising asset prices and investor optimism.",
  },
];

const MARKET_DATA = [
  { name: "Nifty 50",   value: "22,450", change: "+1.2%", positive: true,  emoji: "📊" },
  { name: "Sensex",     value: "74,120", change: "+0.8%", positive: true,  emoji: "📈" },
  { name: "Gold ETF",   value: "₹6,280", change: "+0.4%", positive: true,  emoji: "🥇" },
  { name: "Bitcoin",    value: "$67,400",change: "-2.1%", positive: false, emoji: "₿"  },
  { name: "Ethereum",   value: "$3,520", change: "-1.4%", positive: false, emoji: "⟠"  },
  { name: "Nifty Bank", value: "48,320", change: "+0.6%", positive: true,  emoji: "🏦" },
];

export default function Trading() {
  const { trading, setTrading, growthScore, setGrowthScore } = useApp();
  const [activeTab, setActiveTab]     = useState("portfolio");
  const [showTradeModal,  setShowTradeModal]  = useState(false);
  const [selectedStock,   setSelectedStock]   = useState(null);
  const [tradeQty,        setTradeQty]        = useState("1");
  const [tradeType,       setTradeType]       = useState("buy");
  const [loading,         setLoading]         = useState(false);
  const [tradeSuccess,    setTradeSuccess]    = useState(false);
  const [showQuiz,        setShowQuiz]        = useState(false);
  const [quizIdx,         setQuizIdx]         = useState(0);
  const [quizAnswer,      setQuizAnswer]      = useState(null);
  const [quizResult,      setQuizResult]      = useState(null);

  const quiz = QUIZ_BANK[quizIdx % QUIZ_BANK.length];
  const quizzesLeft       = trading.quizzesRequired - trading.quizzesPassed;
  const progressToUnlock  = Math.round((trading.quizzesPassed / trading.quizzesRequired) * 100);
  const pnlColor          = trading.pnl >= 0 ? "var(--accent-green-light)" : "var(--accent-red-light)";
  const portfolioData     = [95000, 98200, 94800, 102000, 105400, 109800, 112400];

  const handleTrade = () => {
    if (!selectedStock || !tradeQty) return;
    const hour = new Date().getHours();
    if ((hour >= 23 || hour <= 4) && parseInt(tradeQty) > 5) {
      setTrading((t) => ({ ...t, cooldownActive: true }));
      setShowTradeModal(false);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTradeSuccess(true);
      setGrowthScore((g) => ({ ...g, current: Math.min(g.current + 3, 1000) }));
      setTimeout(() => { setTradeSuccess(false); setShowTradeModal(false); }, 2200);
    }, 2000);
  };

  const handleQuizAnswer = (idx) => {
    setQuizAnswer(idx);
    const correct = idx === quiz.correct;
    setQuizResult(correct);
    if (correct) {
      setTimeout(() => {
        setTrading((t) => ({ ...t, quizzesPassed: t.quizzesPassed + 1 }));
        setGrowthScore((g) => ({ ...g, current: g.current + 10 }));
        setTimeout(() => {
          setShowQuiz(false);
          setQuizAnswer(null);
          setQuizResult(null);
          setQuizIdx((i) => i + 1);
        }, 1200);
      }, 800);
    }
  };

  // SVG sparkline helper
  const buildPath = (data, w, h) => {
    const min = Math.min(...data) - 1500;
    const max = Math.max(...data) + 1500;
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((v - min) / (max - min)) * h,
    }));
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const area = path + ` L${pts[pts.length - 1].x},${h} L0,${h} Z`;
    return { path, area, pts };
  };

  return (
    <div>
      {/* Header */}
      <div className="screen-header">
        <div>
          <div className="screen-title">Trading</div>
          <div className="screen-subtitle">
            {trading.realTradingUnlocked ? "🟢 Real Market Live" : "📦 Paper Trading Mode"}
          </div>
        </div>
        {!trading.cooldownActive && (
          <button id="quiz-btn" className="btn btn-primary btn-sm" onClick={() => setShowQuiz(true)}>
            📚 +10 pts
          </button>
        )}
      </div>

      {/* Cooldown Banner */}
      {trading.cooldownActive && (
        <div style={{ margin: "0 20px 16px" }}>
          <div className="card animate-scale-in" style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.28)", textAlign: "center",
          }}>
            <div style={{ fontSize: "40px" }}>🔒</div>
            <div style={{ fontWeight: 800, fontSize: "18px", marginTop: "8px", color: "var(--accent-red-light)" }}>
              Cool-Down Active
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.6 }}>
              Fin detected risky trading behaviour. Chill for 4 hours. Go touch grass. 🌱
            </div>
            <button
              className="btn btn-secondary"
              style={{ width: "100%", marginTop: "16px" }}
              onClick={() => setTrading((t) => ({ ...t, cooldownActive: false }))}
            >
              Override (demo)
            </button>
          </div>
        </div>
      )}

      {/* Unlock Progress */}
      {!trading.realTradingUnlocked && !trading.cooldownActive && (
        <div style={{ margin: "0 20px 14px" }}>
          <div className="card" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.22)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px" }}>🔓 Unlock Real Trading</div>
              <span className="badge badge-purple">{trading.quizzesPassed}/{trading.quizzesRequired} quizzes</span>
            </div>
            <div className="progress-bar" style={{ height: "8px" }}>
              <div className="progress-fill" style={{
                width: `${progressToUnlock}%`,
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
              }} />
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
              Pass {quizzesLeft} more quiz{quizzesLeft !== 1 ? "zes" : ""} + green portfolio for 30 days
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Stats */}
      {!trading.cooldownActive && (
        <>
          <div style={{ padding: "0 20px", marginBottom: "14px" }}>
            <div className="card" style={{
              background: `linear-gradient(145deg, ${trading.pnl >= 0 ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"}, rgba(6,182,212,0.05), rgba(10,10,20,0.6))`,
              border: `1px solid ${trading.pnl >= 0 ? "rgba(16,185,129,0.28)" : "rgba(239,68,68,0.28)"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                    Portfolio Value
                  </div>
                  <div style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-1.5px", marginTop: "4px", lineHeight: 1 }}>
                    ₹{trading.portfolioValue.toLocaleString()}
                  </div>
                  <div style={{ display: "flex", gap: "14px", marginTop: "10px" }}>
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: pnlColor }}>
                        {trading.pnl >= 0 ? "+" : ""}₹{Math.abs(trading.pnl).toLocaleString()}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "4px" }}>P&L</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: pnlColor }}>
                        {trading.pnlPercent >= 0 ? "+" : ""}{trading.pnlPercent}%
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: "16px",
                    background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
                  }}>
                    📈
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "6px" }}>
                    {trading.dayStreak}d streak 🔥
                  </div>
                </div>
              </div>

              {/* Sparkline */}
              <div style={{ marginTop: "14px" }}>
                <svg width="100%" height="44" viewBox="0 0 300 44" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="portfolioGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="portfolioFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const { path, area, pts } = buildPath(portfolioData, 300, 44);
                    return (
                      <>
                        <path d={area} fill="url(#portfolioFill)" />
                        <path d={path} fill="none" stroke="url(#portfolioGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {pts.map((p, i) => (
                          <circle key={i} cx={p.x} cy={p.y}
                            r={i === pts.length - 1 ? 5 : 2.5}
                            fill={i === pts.length - 1 ? "#06b6d4" : "rgba(16,185,129,0.5)"}
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>7 weeks ago</span>
                  <span style={{ fontSize: "10px", color: "var(--accent-green-light)" }}>Today +{trading.pnlPercent}%</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Virtual: ₹{trading.sandboxBalance.toLocaleString()}
                </div>
                <div className="badge badge-cyan">Paper Trade</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="pill-tabs">
            {["portfolio", "market"].map((t) => (
              <button
                key={t}
                id={`trading-tab-${t}`}
                className={`pill-tab ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t === "portfolio" ? "💼 Holdings" : "🌐 Market"}
              </button>
            ))}
          </div>

          {/* Portfolio Tab */}
          {activeTab === "portfolio" && (
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "10px" }} className="stagger">
              {trading.holdings.map((h) => {
                const isGain = h.pnl >= 0;
                const pnlPct = ((h.pnl / (h.buyPrice * h.qty)) * 100).toFixed(1);
                return (
                  <div
                    key={h.id}
                    id={`holding-${h.id}`}
                    className="card card-hover"
                    onClick={() => { setSelectedStock(h); setTradeQty("1"); setTradeType("buy"); setShowTradeModal(true); }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "14px",
                        background: isGain ? "rgba(16,185,129,0.14)" : "rgba(239,68,68,0.14)",
                        border: `1px solid ${isGain ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px", flexShrink: 0,
                      }}>
                        {h.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "15px" }}>{h.name}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                              {h.ticker} • {h.qty} shares
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 800, fontSize: "15px" }}>₹{h.currentPrice.toLocaleString()}</div>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: isGain ? "var(--accent-green-light)" : "var(--accent-red-light)" }}>
                              {isGain ? "+" : ""}₹{h.pnl} ({isGain ? "+" : ""}{pnlPct}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                className="btn btn-secondary"
                style={{ width: "100%", borderStyle: "dashed" }}
                onClick={() => setShowTradeModal(true)}
              >
                + Buy New Stock
              </button>
            </div>
          )}

          {/* Market Tab */}
          {activeTab === "market" && (
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "8px" }} className="stagger">
              {MARKET_DATA.map((item, i) => (
                <div key={i} className="card card-hover" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "14px",
                    background: item.positive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                    border: `1px solid ${item.positive ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", flexShrink: 0,
                  }}>
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>{item.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>{item.value}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: item.positive ? "var(--accent-green-light)" : "var(--accent-red-light)" }}>
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="modal-overlay" onClick={() => setShowTradeModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            {!tradeSuccess ? (
              <>
                {selectedStock ? (
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "36px" }}>{selectedStock.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: "20px" }}>{selectedStock.name}</div>
                      <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                        {selectedStock.ticker} • ₹{selectedStock.currentPrice}/share
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontWeight: 900, fontSize: "20px", marginBottom: "20px" }}>📈 Place a Trade</div>
                )}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                  {["buy", "sell"].map((t) => (
                    <button
                      key={t}
                      id={`trade-${t}`}
                      onClick={() => setTradeType(t)}
                      className="btn"
                      style={{
                        flex: 1, padding: "12px",
                        background: tradeType === t
                          ? t === "buy" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #ef4444, #dc2626)"
                          : "rgba(255,255,255,0.07)",
                        color: tradeType === t ? "white" : "var(--text-secondary)",
                        textTransform: "uppercase", letterSpacing: "0.8px", fontSize: "13px",
                        boxShadow: tradeType === t ? (t === "buy" ? "0 4px 14px rgba(16,185,129,0.4)" : "0 4px 14px rgba(239,68,68,0.4)") : "none",
                      }}
                    >
                      {t === "buy" ? "📈 Buy" : "📉 Sell"}
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: 700 }}>QUANTITY</div>
                  <input
                    className="input"
                    type="number"
                    value={tradeQty}
                    onChange={(e) => setTradeQty(e.target.value)}
                    min="1"
                  />
                </div>
                {selectedStock && (
                  <div style={{
                    fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px",
                    padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: "10px",
                  }}>
                    Total: <strong style={{ color: "var(--text-primary)" }}>₹{(parseInt(tradeQty || 0) * (selectedStock?.currentPrice || 0)).toLocaleString()}</strong>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "6px" }}>(virtual)</span>
                  </div>
                )}
                <button
                  id="execute-trade-btn"
                  className={`btn ${tradeType === "buy" ? "btn-green" : "btn-danger"}`}
                  style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                  onClick={handleTrade}
                  disabled={loading}
                >
                  {loading
                    ? <><div className="spinner" /><span>{tradeType === "buy" ? "Buying..." : "Selling..."}</span></>
                    : `${tradeType === "buy" ? "Buy" : "Sell"} ${tradeQty} share${parseInt(tradeQty) !== 1 ? "s" : ""}`
                  }
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0" }} className="animate-scale-in">
                <div style={{ fontSize: "56px" }}>🎉</div>
                <div style={{ fontWeight: 900, fontSize: "22px", marginTop: "14px" }}>Trade Executed!</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "8px" }}>
                  {tradeType === "buy" ? "Bought" : "Sold"} {tradeQty} share{parseInt(tradeQty) !== 1 ? "s" : ""} of {selectedStock?.name}
                </div>
                <div className="badge badge-purple" style={{ marginTop: "14px", fontSize: "13px" }}>+3 Growth Score ✦</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="modal-overlay" onClick={() => { if (quizAnswer !== null) { setShowQuiz(false); setQuizAnswer(null); setQuizResult(null); }}}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ fontWeight: 900, fontSize: "22px" }}>📚 Quiz</div>
              <span className="badge badge-purple">+10 Growth Score</span>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "22px", lineHeight: "1.5" }}>
              {quiz.question}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {quiz.options.map((opt, idx) => (
                <button
                  key={idx}
                  id={`quiz-opt-${idx}`}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={quizAnswer !== null}
                  className="btn"
                  style={{
                    padding: "14px 16px",
                    justifyContent: "flex-start", textAlign: "left",
                    background: quizAnswer === null ? "rgba(255,255,255,0.06)"
                      : idx === quiz.correct ? "rgba(16,185,129,0.18)"
                        : quizAnswer === idx ? "rgba(239,68,68,0.18)"
                          : "rgba(255,255,255,0.03)",
                    border: quizAnswer === null ? "1px solid var(--glass-border)"
                      : idx === quiz.correct ? "1px solid rgba(16,185,129,0.4)"
                        : quizAnswer === idx ? "1px solid rgba(239,68,68,0.4)"
                          : "1px solid var(--glass-border)",
                    color: "var(--text-primary)", fontSize: "14px",
                    transition: "all 0.25s",
                  }}
                >
                  <span style={{ marginRight: "10px", opacity: 0.5, fontWeight: 700 }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                  {quizAnswer !== null && idx === quiz.correct && (
                    <span style={{ marginLeft: "auto", color: "var(--accent-green-light)" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            {quizResult !== null && (
              <div style={{
                marginTop: "16px", padding: "14px 16px", borderRadius: "14px",
                background: quizResult ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                border: `1px solid ${quizResult ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: quizResult ? "var(--accent-green-light)" : "var(--accent-red-light)" }}>
                  {quizResult ? "🎉 Correct! +10 Growth Score" : "❌ Wrong answer"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
                  {quiz.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
