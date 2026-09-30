/* ============================================
   LoanLess AI — Core Application Logic
   ============================================ */

// ─── Configuration ───
const CONFIG = {
  // Google Apps Script Web App URL — replace with your deployed script URL
  GOOGLE_SCRIPT_URL: '',
  // Claude API key — stored in localStorage
  get CLAUDE_API_KEY() {
    return localStorage.getItem('loanless_claude_api_key') || '';
  }
};

// ─── Initialization ───
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initForms();
  initApiKeyUI();
});

// ============================================
//  NAVIGATION
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }
}

// ============================================
//  SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
//  FORM INITIALIZATION
// ============================================
function initForms() {
  // Loan Eligibility Form
  const eligibilityForm = document.getElementById('eligibilityForm');
  if (eligibilityForm) {
    eligibilityForm.addEventListener('submit', handleEligibilityCheck);
  }

  // Credit Score Form
  const creditScoreForm = document.getElementById('creditScoreForm');
  if (creditScoreForm) {
    creditScoreForm.addEventListener('submit', handleCreditAnalysis);
  }

  // EMI Calculator Form
  const emiForm = document.getElementById('emiForm');
  if (emiForm) {
    emiForm.addEventListener('submit', handleEMICalculation);
  }
}

// ============================================
//  API KEY MANAGEMENT
// ============================================
function initApiKeyUI() {
  const apiKeyInput = document.getElementById('claudeApiKey');
  const apiKeySection = document.getElementById('apiKeySection');

  if (apiKeyInput && CONFIG.CLAUDE_API_KEY) {
    apiKeyInput.value = CONFIG.CLAUDE_API_KEY;
    if (apiKeySection) {
      apiKeySection.style.display = 'none';
    }
  }
}

function saveApiKey() {
  const apiKeyInput = document.getElementById('claudeApiKey');
  const apiKeySection = document.getElementById('apiKeySection');

  if (apiKeyInput && apiKeyInput.value.trim()) {
    localStorage.setItem('loanless_claude_api_key', apiKeyInput.value.trim());
    showToast('API key saved successfully!', 'success');
    if (apiKeySection) {
      apiKeySection.style.display = 'none';
    }
  } else {
    showToast('Please enter a valid API key.', 'error');
  }
}

