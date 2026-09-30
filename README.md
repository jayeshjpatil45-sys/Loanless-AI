# 🛡️ LoanLess AI — Intelligent Financial Analysis Platform

An AI-powered BFSI (Banking, Financial Services, and Insurance) web platform that provides intelligent loan eligibility analysis, EMI calculation, credit score evaluation, and AI-powered financial guidance through a modern glassmorphism interface.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Claude AI](https://img.shields.io/badge/Claude_AI-6B4FBB?style=for-the-badge&logo=anthropic&logoColor=white)

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
├── styles.css              # Complete glassmorphism design system
├── script.js               # Core application logic & AI integration
├── google-apps-script.js   # Google Apps Script for Sheets integration
└── README.md               # Project documentation
```

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

## 🎨 Design System

- **Glassmorphism**: Transparent glass-like cards with backdrop blur
- **Dark Theme**: Premium fintech-inspired dark color palette
- **Animated Orbs**: Floating gradient orbs for depth
- **Micro-animations**: Fade-in, slide-up, glow, and hover effects
- **Responsive**: CSS Grid + Flexbox with mobile-first breakpoints
- **Custom Properties**: Consistent design tokens throughout

---

## 🌐 Deployment

The application is a static frontend — deploy to any static hosting:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect GitHub repository
- **Firebase Hosting**: `firebase deploy`

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using AI-Powered Financial Intelligence
</p>
