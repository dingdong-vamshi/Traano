# Traano — Personal Finance Anomaly & Behavioral Intelligence Platform

## One-Line Project Description
Traano is an AI-powered web application that analyzes bank statements, automatically categorizes transactions, and detects unusual financial behavior using statistical anomaly detection and Gemini-generated explainable insights.

---

# 1. Problem Statement

## Problem Title
*Absence of Intelligent Monitoring and Explainable Insights in Personal Digital Finance*

---

## Problem Description
Today’s users perform most of their financial activity through UPI, credit cards, and online banking, generating hundreds of transactions each month. While banks provide downloadable statements, they only present raw records and basic summaries without meaningful interpretation. As a result, unusual activity such as fraudulent charges, duplicate payments, unfamiliar merchants, or sudden spending spikes often goes unnoticed. Users have access to their financial data but lack tools that automatically analyze spending behavior and proactively highlight irregularities in a simple and understandable way.

---

## Target Users
•⁠  ⁠College students managing monthly allowances or stipends

•⁠  ⁠Working professionals using UPI and credit cards regularly

•⁠  ⁠Individuals tracking recurring subscriptions and auto-debits

•⁠  ⁠Users concerned about fraudulent or unauthorized transactions

•⁠  ⁠First-time personal finance users seeking financial awareness

•⁠  ⁠Anyone who downloads bank statements but never meaningfully analyzes them

---

## Existing Gaps

1.⁠ ⁠*Banks provide records, not intelligence*  
   Banking applications generate statements but do not analyze personal financial behavior.

2.⁠ ⁠*Reactive fraud awareness*  
   Users typically discover fraudulent or incorrect transactions only after checking their statements manually.

3.⁠ ⁠*Manual expense categorization*  
   Existing expense trackers depend heavily on user input, making them inconvenient and unsustainable over time.

4.⁠ ⁠*No behavioral analysis tools*  
   Current personal finance apps focus on budgeting rather than detecting spending pattern changes or anomalies.

5.⁠ ⁠*Lack of explainable alerts*  
   Alerts, when present, rarely explain why a transaction is unusual, reducing user trust and usefulness.

6.⁠ ⁠*Unstructured financial data*  
   Bank statements in PDF or CSV formats are not readily interpretable by non-technical users.

# 3. Proposed Solution

## Solution Overview
Traano is a full-stack intelligent financial monitoring platform that converts raw bank statements into meaningful behavioral insights. The system allows users to upload transaction statements in CSV or PDF formats, automatically extracts and structures transactions, categorizes expenses using AI, and analyzes spending behavior using statistical anomaly detection models.

Instead of only visualizing expenses, Traano actively monitors financial patterns and identifies irregular transactions. The platform not only flags anomalies but also explains why a transaction is unusual, enabling users to quickly understand potential risks and spending changes.

---

## Core Idea
The core idea behind Traano is to shift personal finance from *passive record-keeping to proactive financial awareness*.

Rather than requiring users to manually inspect statements, the system:
•⁠  ⁠Understands transaction context (merchant behavior)
•⁠  ⁠Learns normal spending patterns
•⁠  ⁠Detects deviations
•⁠  ⁠Provides explainable alerts

Traano combines rule-based processing, statistical analysis, and AI reasoning (Gemini API) to interpret financial activity similarly to internal bank monitoring systems, but in a user-centric and transparent manner.

---

## Key Features
•⁠  ⁠Upload bank statements (CSV and PDF)

•⁠  ⁠Automatic transaction extraction and normalization

•⁠  ⁠AI-based merchant categorization using Gemini

•⁠  ⁠Detection of unusual spending patterns

•⁠  ⁠New/suspicious merchant identification

•⁠  ⁠Spending frequency change detection

•⁠  ⁠High-value transaction alerts

•⁠  ⁠Behavioral shift analysis

•⁠  ⁠Explainable anomaly risk scores

•⁠  ⁠Visual spending trends and timeline

•⁠  ⁠AI-generated financial summaries and insights

---

# 4. System Architecture

## High-Level Flow
User → Frontend → Backend API → Processing & AI Models → Database → Insights & Alerts

---

## Architecture Description
Traano follows a modular full-stack architecture consisting of a web interface, an API server, an AI processing layer, and a database.

1.⁠ ⁠*Frontend (React Web Application)*  
   Provides dashboard visualizations, file upload interface, anomaly alerts, and financial insights to the user.

2.⁠ ⁠*Backend (Node.js + Express Server)*  
   Handles authentication, file uploads, parsing of CSV/PDF statements, transaction normalization, and communication with AI services.