// ============================================
//  LOAN ELIGIBILITY CHECKER
// ============================================
function handleEligibilityCheck(e) {
  e.preventDefault();

  const name = document.getElementById('applicantName').value.trim();
  const salary = parseFloat(document.getElementById('monthlySalary').value);
  const creditScore = parseInt(document.getElementById('creditScoreElig').value);
  const existingEMI = parseFloat(document.getElementById('existingEMI').value);
  const age = parseInt(document.getElementById('applicantAge').value);
  const employment = document.getElementById('employmentType').value;

  // Validation
  if (!name) return showToast('Please enter your name.', 'error');
  if (isNaN(salary) || salary <= 0) return showToast('Please enter a valid salary.', 'error');
  if (isNaN(creditScore) || creditScore < 300 || creditScore > 900) return showToast('Credit score must be between 300–900.', 'error');
  if (isNaN(existingEMI) || existingEMI < 0) return showToast('Please enter valid existing EMI.', 'error');
  if (isNaN(age) || age < 18 || age > 70) return showToast('Please enter a valid age (18–70).', 'error');

  // Rule-based eligibility checks
  const checks = {
    salary: salary >= 30000,
    credit: creditScore > 700,
    emi: existingEMI < 20000,
    age: age >= 21
  };

  const allPassed = checks.salary && checks.credit && checks.emi && checks.age;
  const eligibleAmount = allPassed ? salary * 20 : 0;

  // Risk classification
  let riskLevel, riskPercent, riskClass;
  if (creditScore >= 750 && existingEMI < 10000) {
    riskLevel = 'Low Risk';
    riskPercent = 25;
    riskClass = 'fill-success';
  } else if (creditScore >= 650 && existingEMI < 20000) {
    riskLevel = 'Medium Risk';
    riskPercent = 55;
    riskClass = 'fill-warning';
  } else {
    riskLevel = 'High Risk';
    riskPercent = 85;
    riskClass = 'fill-danger';
  }

  // Failed conditions list
  const failedReasons = [];
  if (!checks.salary) failedReasons.push(`Monthly salary ₹${formatNumber(salary)} is below the ₹30,000 minimum requirement`);
  if (!checks.credit) failedReasons.push(`Credit score ${creditScore} is below the 700 minimum threshold`);
  if (!checks.emi) failedReasons.push(`Existing EMI ₹${formatNumber(existingEMI)} exceeds the ₹20,000 limit`);
  if (!checks.age) failedReasons.push(`Age ${age} is below the minimum 21 years`);

  // Display result
  const resultPanel = document.getElementById('eligibilityResult');
  const resultCard = document.getElementById('resultCard');
  const resultStatusIcon = document.getElementById('resultStatusIcon');
  const resultIcon = document.getElementById('resultIcon');
  const resultTitle = document.getElementById('resultTitle');
  const resultSubtitle = document.getElementById('resultSubtitle');
  const resultDetails = document.getElementById('resultDetails');
  const riskBar = document.getElementById('riskBar');
  const riskLabel = document.getElementById('riskLabel');

  resultCard.className = `result-card ${allPassed ? 'approved' : 'rejected'}`;
  resultStatusIcon.className = `result-status-icon ${allPassed ? 'success' : 'error'}`;
  resultIcon.className = allPassed ? 'fas fa-check-circle' : 'fas fa-times-circle';
  resultTitle.textContent = allPassed ? 'Congratulations! You\'re Eligible' : 'Application Not Approved';
  resultSubtitle.textContent = allPassed
    ? `${name}, you qualify for a loan up to ₹${formatNumber(eligibleAmount)}`
    : `${name}, your application doesn't meet the current criteria`;

  // Build detail items
  let detailsHTML = `
    <div class="result-detail-item">
      <div class="result-detail-label">Status</div>
      <div class="result-detail-value ${allPassed ? 'text-success' : 'text-danger'}">
        ${allPassed ? 'Approved' : 'Rejected'}
      </div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Eligible Amount</div>
      <div class="result-detail-value text-primary">₹${formatNumber(eligibleAmount)}</div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Risk Level</div>
      <div class="result-detail-value ${riskPercent <= 30 ? 'text-success' : riskPercent <= 60 ? 'text-warning' : 'text-danger'}">${riskLevel}</div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Credit Score</div>
      <div class="result-detail-value text-info">${creditScore}</div>
    </div>
  `;

  if (!allPassed && failedReasons.length > 0) {
    detailsHTML += `
      <div class="result-detail-item" style="grid-column: 1 / -1;">
        <div class="result-detail-label">Rejection Reasons</div>
        <div style="color: var(--text-secondary); font-size: var(--fs-sm); line-height: 1.8;">
          ${failedReasons.map(r => `<div style="display: flex; align-items: flex-start; gap: 8px;"><i class="fas fa-xmark" style="color: var(--accent-rose); margin-top: 4px;"></i> ${r}</div>`).join('')}
        </div>
      </div>
    `;
  }

  resultDetails.innerHTML = detailsHTML;

  // Risk bar animation
  riskLabel.textContent = riskLevel;
  riskBar.className = `progress-fill ${riskClass}`;
  riskBar.style.width = '0%';

  resultPanel.classList.add('visible');
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Animate risk bar
  setTimeout(() => {
    riskBar.style.width = riskPercent + '%';
  }, 300);

  // Trigger AI analysis
  const aiContent = document.getElementById('aiAnalysisContent');
  aiContent.innerHTML = '<div class="ai-loading"><div class="spinner"></div> Generating personalized analysis...</div>';

  const analysisData = {
    name, salary, creditScore, existingEMI, age, employment,
    eligible: allPassed, eligibleAmount, riskLevel, failedReasons
  };

  generateEligibilityAIAnalysis(analysisData);

  // Save to Google Sheets
  saveToGoogleSheets({
    type: 'eligibility',
    name,
    salary,
    creditScore,
    existingEMI,
    age,
    employment,
    status: allPassed ? 'Approved' : 'Rejected',
    eligibleAmount,
    riskLevel
  });
}

