import { createContext, useContext, useState } from "react";
import { dummyData } from "../data/dummyData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user] = useState(dummyData.user);
  const [wallet, setWallet] = useState(dummyData.wallet);
  const [growthScore, setGrowthScore] = useState(dummyData.growthScore);
  const [transactions, setTransactions] = useState(dummyData.transactions);
  const [goals, setGoals] = useState(dummyData.goals);
  const [subscriptions, setSubscriptions] = useState(dummyData.subscriptions);
  const [coupons] = useState(dummyData.coupons);
  const [finResponses] = useState(dummyData.finResponses);
  const [sharedWallet, setSharedWallet] = useState(dummyData.sharedWallet);
  const [insurance, setInsurance] = useState(dummyData.insurance);
  const [macros, setMacros] = useState(dummyData.macros);
  const [trading, setTrading] = useState(dummyData.trading);
  const [headsUp, setHeadsUp] = useState(dummyData.headsUp);
  const [dashboardWidgets, setDashboardWidgets] = useState(dummyData.dashboardWidgets);

  // Buy insurance & deduct from wallet
  const buyInsurance = (insuranceId) => {
    const ins = insurance.find((i) => i.id === insuranceId);
    if (!ins) return;
    setWallet((w) => ({ ...w, balance: w.balance - ins.premium }));
    setInsurance((prev) =>
      prev.map((i) =>
        i.id === insuranceId
          ? { ...i, status: "purchased", policyNo: `FINSTAY-2025-00${Math.floor(Math.random() * 90 + 10)}` }
          : i
      )
    );
    setGrowthScore((g) => ({ ...g, current: g.current + 5 }));
  };

  // Cancel subscription (Phantom Drain Catcher)
  const cancelSubscription = (subId) => {
    const sub = subscriptions.find((s) => s.id === subId);
    if (!sub) return;
    setSubscriptions((prev) => prev.filter((s) => s.id !== subId));
    setWallet((w) => ({ ...w, coins: w.coins + 50 }));
    setGrowthScore((g) => ({ ...g, current: g.current + 10 }));
    setHeadsUp((prev) => prev.filter((h) => h.type !== "drain"));
  };

  // Activate a macro
  const activateMacro = (macroId) => {
    setMacros((prev) =>
      prev.map((m) => ({ ...m, active: m.id === macroId }))
    );
    setGrowthScore((g) => ({ ...g, current: g.current + 8 }));
  };

  // Approve shared wallet request
  const approveRequest = (requestId) => {
    const req = sharedWallet.pendingRequests.find((r) => r.id === requestId);
    if (!req) return;
    setSharedWallet((sw) => ({
      ...sw,
      totalPool: sw.totalPool - req.amount,
      pendingRequests: sw.pendingRequests.filter((r) => r.id !== requestId),
    }));
    setGrowthScore((g) => ({ ...g, current: g.current + 5 }));
  };

  // Add goal
  const addGoal = (goal) => {
    setGoals((prev) => [goal, ...prev]);
    setGrowthScore((g) => ({ ...g, current: g.current + 5 }));
  };

  // Dismiss a heads-up
  const dismissHeadsUp = (id) => {
    setHeadsUp((prev) => prev.filter((h) => h.id !== id));
  };

  // Toggle trading cooldown
  const triggerCooldown = () => {
    const endsAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    setTrading((t) => ({ ...t, cooldownActive: true, cooldownEndsAt: endsAt }));
  };

  const toggleWidget = (widgetId) => {
    setDashboardWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, enabled: !w.enabled } : w))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user, wallet, growthScore, transactions, goals, subscriptions,
        coupons, sharedWallet, insurance, macros, trading, headsUp,
        dashboardWidgets, finResponses, buyInsurance, cancelSubscription,
        activateMacro, approveRequest, addGoal, dismissHeadsUp,
        triggerCooldown, toggleWidget, setGrowthScore, setWallet, setTrading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
