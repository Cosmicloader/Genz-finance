import { useEffect, useState } from "react";

export default function Splash({ onDone }) {
  const [phase, setPhase] = useState(0); // 0=logo, 1=tagline, 2=fade-out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "linear-gradient(160deg, #0a0a0f 0%, #130820 50%, #0a0a0f 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "28px",
        opacity: phase === 2 ? 0 : 1,
        transition: phase === 2 ? "opacity 0.6s ease" : "none",
        cursor: "pointer",
      }}
    >
      {/* Glow orbs */}
      <div style={{
        position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -60%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: "200px", height: "200px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)",
        top: "55%", left: "50%", transform: "translate(-30%, -30%)",
        filter: "blur(30px)", pointerEvents: "none",
      }} />

      {/* Fin logo */}
      <div style={{
        width: "88px", height: "88px", borderRadius: "26px",
        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "42px", color: "white",
        boxShadow: "0 0 60px rgba(124,58,237,0.55), 0 0 120px rgba(236,72,153,0.25)",
        animation: "splashPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}>
        ✦
      </div>

      {/* App name */}
      <div style={{
        textAlign: "center",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{
          fontSize: "36px", fontWeight: 900, letterSpacing: "-1.5px",
          background: "linear-gradient(135deg, #a78bfa, #f472b6)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          FinOS
        </div>
        <div style={{ fontSize: "15px", color: "rgba(148,163,184,0.8)", marginTop: "8px", fontWeight: 400, letterSpacing: "0.2px" }}>
          Your Gen-Z Financial Godfather
        </div>
      </div>

      {/* Feature pills */}
      <div style={{
        display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", maxWidth: "300px",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
      }}>
        {["✦ AI-Powered", "📈 Growth Score", "👥 Shared Wallets", "🛡️ Micro Insurance", "⚡ Smart Macros"].map((tag, i) => (
          <span key={i} style={{
            padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
            background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
            color: "#a78bfa",
          }}>{tag}</span>
        ))}
      </div>

      {/* Tap hint */}
      <div style={{
        position: "absolute", bottom: "48px",
        fontSize: "12px", color: "rgba(100,116,139,0.7)", letterSpacing: "0.5px",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 0.5s ease 0.3s",
        animation: phase >= 1 ? "splashBlink 2s ease-in-out infinite" : "none",
      }}>
        tap anywhere to continue
      </div>

      <style>{`
        @keyframes splashPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes splashBlink {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