3.⁠ ⁠*AI Processing Layer (Python FastAPI Service)*  
   Performs statistical analysis and anomaly detection using behavioral modeling techniques such as outlier detection, frequency analysis, and pattern deviation tracking.

4.⁠ ⁠*AI Reasoning (Gemini API Integration)*  
   Used for intelligent merchant categorization, transaction explanation, and generation of human-readable financial insights.

5.⁠ ⁠*Database (MongoDB Atlas)*  
   Stores users, transactions, categorized records, anomaly scores, and generated insights.

## System Architecture Diagram

![System Architecture Diagram](SystemArchitectureDiagram.png)

---

# 5. Database Design

## ER Diagram

![ER Diagram](ERdiagram.png)

---

## ER Diagram Description
The Traano database is designed to store structured financial data while supporting behavioral analysis and anomaly tracking.

The system contains four primary entities:

*1. User*
Stores account information and authentication details.

*2. Transaction*
Stores each parsed financial transaction extracted from uploaded bank statements. Each transaction is linked to a user and contains merchant, amount, date, category, and anomaly score.

*3. Category Insight*
Stores aggregated spending information such as total spending per category, frequency, and trends.

*4. Generated Insight*
Stores AI-generated summaries and explanations produced using the Gemini API, including weekly reports and anomaly explanations.

### Relationships
•⁠  ⁠One User → Many Transactions
•⁠  ⁠One Transaction → One Category
•⁠  ⁠One User → Many Insights
•⁠  ⁠Transactions are analyzed to produce Insights and Anomaly Flags

The schema allows efficient retrieval of user history, behavior trends, and suspicious activity patterns.

---

# 6. Dataset Selected

## Dataset Name
User Uploaded Bank Transaction Statements

## Source
User-provided bank statements (CSV and PDF formats from banks, UPI apps, and credit card providers)

## Data Type
Semi-structured financial transaction data including:
•⁠  ⁠Transaction date
•⁠  ⁠Merchant description
•⁠  ⁠Debit/Credit amount
•⁠  ⁠Reference information

## Selection Reason
The objective of Traano is to analyze *real personal financial behavior*, not synthetic or pre-cleaned datasets. Therefore, the system works directly with raw bank statements as they are downloaded by users. This makes the platform practical and applicable in real-world scenarios.

## Preprocessing Steps
1.⁠ ⁠File upload handling
2.⁠ ⁠PDF text extraction
3.⁠ ⁠CSV parsing
4.⁠ ⁠Column normalization
5.⁠ ⁠Date standardization
6.⁠ ⁠Amount cleaning (debit/credit separation)
7.⁠ ⁠Merchant name cleaning
8.⁠ ⁠Removal of duplicates
9.⁠ ⁠Structuring transactions into a unified format

# 7. Model Selected

## Model Name
Hybrid Statistical Anomaly Detection + AI Reasoning (Gemini API)

---

## Selection Reasoning
Financial anomaly detection in personal transactions does not require heavy deep learning models because labeled fraud datasets are not available for individual users. Instead, behavioral deviation detection is more effective.

Traano uses statistical techniques to model normal spending behavior and identify deviations. The Gemini API is used to interpret transactions semantically and generate human-readable explanations.

This hybrid approach ensures:
•⁠  ⁠Practical implementation
•⁠  ⁠Explainability
•⁠  ⁠Low computational cost
•⁠  ⁠Real-time feedback

---

## Alternatives Considered
•⁠  ⁠Isolation Forest
•⁠  ⁠Autoencoders
•⁠  ⁠Random Forest Classification

These were not selected because they require large labeled datasets and training time, which are impractical for a personal finance setting.

---

## Evaluation Metrics
•⁠  ⁠Outlier score (Z-score)
•⁠  ⁠Frequency deviation
•⁠  ⁠Merchant novelty detection
•⁠  ⁠Spending behavior change
•⁠  ⁠False positive rate
•⁠  ⁠Explainability of alerts

# 8. Technology Stack

## Frontend
•⁠  ⁠React (Vite)
•⁠  ⁠Tailwind CSS
•⁠  ⁠Recharts (Data Visualization)
•⁠  ⁠Axios

## Backend
•⁠  ⁠Node.js
•⁠  ⁠Express.js
•⁠  ⁠Multer (file uploads)
•⁠  ⁠PDF-Parse
•⁠  ⁠CSV-Parser

## ML / AI
•⁠  ⁠Python (FastAPI)
•⁠  ⁠Pandas
•⁠  ⁠NumPy
•⁠  ⁠Scikit-learn (statistical modeling)
•⁠  ⁠Google Gemini API (categorization & explanations)