async function generateEligibilityAIAnalysis(data) {
  const aiContent = document.getElementById('aiAnalysisContent');

  if (!CONFIG.CLAUDE_API_KEY) {
    // Generate local analysis without AI
    const localAnalysis = generateLocalEligibilityAnalysis(data);
    aiContent.textContent = localAnalysis;
    return;
  }

  const prompt = `You are a financial advisor AI. Analyze this loan eligibility result and provide personalized, actionable advice.

Applicant: ${data.name}
Monthly Salary: ₹${formatNumber(data.salary)}
Credit Score: ${data.creditScore}
Existing EMI: ₹${formatNumber(data.existingEMI)}
Age: ${data.age}
Employment: ${data.employment}
Eligibility Status: ${data.eligible ? 'APPROVED' : 'REJECTED'}
${data.eligible ? `Eligible Loan Amount: ₹${formatNumber(data.eligibleAmount)}` : ''}
Risk Level: ${data.riskLevel}
${data.failedReasons.length > 0 ? `Rejection Reasons: ${data.failedReasons.join('; ')}` : ''}

Provide a brief, structured analysis (max 200 words) with:
1. Assessment summary (1-2 sentences)
2. Key recommendations (3-4 bullet points)
3. Next steps

Use Indian Rupee (₹) for currency. Be encouraging but honest.`;

  try {
    const response = await callClaudeAPI(prompt);
    aiContent.textContent = response;
  } catch (error) {
    const localAnalysis = generateLocalEligibilityAnalysis(data);
    aiContent.textContent = localAnalysis;
  }
}

function generateLocalEligibilityAnalysis(data) {
  if (data.eligible) {
    return `✅ Assessment Summary
${data.name}, your financial profile meets all eligibility criteria. With a monthly salary of ₹${formatNumber(data.salary)} and a credit score of ${data.creditScore}, you qualify for a loan up to ₹${formatNumber(data.eligibleAmount)}.

📋 Key Recommendations:
• Consider a loan tenure that keeps your EMI below 40% of your monthly income
• With your ${data.riskLevel.toLowerCase()} profile, you may negotiate better interest rates
• Maintain your credit score by ensuring all existing EMIs are paid on time
• Build an emergency fund of 6 months' expenses before taking on new debt

🎯 Next Steps:
Compare loan offers from multiple lenders to find the best interest rate. Consider starting with a pre-approved loan check for faster processing.`;
  } else {
    let advice = `⚠️ Assessment Summary
${data.name}, your application doesn't meet the current eligibility criteria. Here's what you can do to improve your chances:\n\n📋 Key Recommendations:\n`;

    if (data.failedReasons.some(r => r.includes('salary'))) {
      advice += `• Focus on increasing your income through upskilling, certifications, or side income streams\n`;
    }
    if (data.failedReasons.some(r => r.includes('Credit score'))) {
      advice += `• Improve your credit score by paying existing dues on time and reducing credit utilization below 30%\n`;
    }
    if (data.failedReasons.some(r => r.includes('EMI'))) {
      advice += `• Reduce existing EMI obligations by closing smaller loans or consolidating debts\n`;
    }
    if (data.failedReasons.some(r => r.includes('Age'))) {
      advice += `• You need to be at least 21 years old to qualify. Consider applying when eligible\n`;
    }

    advice += `\n🎯 Next Steps:\nWork on the areas identified above and re-apply in 3-6 months. Consider consulting a financial advisor for personalized debt management strategies.`;
    return advice;
  }
}

