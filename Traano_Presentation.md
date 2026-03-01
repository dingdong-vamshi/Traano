# Traano — Presentation Slides

## Slide 1: Title Slide
**Title:** Traano
**Subtitle:** Personal Finance Anomaly & Behavioral Intelligence Platform]\


**One-Liner:** An AI-powered platform that analyzes bank statements to detect unusual financial behavior and provide explainable spending insights.

---

## Slide 2: The Problem
**Heading: Absence of Intelligent Monitoring in Personal Finance**
- **Passive Record-Keeping:** Bank statements provide raw records but no meaningful interpretation or behavioral analysis.
- **Reactive Fraud Awareness:** Users only discover unusual/fraudulent changes by manually skimming hundreds of transactions.
- **Unstructured Data:** Bank statements (CSV/PDF) are difficult for non-technical users to interpret and track.
- **Lack of Explainability:** When alerts are present in standard banking, they rarely explain *why* a transaction was flagged.

---

## Slide 3: Proposed Solution
**Heading: Proactive Financial Awareness with Traano**
- **Automated Intelligence:** Converts raw bank statements into structured, actionable behavioral insights.
- **Smart Categorization:** Automatically maps transactions to meaningful expense categories using AI.
- **Behavioral Deviation Tracking:** Learns the user's normal spending patterns and statistically detects deviations.
- **Explainable Alerts:** Doesn't just flag anomalies—provides generated explanations (via Gemini API) so users understand the risk.

---

## Slide 4: Key Implementations (Data Processing)
**Heading: What We Built - Data Pipeline & Parsing**
- **Multi-Format Uploads:** Implemented seamless upload capabilities for CSV (and PDF) format bank statements.
- **Dynamic Column Detection:** Built an engine that automatically detects and maps various bank CSV headers to a standard format.
- **Transaction Normalization:** Developed preprocessing scripts to clean merchant names, handle date standardization, and separate debits/credits.
- **Robust Storage:** Integrated MongoDB to securely store normalized transactions with isolated user contexts.

---

## Slide 5: Key Implementations (Anomaly Detection)
**Heading: What We Built - The Intelligence Engine**
- **Statistical Z-Score Analysis:** Implemented mathematical models to identify outliers in transaction amounts without requiring heavy ML inference.
- **Risk Level Assignments:** Engineered a scoring system that assigns 'Normal', 'Medium', or 'High' risk levels to every grouped transaction.
- **Frequency & Merchant Analysis:** Added tracking to identify completely unfamiliar merchants or rapid spikes in spending frequency.
- **GenAI Integration:** Connected Google Gemini API to translate mathematical anomalies into human-readable explanations.

---

## Slide 6: Key Implementations (Frontend & Visualization)
**Heading: What We Built - Interactive Dashboard**
- **Premium User Interface:** Built a responsive, dark-themed, fintech-style frontend using React and Tailwind CSS.
- **Visual Insights:** Integrated Recharts to render interactive Pie Charts (Category Distribution), Bar Charts (Risk Distribution), and Line Graphs (Spending Trends).
- **Transaction Management:** Implemented a sortable, paginated transaction table with dynamic risk-level color coding.
- **Dashboard Filtering:** Added interactive filters allowing users to slice data by risk level, date ranges, and categories instantly.

---

## Slide 7: System Architecture & Tech Stack
**Heading: Modular Full-Stack Architecture**
- **Frontend Layer:** React.js, Vite, Tailwind CSS, Recharts (Deployed on Vercel/Netlify).
- **Backend API:** Node.js, Express.js, Multer for file streaming (Deployed on Render).
- **Intelligence Layer:** Hybrid Statistical + Gemini AI models for anomaly generation and reasoning.
- **Database Layer:** MongoDB Atlas for securely storing transactions, insights, and categorizations.

---

## Slide 8: Conclusion & Impact
**Heading: Empowering Users with Financial Clarity**
- **Impact:** Shifts personal finance management from a tedious manual chore to an automated, intelligent process.
- **Security:** Detects unauthorized subscriptions, unknown merchants, and billing errors immediately.
- **Next Steps:** Expansion into real-time banking API integrations (e.g., Plaid) and deep mobile application rollout.
- **Q&A:** Open the floor for questions.