## Database
•⁠  ⁠MongoDB Atlas
•⁠  ⁠Mongoose ODM

## Deployment
•⁠  ⁠Frontend: Vercel / Netlify
•⁠  ⁠Backend: Render / Railway
•⁠  ⁠Python Service: Render
•⁠  ⁠Database: MongoDB Atlas

---

# 9. API Documentation & Testing

## API Endpoints List
### Endpoint 1:
- **URL:** `POST /api/upload`
- **Description:** Upload CSV or PDF bank statements for processing and anomaly detection.

### Endpoint 2:
- **URL:** `GET /api/transactions`
- **Description:** Retrieve all processed and categorized transactions.

### Endpoint 3:
- **URL:** `GET /api/transactions/summary`
- **Description:** Retrieve financial insights and aggregated summary data.

## API Testing Screenshots
*(Add Postman / Thunder Client screenshots here)*

---

# 10. Module-wise Development & Deliverables

## Checkpoint 1: Research & Planning
**Deliverables:**
- Problem identification & solution concept
- User journey mapping and system workflow design 

## Checkpoint 2: Backend Development
**Deliverables:**
- Setup Node.js + Express backend
- Implemented file upload APIs with Multer
- CSV and PDF parsing logic

## Checkpoint 3: Frontend Development
**Deliverables:**
- Built UI using React and Tailwind CSS
- Developed interactive dashboard & customizable charts (Recharts)
- Integrated frontend with backend APIs

## Checkpoint 4: Model Training / Intelligent Processing
**Deliverables:**
- Implemented statistical logic for anomaly detection (Z-scores)
- Developed frequency & risk distribution models

## Checkpoint 5: Model Integration
**Deliverables:**
- Connected Google Gemini API for transaction semantic categorization
- Integrated explainable risk generation engine into backend

## Checkpoint 6: Deployment
**Deliverables:**
- Frontend deployed on Vercel
- Backend APIs deployed on Render
- MongoDB Atlas configured for cloud storage

---

# 11. End-to-End Workflow
1. User uploads bank statements (CSV/PDF) via the frontend.
2. File is processed (extracted, cleaned, standardized) by the backend.
3. Transactions are categorized automatically using Gemini API and heuristic rules.
4. Statistical engine evaluates each transaction for behavioral anomalies (risk scoring).
5. Data is securely stored in MongoDB.
6. User reviews categorized spending, insights, and explainable flagged transactions on the dashboard.

---

# 12. Demo & Video
**Live Demo Link:** [traano.vercel.app](https://traano.vercel.app)  
**Demo Video Link:** *(Add link here)*  
**GitHub Repository:** [https://github.com/dingdong-vamshi/Traano](https://github.com/dingdong-vamshi/Traano)

---

# 13. Hackathon Deliverables Summary
- Working, end-to-end full-stack web application.
- Comprehensive AI/Backend intelligence for personal finance tracking.
- Interactive user dashboard with real-time charts and explainable alerts.
- Fully documented source code and system architecture.

---

# 14. Team Roles & Responsibilities

| Member Name | Role | Responsibilities |
| :--- | :--- | :--- |
| **Vamshi** | Ideation & System Design | • Problem identification & solution concept<br>• Designed system workflow (8-stage pipeline)<br>• Planned database structure & anomaly strategy |
| **Harshita Jain** | Frontend Developer | • Built UI using React & Tailwind<br>• Developed interactive dashboard & charts<br>• Integrated frontend with backend APIs |
| **Rithwik Kuchana** | Backend Developer | • Developed APIs using Node.js & Express<br>• Implemented parsing & anomaly detection logic<br>• Managed MongoDB database & data security |

---

# 15. Future Scope & Scalability

## Short-Term
- Implement OAuth and personalized user accounts.
- Add support for direct Plaid / Account Aggregator API integration for real-time tracking.
- Email/SMS notifications for high-risk transactions.

## Long-Term
- Expand statistical models to include seasonal spending variation logic.
- Release dedicated iOS and Android native apps.
- Integrate budget-goal recommendations with anomaly alerts.

---

# 16. Known Limitations
- Does not currently support automated scraping from banking portals (requires statement upload).
- Dependency on external LLM (Gemini API) can create slight latency during initial categorizations.
- Extremely novel merchants (with no online presence) might receive generic fallback categories.

---

# 17. Impact
Traano shifts personal finance management from tedious retroactive record-keeping to proactive awareness. It bridges the gap between raw data and understandable insights, giving users confidence and ensuring that unusual, unauthorized, or fraudulent charges never slip past unnoticed.