// ============================================
//  CREDIT SCORE ANALYZER
// ============================================
function handleCreditAnalysis(e) {
  e.preventDefault();

  const score = parseInt(document.getElementById('creditScoreInput').value);
  const creditAge = parseInt(document.getElementById('creditAge').value) || 0;
  const creditUtil = parseInt(document.getElementById('creditUtil').value) || 0;

  // Validation
  if (isNaN(score) || score < 300 || score > 900) {
    return showToast('Please enter a valid credit score (300–900).', 'error');
  }

  // Classification
  let category, categoryClass, description, recommendations;

  if (score >= 750) {
    category = 'Excellent';
    categoryClass = 'text-success';
    description = 'Outstanding credit health! You\'re a premium borrower.';
    recommendations = [
      { icon: 'fas fa-trophy', text: 'You qualify for the lowest interest rates and highest credit limits' },
      { icon: 'fas fa-chart-line', text: 'Maintain this score by keeping credit utilization below 30%' },
      { icon: 'fas fa-piggy-bank', text: 'Consider premium credit cards for maximum rewards and cashback' },
      { icon: 'fas fa-shield-halved', text: 'Monitor your credit report regularly for unauthorized inquiries' }
    ];
  } else if (score >= 650) {
    category = 'Good';
    categoryClass = 'text-warning';
    description = 'Fair credit profile. Room for improvement to unlock premium benefits.';
    recommendations = [
      { icon: 'fas fa-clock', text: 'Ensure all bills and EMIs are paid on time for the next 6 months' },
      { icon: 'fas fa-credit-card', text: 'Reduce credit card utilization to below 30% of your limit' },
      { icon: 'fas fa-ban', text: 'Avoid applying for multiple loans or credit cards simultaneously' },
      { icon: 'fas fa-arrow-trend-up', text: 'A score of 750+ will unlock better interest rates — target this' }
    ];
  } else {
    category = 'Poor';
    categoryClass = 'text-danger';
    description = 'Your credit needs immediate attention and improvement.';
    recommendations = [
      { icon: 'fas fa-exclamation-triangle', text: 'Prioritize paying off any overdue payments and defaulted loans' },
      { icon: 'fas fa-hand-holding-dollar', text: 'Start with a secured credit card to rebuild your credit history' },
      { icon: 'fas fa-chart-simple', text: 'Reduce overall debt and avoid taking any new loans currently' },
      { icon: 'fas fa-calendar-check', text: 'Set up auto-pay for all recurring bills to ensure timely payments' }
    ];
  }

  // Update gauge
  const gaugeArc = document.getElementById('gaugeArc');
  const gaugeScore = document.getElementById('gaugeScore');
  const totalArcLength = 283;
  const scorePercentage = (score - 300) / 600;
  const dashOffset = totalArcLength - (totalArcLength * scorePercentage);

  gaugeScore.textContent = score;
  gaugeArc.style.strokeDashoffset = totalArcLength; // reset
  setTimeout(() => {
    gaugeArc.style.strokeDashoffset = dashOffset;
  }, 100);

  // Update title
  document.getElementById('creditTitle').innerHTML = `<span class="${categoryClass}">${category}</span> Credit Score`;
  document.getElementById('creditSubtitle').textContent = description;

  // Details
  const creditDetails = document.getElementById('creditDetails');
  creditDetails.innerHTML = `
    <div class="result-detail-item">
      <div class="result-detail-label">Score</div>
      <div class="result-detail-value ${categoryClass}">${score}</div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Category</div>
      <div class="result-detail-value ${categoryClass}">${category}</div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Credit Age</div>
      <div class="result-detail-value text-info">${creditAge > 0 ? creditAge + ' yrs' : 'N/A'}</div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Utilization</div>
      <div class="result-detail-value ${creditUtil <= 30 ? 'text-success' : creditUtil <= 50 ? 'text-warning' : 'text-danger'}">${creditUtil > 0 ? creditUtil + '%' : 'N/A'}</div>
    </div>
  `;

  // Recommendations
  const recContainer = document.getElementById('creditRecommendations');
  recContainer.innerHTML = `
    <div style="font-size: var(--fs-sm); font-weight: 600; margin-bottom: var(--space-3);">
      <i class="fas fa-lightbulb" style="color: var(--accent-amber);"></i> Recommendations
    </div>
    ${recommendations.map(r => `
      <div style="display: flex; align-items: flex-start; gap: var(--space-3); margin-bottom: var(--space-3); padding: var(--space-3); background: rgba(255,255,255,0.02); border-radius: var(--radius-sm);">
        <i class="${r.icon}" style="color: var(--primary-300); margin-top: 2px; font-size: var(--fs-sm);"></i>
        <span style="color: var(--text-secondary); font-size: var(--fs-sm); line-height: 1.6;">${r.text}</span>
      </div>
    `).join('')}
  `;

  // Show result
  const resultPanel = document.getElementById('creditResult');
  resultPanel.classList.add('visible');
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // AI Analysis
  const aiContent = document.getElementById('creditAiContent');
  aiContent.innerHTML = '<div class="ai-loading"><div class="spinner"></div> Generating credit improvement plan...</div>';

  generateCreditAIAnalysis({ score, creditAge, creditUtil, category });

  // Save to Google Sheets
  saveToGoogleSheets({
    type: 'credit_analysis',
    score,
    category,
    creditAge,
    creditUtil
  });
}

