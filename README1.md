<div align="center">

<!-- Image placeholder: Replace the link below with your actual banner or logo -->
<img src="https://via.placeholder.com/800x200/1e1e2f/8b5cf6?text=💸+Genz+Finance" alt="Genz Finance Banner" width="100%"/>

# Genz Finance
*The single, smart money companion for Gen Z.*

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)]()
[![Architecture](https://img.shields.io/badge/AI_Architecture-Multi--SLM-8b5cf6?style=for-the-badge&logo=stablediffusion&logoColor=white)]()
[![Status](https://img.shields.io/badge/Status-Web_Prototype-f59e0b?style=for-the-badge)]()

**Plan • Pay • Shop • Save • Share • Learn**

</div>

---

## 🚀 Core Vision

Genz Finance replaces the clutter of juggling multiple banking, wallet, and finance apps. It brings your entire financial life into one AI-assisted hub designed specifically for Gen Z's spending, sharing, and learning habits.

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 📱 **QR Payments** | Scan, pay, and split bills directly. Aligned with daily UPI/wallet usage. |
| 🧠 **Smart Planning** | AI-assisted budgeting tailored to specific goals and lifestyles. |
| 🤝 **Shared Wallets** | Seamless group expense management for roommates and partners. |
| 🛍️ **Smart Macros** | Automated savings rules to reduce impulse buying & encourage mindfulness. |
| 🎓 **Student Deals** | Automated discovery of student-specific discounts to lower daily costs. |
| 🎙️ **Voice Access** | Offline-style voice commands for hands-free financial management. |
| 👥 **Social Money** | Simple flows to share plans and coordinate financial decisions with friends. |

---

## 📈 Trading Learner Mode Flow

We believe in safe, progressive financial education. Trading access is split into two distinct phases to protect users while they learn.

```mermaid
flowchart LR
    A[New User] --> B(Phase 1: Practice)
    B -->|Dummy Points| C{Build Strategy & Knowledge}
    C -->|Passes AI Evaluation| D(Phase 2: Real Money)
    D --> E[Live Investing Unlocked]
    
    style B fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    style D fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    ```

🧠 AI & System Architecture
Genz Finance avoids a slow, monolithic AI model. Instead, we use Task-Specific Small Language Models (SLMs) orchestrated via a chain-based layer (similar to LangChain).
graph TD
    UI[📱 React/Vite Client] -->|User Request| O[🔗 Chain-based Orchestration]

    subgraph Task-Specific SLMs
        O --> B[Budgeting & Planning]
        O --> S[Shopping & Deals Reasoning]
        O --> E[Financial Edu Explanations]
        O --> T[Trading Sim Logic]
    end

    subgraph Live External APIs
        O -->|Scoped Calls| M[📈 Live Market Prices]
        O -->|Scoped Calls| D[🏷️ Updated Discounts/Offers]
    end

    subgraph Privacy & Compliance Guardrails
        P[🔒 PII Separation Layer]
    end

    O --> P
    P -->|Sanitized Response| UI

🛡️ Privacy Mindset
Modular Updates: Prompts and configurations update as facts change, while the core model backbone remains stable.

Secure Environment: Personal Identity Information (PII) is isolated from analytical logic.

Minimized Exposure: External API calls are strictly scoped.

💻 Tech Stack & Roadmap
Currently functioning as a web prototype to validate UX and AI behaviors before shipping the production mobile app.

Frontend: React + Vite

Styling: CSS / Custom Gen Z tailored UI

State: React Context, Modular components

Tooling: ESLint, Vite Config

🛣️ Next Steps
[x] Define AI architecture and task-specific model roles.

[ ] Connect task-specific models to the chain-orchestration layer.

[ ] Wire up live data APIs (Market data, Coupons).

[ ] Refine the UI flows for QR payments and Trading Learner mode.

[ ] Mobile App Migration: Transition validated flows from the web prototype to the production mobile stack.
