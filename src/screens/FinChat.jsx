import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

const FIN_COMMANDS = {
  balance:   ["balance", "wallet", "money", "how much", "broke"],
  sneakers:  ["sneaker", "nike", "shoe", "buy", "purchase", "goal", "want"],
  budget:    ["budget", "tight", "left", "remaining", "afford", "survive"],
  dinner:    ["dinner", "restaurant", "eat", "food", "zomato", "swiggy", "hungry"],
  score:     ["score", "growth", "points", "unlock", "level"],
  savings:   ["sav", "invest", "mutual fund", "sip", "fixed deposit"],
  insurance: ["insurance", "insure", "cover", "protect", "policy"],
};

function detectIntent(msg) {
  const lower = msg.toLowerCase();
  for (const [intent, keywords] of Object.entries(FIN_COMMANDS)) {
    if (keywords.some((k) => lower.includes(k))) return intent;
  }
  return "default";
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "8px",
        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0,
      }}>
        ✦
      </div>
      <div style={{
        padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
        background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)",
        display: "flex", gap: "5px", alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--accent-purple-light)",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

const QUICK_PROMPTS = [
  "What's my balance?",
  "I want new sneakers",
  "Help me budget for dinner",
  "What's my Growth Score?",
  "How do I save more?",
  "Tell me about insurance",
];

export default function FinChat({ onClose }) {
  const { finResponses, user, wallet, growthScore, addGoal } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1, from: "fin",
      text: `Hey ${user.name}! 👋\n\nI'm Fin — your AI Financial Godfather. I track your money, hunt deals, and give you real talk (not boring bank advice).\n\nWhat's on your mind?`,
      time: "Just now",
    },
  ]);
  const [input,      setInput]      = useState("");
  const [typing,     setTyping]     = useState(false);
  const [goalAdded,  setGoalAdded]  = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const finExtendedResponses = {
    ...finResponses,
    savings:   `Smart move! Here's what I'd suggest for ${user.name}:\n\n💰 Start a SIP of ₹500/month in a large-cap fund\n📈 Emergency fund first → 3 months of expenses\n✦ Your Growth Score goes up when you save consistently!\n\nWant me to set up a savings goal?`,
    insurance: `You currently have 1 active policy (Weekend Trip Cover - FINSTAY-2025-0041).\n\n💻 Laptop Theft Cover → ₹149 for 90 days\n📱 Phone Screen Cover → ₹99/month\n\nSlapp that Insurance button on the dashboard to see all options! 🛡️`,
  };

  const sendMessage = (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    const userMsg = { id: Date.now(), from: "user", text, time: "Just now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const intent = detectIntent(text);
    const delay  = 1000 + Math.random() * 700;

    setTimeout(() => {
      setTyping(false);
      let response = finExtendedResponses[intent] || finResponses.default;

      if (intent === "balance") {
        response = `🔐 Verifying... ✓\n\n${finResponses.balance}`;
      }

      if (intent === "sneakers" && !goalAdded) {
        response = finResponses.sneakers;
        setTimeout(() => {
          addGoal({
            id: `g${Date.now()}`,
            title: "Nike Air Force 1s",
            emoji: "👟",
            targetAmount: 7500,
            savedAmount: 0,
            deadline: "May 5, 2025",
            unidays: true,
            discount: "15% Unidays",
            status: "building",
          });
          setGoalAdded(true);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1, from: "fin",
              text: "✅ Goal created! I'll track prices daily and alert you when the Myntra sale drops. Check the Goals tab 🎯",
              time: "Just now",
            },
          ]);
        }, 1500);
      }

      setMessages((prev) => [...prev, { id: Date.now(), from: "fin", text: response, time: "Just now" }]);
    }, delay);
  };

  return (
    <div className="modal-overlay" style={{ alignItems: "stretch" }}>
      <div style={{
        width: "100%", maxWidth: "430px",
        background: "#0b0b15",
        backgroundImage: "radial-gradient(ellipse at top, rgba(124,58,237,0.1) 0%, transparent 60%)",
        display: "flex", flexDirection: "column", height: "100dvh",
        animation: "sheetSlideUp 0.3s cubic-bezier(0.34,1.2,0.64,1) both",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 20px",
          background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(236,72,153,0.08))",
          borderBottom: "1px solid var(--glass-border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{
              width: 50, height: 50, borderRadius: "15px",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", flexShrink: 0,
              boxShadow: "0 0 24px rgba(124,58,237,0.45)",
            }}>
              ✦
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: "18px" }}>Fin</div>
              <div style={{ fontSize: "12px", color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "5px" }}>
                <div className="glow-dot glow-dot-green" style={{ width: 6, height: 6 }} />
                AI Financial Godfather · Always on
              </div>
            </div>
          </div>
          <button
            id="fin-close-btn"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
              width: 38, height: 38, borderRadius: "10px",
              cursor: "pointer", fontSize: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "16px 16px 8px",
          display: "flex", flexDirection: "column", gap: "14px",
          scrollbarWidth: "none",
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="animate-fade-in-up"
              style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                gap: "8px", alignItems: "flex-end",
              }}
            >
              {msg.from === "fin" && (
                <div style={{
                  width: 28, height: 28, borderRadius: "8px", flexShrink: 0,
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
                }}>
                  ✦
                </div>
              )}
              <div style={{
                maxWidth: "78%",
                padding: "12px 15px",
                borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.from === "user"
                  ? "linear-gradient(135deg, #7c3aed, #9333ea)"
                  : "rgba(255,255,255,0.06)",
                border: msg.from === "fin" ? "1px solid var(--glass-border)" : "none",
                fontSize: "14px",
                lineHeight: "1.6",
                whiteSpace: "pre-line",
                boxShadow: msg.from === "user" ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
              }}>
                {msg.text}
              </div>
              {msg.from === "user" && (
                <div className="avatar" style={{
                  background: "rgba(255,255,255,0.1)",
                  width: 28, height: 28, fontSize: "11px",
                  borderRadius: "8px", flexShrink: 0,
                }}>
                  {user.avatar}
                </div>
              )}
            </div>
          ))}

          {typing && <TypingDots />}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{
          padding: "8px 14px",
          display: "flex", gap: "8px", overflowX: "auto",
          scrollbarWidth: "none", flexShrink: 0,
        }}>
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              id={`fin-prompt-${i}`}
              onClick={() => sendMessage(p)}
              style={{
                padding: "7px 13px", borderRadius: "100px", whiteSpace: "nowrap",
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.25)",
                color: "var(--accent-purple-light)", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", fontFamily: "Outfit, sans-serif",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: "12px 14px 16px",
          borderTop: "1px solid var(--glass-border)",
          display: "flex", gap: "10px", alignItems: "center",
          background: "rgba(11,11,21,0.98)",
          flexShrink: 0,
        }}>
          <input
            id="fin-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Fin anything..."
            className="input"
            style={{ flex: 1 }}
          />
          <button
            id="fin-send-btn"
            className="btn btn-primary"
            style={{
              width: 46, height: 46, padding: 0, borderRadius: "13px",
              flexShrink: 0, fontSize: "18px",
              opacity: input.trim() ? 1 : 0.5,
            }}
            onClick={() => sendMessage()}
            disabled={!input.trim()}
          >
            ↑
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30%            { transform: translateY(-7px); }
          }
        `}</style>
      </div>
    </div>
  );
}