async function generateCreditAIAnalysis(data) {
  const aiContent = document.getElementById('creditAiContent');

  if (!CONFIG.CLAUDE_API_KEY) {
    const localAnalysis = generateLocalCreditAnalysis(data);
    aiContent.textContent = localAnalysis;
    return;
  }

  const prompt = `You are a credit score expert AI. Analyze this credit profile and provide actionable improvement advice.

Credit Score: ${data.score}/900
Category: ${data.category}
Credit History Age: ${data.creditAge > 0 ? data.creditAge + ' years' : 'Not provided'}
Credit Utilization: ${data.creditUtil > 0 ? data.creditUtil + '%' : 'Not provided'}

Provide a brief analysis (max 150 words) with:
1. Current standing assessment
2. Top 3 improvement actions ranked by impact
3. Expected timeline for improvement

Use Indian financial context. Be specific with actionable steps.`;

  try {
    const response = await callClaudeAPI(prompt);
    aiContent.textContent = response;
  } catch (error) {
    const localAnalysis = generateLocalCreditAnalysis(data);
    aiContent.textContent = localAnalysis;
  }
}

function generateLocalCreditAnalysis(data) {
  if (data.category === 'Excellent') {
    return `🏆 Your credit score of ${data.score} places you in the excellent category. You're among the top tier of borrowers.

📈 Maintenance Plan:
• Continue your excellent payment habits — consistency is key
• Keep credit utilization below 30% to maintain your premium status
• Diversify your credit mix with different types of credit products
• Review your credit report annually for accuracy

⏱️ Timeline: Continue current practices to maintain your excellent standing. Any dip can be recovered within 2-3 months with consistent behavior.`;
  } else if (data.category === 'Good') {
    return `📊 Your credit score of ${data.score} is in the good range. With targeted improvements, you can reach the excellent tier.

📈 Improvement Plan (by impact):
1. Payment consistency — Ensure 100% on-time payments for the next 6 months
2. Credit utilization — Reduce to below 30% (currently ${data.creditUtil > 0 ? data.creditUtil + '%' : 'unknown'})
3. Credit mix — Consider adding a different type of credit account

⏱️ Expected Timeline: With disciplined financial behavior, expect a 50-100 point improvement within 6-12 months.`;
  } else {
    return `⚠️ Your credit score of ${data.score} needs immediate attention. Focus on these high-impact actions:

📈 Recovery Plan (by priority):
1. Clear any overdue payments or defaults — this has the highest impact
2. Start with a secured credit card to build positive credit history
3. Reduce total outstanding debt by focusing on high-interest loans first
4. Avoid any new hard inquiries for at least 6 months

⏱️ Expected Timeline: Significant improvement (100+ points) is achievable within 12-18 months with consistent effort. Clearing defaults alone can improve your score by 50-80 points.`;
  }
}

