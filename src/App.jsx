import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Dashboard from "./screens/Dashboard";
import Spends from "./screens/Spends";
import SharedWallet from "./screens/SharedWallet";
import Trading from "./screens/Trading";
import Profile from "./screens/Profile";
import FinChat from "./screens/FinChat";
import Splash from "./components/Splash";
import "./index.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Home",   icon: "⬡" },
  { id: "spends",    label: "Spends", icon: "💳" },
  { id: "wallet",    label: "Squad",  icon: "👥" },
  { id: "trading",   label: "Trade",  icon: "📈" },
  { id: "profile",   label: "You",    icon: "✦" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [finOpen, setFinOpen]     = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const renderScreen = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard onOpenFin={() => setFinOpen(true)} />;
      case "spends":    return <Spends />;
      case "wallet":    return <SharedWallet />;
      case "trading":   return <Trading />;
      case "profile":   return <Profile />;
      default:          return <Dashboard onOpenFin={() => setFinOpen(true)} />;
    }
  };

  return (
    <AppProvider>
      {showSplash && <Splash onDone={() => setShowSplash(false)} />}
      <div className="app-shell">
        <div className="screen">
          {renderScreen()}
        </div>

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          {NAV_ITEMS.slice(0, 2).map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-icon" style={{ fontSize: "17px" }}>{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}

          {/* Fin FAB Center */}
          <button id="fin-fab-btn" className="fin-fab animate-pulse-glow" onClick={() => setFinOpen(true)}>
            <span style={{ fontSize: "20px" }}>✦</span>
            <span className="fin-fab-label">FIN</span>
          </button>

          {NAV_ITEMS.slice(2).map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-icon" style={{ fontSize: "17px" }}>{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Fin Chat Modal */}
        {finOpen && <FinChat onClose={() => setFinOpen(false)} />}
      </div>
    </AppProvider>
  );
}
