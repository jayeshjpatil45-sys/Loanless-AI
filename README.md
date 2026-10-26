# 🛡️ LoanLess AI — Intelligent Financial Analysis Platform

An AI-powered BFSI (Banking, Financial Services, and Insurance) web platform that provides intelligent loan eligibility analysis, EMI calculation, credit score evaluation, and AI-powered financial guidance through a modern glassmorphism interface.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Claude AI](https://img.shields.io/badge/Claude_AI-6B4FBB?style=for-the-badge&logo=anthropic&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white)
[![Project Report](https://img.shields.io/badge/Project_Report-PDF_Download-e11d48?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](./LoanLess_AI_Project_Report.pdf)

---

## 📊 Project Report

> 📄 **Official PDF Document:** [**Download / View LoanLess_AI_Project_Report.pdf**](./LoanLess_AI_Project_Report.pdf)  
> *A comprehensive, publication-ready project report with system architecture, security evaluation, module breakdowns, Indian BFSI context, and engineering metrics.*

### Executive Summary

**LoanLess AI** is a fully client-side, zero-dependency web platform built with HTML5, CSS3, and Vanilla JavaScript. It provides four core financial tools — Loan Eligibility Checker, Credit Score Analyzer, EMI Calculator, and an AI Financial Advisor — all powered by Claude AI with intelligent local fallback responses. The platform uses a serverless Google Apps Script + Google Sheets backend for data persistence and features a premium glassmorphism dark-theme design system.

> **Key Highlights:**
> - 🚀 Zero build step — open `index.html` and it works
> - 🤖 Dual-path AI — Claude API when available, comprehensive local fallback when not
> - 🇮🇳 Indian financial context — INR formatting, CIBIL scoring (300–900), Indian eligibility rules
> - 💎 Premium glassmorphism UI with 50+ CSS custom properties
> - ☁️ Serverless persistence via Google Apps Script → Google Sheets

---

### Project Metrics

| Metric | Value |
|---|---|
| **Total Files** | 9 (excl. `.git`) |
| **HTML Pages** | 5 (`index.html`, `eligibility.html`, `credit-score.html`, `emi-calculator.html`, `ai-tips.html`) |
| **JavaScript** | 1 file — `script.js` (944 lines, ~37 KB) |
| **CSS** | 1 file — `styles.css` (1,382 lines, ~29 KB) |
| **Backend Script** | 1 file — `google-apps-script.js` (94 lines, ~3 KB) |
| **Total Lines of Code** | ~3,150+ |
| **Total Project Size** | ~123 KB |
| **External Dependencies** | Font Awesome 6.5.1, Google Fonts (Inter, Outfit) |
| **AI Model** | Anthropic Claude (`claude-sonnet-4-20250514`) |
| **Data Storage** | Google Apps Script → Google Sheets |

---

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      BROWSER (Client-Side)                      │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  index.html  │ │eligibility.  │ │credit-score. │            │
│  │  Landing     │ │  html        │ │  html        │            │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘            │
│         │                │                │                     │
│  ┌──────┴────┐ ┌─────────┴──┐ ┌───────────┘                    │
│  │emi-calc.  │ │ ai-tips.   │ │                                │
│  │  html     │ │  html      │ │                                │
│  └──────┬────┘ └──────┬─────┘ │                                │
│         │             │       │                                 │
│         └──────┬──────┘───────┘                                 │
│                ▼                                                │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              script.js (944 lines)                  │        │
│  │  ┌────────────┬─────────────┬──────────────────┐    │        │
│  │  │ Eligibility│ Credit Score│ EMI Calculator   │    │        │
│  │  │ Checker    │ Analyzer    │                  │    │        │
│  │  ├────────────┼─────────────┼──────────────────┤    │        │
│  │  │ AI Chat    │ Navigation  │ Utilities        │    │        │
│  │  └────────────┴─────────────┴──────────────────┘    │        │
│  └────────────┬─────────────────────┬──────────────────┘        │
│               │                     │                           │
│  ┌────────────▼──────────┐  ┌───────▼──────────────┐            │
│  │   styles.css          │  │ localStorage         │            │
│  │   (1,382 lines)       │  │ (API Key Storage)    │            │
│  │   Glassmorphism       │  └──────────────────────┘            │
│  │   Design System       │                                      │
│  └───────────────────────┘                                      │
└──────────────────────┬─────────────────────┬────────────────────┘
                       │                     │
              ┌────────▼──────────┐ ┌────────▼────────────┐
              │  Claude AI API    │ │ Google Apps Script   │
              │  (Anthropic)      │ │   Web App            │
              │                   │ │         │            │
              │  Financial        │ │  ┌──────▼─────────┐  │
              │  Reasoning &      │ │  │ Google Sheets   │  │
              │  Advice           │ │  │ (3 auto-created │  │
              └───────────────────┘ │  │  sheets)        │  │
                                    │  └────────────────┘  │
                                    └──────────────────────┘
```

**Architecture Patterns:**
- **Multi-page application (MPA)** — each feature is a standalone HTML page sharing one JS + CSS bundle
- **Progressive enhancement** — all modules work offline with local fallback logic; Claude AI enhances responses when configured
- **Serverless data layer** — Google Apps Script acts as a REST endpoint writing to Google Sheets
- **Client-side API calls** — Claude API called directly from browser using `anthropic-dangerous-direct-browser-access` header

---

## ✨ Features

### 📋 Loan Eligibility Checker
- Rule-based financial validation (salary, credit score, EMI, age)
- Eligible amount calculation: `Salary × 20`
- Risk classification (Low / Medium / High)
- AI-powered personalized analysis and recommendations

### 📊 Credit Score Analyzer
- Credit score classification (Excellent / Good / Poor)
- Animated SVG gauge visualization
- Actionable improvement recommendations
- AI-driven credit improvement roadmaps

### 🧮 EMI Calculator
- Reducing-balance EMI formula: `EMI = P × R × (1+R)^N / ((1+R)^N - 1)`
- Visual principal vs interest ratio breakdown
- Multiple loan types support (Home, Personal, Car, Education, Business)
- AI-powered EMI optimization strategies

### 🤖 AI Financial Advisor
- Interactive chat interface powered by Claude AI
- Quick prompt suggestions for common queries
- Personalized financial guidance and planning tips
- Offline-capable with intelligent local fallback responses

### ☁️ Google Sheets Integration
- Serverless data storage via Google Apps Script
- Automatic record logging with timestamps
- Separate sheets for eligibility, credit, and EMI records

---

## 🏗️ Technology Stack

| Technology | Purpose |
|-----------|---------| 
| **HTML5** | Semantic structure and accessibility |
| **CSS3** | Glassmorphism design system with animations |
| **Vanilla JavaScript** | Business logic, DOM manipulation, API integration |
| **Claude AI (Anthropic)** | Intelligent financial reasoning and advice |
| **Google Apps Script** | Serverless backend for data storage |
| **Google Sheets** | Cloud-based data persistence |
| **Font Awesome 6** | Premium iconography |
| **Google Fonts** | Typography (Inter, Outfit) |

---

## 📐 Detailed Module Report

### Module 1: Landing Page (`index.html` — 224 lines)

| Aspect | Details |
|---|---|
| **Purpose** | Hero page, stats section, feature showcase, how-it-works, and CTA |
| **Key Sections** | Hero with gradient text, 4-column stats grid (99.2% accuracy, 50K+ analyses, 4.9★ rating, <2s response), 6 feature cards, 3-step how-it-works, CTA |
| **Animations** | Scroll-triggered fade-in via `IntersectionObserver`, floating background orbs |

### Module 2: Loan Eligibility Checker (`eligibility.html` — 176 lines)

| Aspect | Details |
|---|---|
| **Inputs** | Name, Monthly Salary, Credit Score, Existing EMI, Age, Employment Type |
| **Validation Rules** | Salary ≥ ₹30,000 · Credit Score > 700 · Existing EMI < ₹20,000 · Age ≥ 21 |
| **Eligible Amount** | `Salary × 20` |
| **Risk Engine** | Low (score ≥750 & EMI <10K) · Medium (score ≥650 & EMI <20K) · High (else) |
| **AI Feature** | Personalized analysis via Claude; local fallback provides structured advice |
| **Data Logged** | Name, salary, credit score, EMI, age, employment, status, eligible amount, risk level |

### Module 3: Credit Score Analyzer (`credit-score.html` — 190 lines)

| Aspect | Details |
|---|---|
| **Inputs** | Credit Score (300–900), Credit History Age (years), Credit Utilization (%) |
| **Classifications** | Excellent (≥750) · Good (650–749) · Poor (<650) |
| **Visualization** | SVG semi-circle gauge with gradient fill (red→amber→green), animated via `stroke-dashoffset` |
| **AI Feature** | Credit improvement plan via Claude; local fallback provides category-specific roadmap |
| **Educational Content** | Inline score guide explaining each tier with visual cards |

### Module 4: EMI Calculator (`emi-calculator.html` — 204 lines)

| Aspect | Details |
|---|---|
| **Inputs** | Loan Amount (min ₹10,000), Annual Interest Rate (0.1–36%), Tenure (1–30 yrs), Loan Type |
| **Formula** | `EMI = P × R × (1+R)^N / ((1+R)^N - 1)` (reducing-balance method) |
| **Loan Types** | Home, Personal, Car/Auto, Education, Business |
| **Visualization** | Animated horizontal stacked bar showing principal vs. interest ratio |
| **AI Feature** | EMI optimization tips including prepayment savings estimates |

### Module 5: AI Financial Advisor (`ai-tips.html` — 176 lines)

| Aspect | Details |
|---|---|
| **Quick Tips** | 6 card-based financial tips (credit score, budgeting, EMI ratio, emergency fund, loan comparison, prepayments) |
| **Chat Interface** | Real-time conversational UI with user/AI message bubbles |
| **Quick Prompts** | 4 pre-built queries (Improve Credit, Home Loan Tips, Loan Advice, Budget Rule) |
| **API Key Management** | Stored in `localStorage`, UI auto-hides key section after save |
| **Offline Mode** | Pattern-matched local responses for credit, EMI, budget, and general queries |

---

## 🧠 Code Architecture

### JavaScript Module Map (`script.js` — 944 lines)

```
script.js
├── CONFIG                              → Google Script URL, Claude API key (localStorage)
├── Initialization (DOMContentLoaded)   → Navbar, scroll animations, forms, API key UI
├── Navigation                          → Scroll effect, mobile hamburger toggle
├── Scroll Animations                   → IntersectionObserver for .animate-on-scroll
├── Form Initialization                 → Event listener binding for all 3 forms
├── API Key Management                  → localStorage read/write, UI toggle
├── Loan Eligibility Checker            → handleEligibilityCheck(), generateEligibilityAIAnalysis()
│   └── Local Fallback                  → generateLocalEligibilityAnalysis()
├── Credit Score Analyzer               → handleCreditAnalysis(), generateCreditAIAnalysis()
│   └── Local Fallback                  → generateLocalCreditAnalysis()
├── EMI Calculator                      → handleEMICalculation(), generateEMIAIAnalysis()
│   └── Local Fallback                  → generateLocalEMIAnalysis()
├── AI Chat Interface                   → sendChatMessage(), sendQuickPrompt()
│   └── Local Fallback                  → generateLocalChatResponse()
├── Claude AI Integration               → callClaudeAPI() — single API wrapper
├── Google Sheets Integration           → saveToGoogleSheets() — no-cors POST
└── Utilities                           → formatNumber() (Indian system), escapeHTML(), showToast()
```

> **Design Decision:** Every AI-powered feature uses a dual-path architecture. If the Claude API key is configured, it calls the API; otherwise, it generates comprehensive responses using rule-based templates. This ensures 100% functionality without any API dependency.

### CSS Design System (`styles.css` — 1,382 lines)

| Category | Details |
|---|---|
| **Fonts** | Outfit (headings) + Inter (body) via Google Fonts |
| **Color System** | 10-shade primary palette (indigo), 5 accent colors (cyan, emerald, amber, rose, violet), 10-shade dark neutral |
| **Glass System** | `rgba(255,255,255,0.05)` bg, `blur(20px)`, `rgba(255,255,255,0.1)` borders |
| **Gradients** | 8 named gradient custom properties |
| **Typography** | 11-step scale from `0.75rem` to `clamp(2.5rem, 5vw, 4.5rem)` |
| **Spacing** | 14-step scale (0.25rem → 6rem) |
| **Animations** | `fadeInUp`, `float`, `pulse`, `spin`, gradient text shimmer |
| **Responsive** | Mobile-first with breakpoints at 768px and 480px |
| **Components** | Navbar, glass cards, forms, result cards, gauge, chat bubbles, toasts, tips grid |

### Google Apps Script (`google-apps-script.js` — 94 lines)

| Endpoint | Purpose |
|---|---|
| `doPost(e)` | Receives JSON payloads, routes to appropriate sheet based on `data.type` |
| `doGet(e)` | Health check endpoint returning `{ status: 'active' }` |
| `getOrCreateSheet()` | Auto-creates sheets with typed headers on first write |

**Auto-Created Sheets:**

| Sheet Name | Columns |
|---|---|
| **Eligibility Records** | Timestamp, Name, Salary, Credit Score, Existing EMI, Age, Employment, Status, Eligible Amount, Risk Level |
| **Credit Analyses** | Timestamp, Score, Category, Credit Age, Credit Utilization |
| **EMI Calculations** | Timestamp, Loan Amount, Interest Rate, Tenure, Loan Type, EMI, Total Interest, Total Payment |

---

## 📐 Eligibility Rules

| Criteria | Requirement |
|----------|------------|
| Monthly Salary | ≥ ₹30,000 |
| Credit Score | > 700 |
| Existing EMI | < ₹20,000 |
| Applicant Age | ≥ 21 years |
| **Eligible Amount** | **Salary × 20** |

---

## 🔒 Security Considerations

| Area | Status | Notes |
|---|---|---|
| **XSS Protection** | ✅ Implemented | `escapeHTML()` sanitizes all user input before DOM insertion |
| **API Key Storage** | ⚠️ Client-side | Claude API key stored in `localStorage` — acceptable for personal use |
| **CORS** | ⚠️ Browser-direct | Uses `anthropic-dangerous-direct-browser-access` header — intended for dev/personal use |
| **Data Transmission** | ✅ | Google Sheets POST uses `mode: 'no-cors'` |
| **Input Validation** | ✅ | All form inputs validated with range checks before processing |

---

## ⚡ Performance

| Aspect | Details |
|---|---|
| **Bundle Size** | ~123 KB total (no frameworks, no build step) |
| **Load Time** | Instant — static HTML, single JS + CSS file |
| **Runtime** | All computation is client-side; API calls are async |
| **Animations** | Hardware-accelerated CSS transforms |
| **Number Formatting** | Indian numbering system (lakhs/crores) via custom `formatNumber()` |

---

## 🎨 Design System

- **Glassmorphism**: Transparent glass-like cards with backdrop blur
- **Dark Theme**: Premium fintech-inspired dark color palette
- **Animated Orbs**: Floating gradient orbs for depth
- **Micro-animations**: Fade-in, slide-up, glow, and hover effects
- **Responsive**: CSS Grid + Flexbox with mobile-first breakpoints
- **Custom Properties**: 50+ design tokens for consistency throughout

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Loanless-AI.git
cd Loanless-AI
```

### 2. Open Locally
Simply open `index.html` in your browser — no build step or server required!

### 3. Configure Claude AI (Optional)
1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Enter the key in the AI Tips page, or add it directly in `script.js`
3. The platform works without an API key using intelligent local fallback responses

### 4. Configure Google Sheets Storage (Optional)
1. Create a new Google Sheet
2. Go to [Google Apps Script](https://script.google.com/) → New Project
3. Paste the code from `google-apps-script.js`
4. Deploy as Web App (Execute as: Me, Access: Anyone)
5. Copy the deployed URL into `script.js` → `CONFIG.GOOGLE_SCRIPT_URL`

---

## 📁 Project Structure

```
Loanless-AI/
├── index.html              # Landing page with hero, features, stats
├── eligibility.html        # Loan Eligibility Checker module
├── credit-score.html       # Credit Score Analyzer module
├── emi-calculator.html     # EMI Calculator module
├── ai-tips.html            # AI Financial Advisor chat interface
├── styles.css              # Complete glassmorphism design system (1,382 lines)
├── script.js               # Core application logic & AI integration (944 lines)
├── google-apps-script.js          # Google Apps Script for Sheets integration (94 lines)
├── LoanLess_AI_Project_Report.pdf # Comprehensive PDF Project Report (1.4 MB)
└── README.md                      # Project documentation & report
```

---

## 🌐 Deployment

The application is a static frontend — deploy to any static hosting:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect GitHub repository
- **Firebase Hosting**: `firebase deploy`

---

## 🔮 Future Improvements

| Area | Suggestion |
|---|---|
| **Amortization Schedule** | Add a monthly breakdown table to the EMI calculator |
| **Charts** | Integrate Chart.js or D3.js for pie/doughnut charts in EMI breakdown |
| **PWA Support** | Add `manifest.json` and service worker for installable offline support |
| **Cross-page State** | Use `sessionStorage` or URL params to share data between modules |
| **Testing** | Add unit tests for `formatNumber()`, EMI calculation, and eligibility logic |
| **Accessibility** | Add ARIA labels to dynamic result sections and improve keyboard navigation |
| **API Rate Limiting** | Add client-side rate limiting for Claude API calls |
| **Multi-language** | Add Hindi and regional language support for broader Indian audience |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using AI-Powered Financial Intelligence
</p>