// ============================================
//  EMI CALCULATOR
// ============================================
function handleEMICalculation(e) {
  e.preventDefault();

  const principal = parseFloat(document.getElementById('loanAmount').value);
  const annualRate = parseFloat(document.getElementById('interestRate').value);
  const tenureYears = parseInt(document.getElementById('loanTenure').value);
  const loanType = document.getElementById('loanType').value;

  // Validation
  if (isNaN(principal) || principal < 10000) return showToast('Loan amount must be at least ₹10,000.', 'error');
  if (isNaN(annualRate) || annualRate <= 0 || annualRate > 36) return showToast('Interest rate must be between 0.1% and 36%.', 'error');
  if (isNaN(tenureYears) || tenureYears < 1 || tenureYears > 30) return showToast('Tenure must be between 1 and 30 years.', 'error');

  // EMI Calculation: EMI = P × R × (1+R)^N / ((1+R)^N - 1)
  const R = annualRate / 12 / 100; // Monthly interest rate
  const N = tenureYears * 12;       // Total months

  let emi;
  if (R === 0) {
    emi = principal / N;
  } else {
    const compoundFactor = Math.pow(1 + R, N);
    emi = (principal * R * compoundFactor) / (compoundFactor - 1);
  }

  const totalPayment = emi * N;
  const totalInterest = totalPayment - principal;
  const principalPercent = (principal / totalPayment * 100).toFixed(1);
  const interestPercent = (totalInterest / totalPayment * 100).toFixed(1);

  // Display results
  document.getElementById('emiValue').textContent = `₹${formatNumber(Math.round(emi))}`;
  document.getElementById('emiPrincipal').textContent = `₹${formatNumber(Math.round(principal))}`;
  document.getElementById('emiInterest').textContent = `₹${formatNumber(Math.round(totalInterest))}`;
  document.getElementById('emiTotal').textContent = `₹${formatNumber(Math.round(totalPayment))}`;

  // Principal/Interest bars
  document.getElementById('principalBar').style.width = '0%';
  document.getElementById('interestBar').style.width = '0%';
  document.getElementById('principalPercent').textContent = principalPercent + '%';
  document.getElementById('interestPercent').textContent = interestPercent + '%';

  // Additional details
  const emiDetails = document.getElementById('emiDetails');
  emiDetails.innerHTML = `
    <div class="result-detail-item">
      <div class="result-detail-label">Loan Type</div>
      <div class="result-detail-value text-primary">${loanType.charAt(0).toUpperCase() + loanType.slice(1)}</div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Interest Rate</div>
      <div class="result-detail-value text-warning">${annualRate}% p.a.</div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Tenure</div>
      <div class="result-detail-value text-info">${tenureYears} yr${tenureYears > 1 ? 's' : ''} (${N} months)</div>
    </div>
    <div class="result-detail-item">
      <div class="result-detail-label">Monthly Rate</div>
      <div class="result-detail-value text-primary">${(R * 100).toFixed(3)}%</div>
    </div>
  `;

  // Show result
  const resultPanel = document.getElementById('emiResult');
  resultPanel.classList.add('visible');
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Animate bars
  setTimeout(() => {
    document.getElementById('principalBar').style.width = principalPercent + '%';
    document.getElementById('interestBar').style.width = interestPercent + '%';
  }, 300);

  // AI Analysis
  const aiContent = document.getElementById('emiAiContent');
  aiContent.innerHTML = '<div class="ai-loading"><div class="spinner"></div> Generating EMI optimization tips...</div>';

  generateEMIAIAnalysis({ principal, annualRate, tenureYears, emi, totalInterest, totalPayment, loanType });

  // Save to Google Sheets
  saveToGoogleSheets({
    type: 'emi_calculation',
    loanAmount: principal,
    interestRate: annualRate,
    tenure: tenureYears,
    loanType,
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment)
  });
}

async function generateEMIAIAnalysis(data) {
  const aiContent = document.getElementById('emiAiContent');

  if (!CONFIG.CLAUDE_API_KEY) {
    const localAnalysis = generateLocalEMIAnalysis(data);
    aiContent.textContent = localAnalysis;
    return;
  }

  const prompt = `You are a loan EMI optimization expert. Analyze this EMI calculation and provide smart repayment advice.

Loan Type: ${data.loanType}
Principal: ₹${formatNumber(Math.round(data.principal))}
Interest Rate: ${data.annualRate}% per annum
Tenure: ${data.tenureYears} years (${data.tenureYears * 12} months)
Monthly EMI: ₹${formatNumber(Math.round(data.emi))}
Total Interest: ₹${formatNumber(Math.round(data.totalInterest))}
Total Payment: ₹${formatNumber(Math.round(data.totalPayment))}

Provide a brief analysis (max 150 words) with:
1. Cost efficiency assessment
2. Top 3 EMI optimization strategies
3. Prepayment savings estimate (if 10% prepaid annually)

Use Indian Rupee (₹). Be practical and specific.`;

  try {
    const response = await callClaudeAPI(prompt);
    aiContent.textContent = response;
  } catch (error) {
    const localAnalysis = generateLocalEMIAnalysis(data);
    aiContent.textContent = localAnalysis;
  }
}

function generateLocalEMIAnalysis(data) {
  const interestToLoanRatio = ((data.totalInterest / data.principal) * 100).toFixed(1);
  const annualPrepayment = data.principal * 0.1;

  return `📊 EMI Analysis Summary
Your monthly EMI of ₹${formatNumber(Math.round(data.emi))} for a ${data.loanType} loan at ${data.annualRate}% interest.

Total interest of ₹${formatNumber(Math.round(data.totalInterest))} represents ${interestToLoanRatio}% of your principal — ${interestToLoanRatio > 50 ? 'consider strategies to reduce this' : 'a reasonable interest burden'}.

💡 Optimization Strategies:
1. Prepayment: Making an annual prepayment of ~₹${formatNumber(Math.round(annualPrepayment))} (10% of principal) could reduce tenure by 2-4 years and save significant interest
2. Rate Negotiation: Even a 0.5% rate reduction could save ₹${formatNumber(Math.round(data.totalPayment * 0.03))} over the full tenure
3. Tenure Optimization: Shorter tenure means higher EMI but substantially less total interest

🎯 Pro Tip: Ensure your total EMI obligations (including this one) don't exceed 40% of your monthly income for healthy financial management.`;
}

// ============================================
//  AI CHAT INTERFACE
// ============================================
function sendQuickPrompt(text) {
  const chatInput = document.getElementById('chatInput');
  chatInput.value = text;
  sendChatMessage();
}

async function sendChatMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  if (!message) return;

  const chatMessages = document.getElementById('chatMessages');

  // Add user message
  chatMessages.innerHTML += `
    <div class="chat-message user">
      <div class="chat-avatar human"><i class="fas fa-user"></i></div>
      <div class="chat-bubble">${escapeHTML(message)}</div>
    </div>
  `;

  chatInput.value = '';

  // Add loading indicator
  const loadingId = 'loading-' + Date.now();
  chatMessages.innerHTML += `
    <div class="chat-message ai" id="${loadingId}">
      <div class="chat-avatar ai"><i class="fas fa-robot"></i></div>
      <div class="chat-bubble">
        <div class="ai-loading">
          <div class="spinner"></div> Thinking...
        </div>
      </div>
    </div>
  `;

  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    let response;

    if (CONFIG.CLAUDE_API_KEY) {
      response = await callClaudeAPI(`You are a financial advisor AI assistant for an Indian loan eligibility platform called LoanLess AI. Provide helpful, concise financial advice. Use Indian Rupee (₹) for currency. Be professional yet friendly.\n\nUser question: ${message}`);
    } else {
      response = generateLocalChatResponse(message);
    }

    // Remove loading and add response
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();

    chatMessages.innerHTML += `
      <div class="chat-message ai">
        <div class="chat-avatar ai"><i class="fas fa-robot"></i></div>
        <div class="chat-bubble">${escapeHTML(response)}</div>
      </div>
    `;
  } catch (error) {
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();

    chatMessages.innerHTML += `
      <div class="chat-message ai">
        <div class="chat-avatar ai"><i class="fas fa-robot"></i></div>
        <div class="chat-bubble" style="border-color: rgba(244, 63, 94, 0.3);">
          Sorry, I encountered an error processing your request. Please check your API key and try again.
        </div>
      </div>
    `;
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateLocalChatResponse(message) {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('credit score') || lowerMsg.includes('credit')) {
    return `Here are key tips to improve your credit score:

1. 📅 Pay all bills and EMIs on time — payment history is the #1 factor (35% impact)
2. 💳 Keep credit utilization below 30% of your total limit
3. 📊 Maintain a mix of credit types (credit cards + loans)
4. 🚫 Avoid multiple loan applications in a short period
5. 📋 Check your credit report regularly for errors

A score improvement of 50-100 points is achievable within 6-12 months with disciplined financial behavior. Would you like specific advice based on your current score?`;
  }

  if (lowerMsg.includes('emi') || lowerMsg.includes('repay') || lowerMsg.includes('home loan') || lowerMsg.includes('loan')) {
    return `Here are smart loan repayment strategies:

1. 💰 Make part-prepayments whenever you have surplus funds — even small amounts reduce total interest significantly
2. 📉 Consider balance transfer to a lower interest rate lender
3. ⏳ Shorter tenure = higher EMI but much less total interest
4. 📊 Keep total EMIs below 40% of your monthly income
5. 🏦 Negotiate with your lender for a rate reduction after 1-2 years of regular payments

For a ₹50L home loan at 8.5% over 20 years, a 5% annual prepayment could save over ₹12 lakhs in interest!`;
  }

  if (lowerMsg.includes('budget') || lowerMsg.includes('50/30/20') || lowerMsg.includes('saving')) {
    return `The 50/30/20 budgeting rule is a simple framework:

📌 50% — Needs (rent, groceries, EMIs, insurance, utilities)
📌 30% — Wants (dining out, entertainment, shopping, subscriptions)
📌 20% — Savings & Debt Repayment (investments, emergency fund, extra EMI payments)

For loan repayment, the 20% savings portion should prioritize:
1. Emergency fund (3-6 months of expenses)
2. High-interest debt repayment
3. Investment for long-term goals

💡 Pro tip: If you have high-interest loans, consider temporarily following a 50/20/30 rule — redirecting 'wants' budget toward faster debt elimination.`;
  }

  return `Thank you for your question! Here's some general financial guidance:

🎯 Key Financial Principles:
• Always maintain an emergency fund covering 6-12 months of expenses
• Keep your debt-to-income ratio below 40%
• Invest at least 20% of your income for long-term wealth building
• Review and optimize your insurance coverage annually
• Track your credit score regularly and dispute any errors

For more specific advice, try asking about:
• Credit score improvement
• EMI optimization strategies
• Loan eligibility requirements
• Budgeting and savings techniques

💡 Enter your Claude API key for personalized AI-powered advice tailored to your specific financial situation!`;
}

// ============================================
//  CLAUDE AI API INTEGRATION
// ============================================
async function callClaudeAPI(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CONFIG.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// ============================================
//  GOOGLE SHEETS INTEGRATION
// ============================================
async function saveToGoogleSheets(data) {
  if (!CONFIG.GOOGLE_SCRIPT_URL) {
    console.log('[LoanLess AI] Google Sheets URL not configured. Data:', data);
    return;
  }

  try {
    const payload = {
      ...data,
      timestamp: new Date().toISOString()
    };

    await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('[LoanLess AI] Data saved to Google Sheets:', payload);
  } catch (error) {
    console.warn('[LoanLess AI] Failed to save to Google Sheets:', error);
  }
}

// ============================================
//  UTILITY FUNCTIONS
// ============================================

/** Format number with Indian number system commas */
function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  const numStr = Math.abs(num).toString();
  const parts = numStr.split('.');
  let intPart = parts[0];
  const decPart = parts.length > 1 ? '.' + parts[1] : '';

  // Indian formatting: last 3 digits, then groups of 2
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);
    const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    intPart = formatted + ',' + last3;
  }

  return (num < 0 ? '-' : '') + intPart + decPart;
}

/** Escape HTML to prevent XSS */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Show toast notification */
function showToast(message, type = 'success') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    ${message}
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
