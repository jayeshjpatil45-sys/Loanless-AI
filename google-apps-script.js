/**
 * Google Apps Script — LoanLess AI Data Storage
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this code into the Code.gs file
 * 3. Click Deploy → New Deployment → Web App
 * 4. Set "Execute as" = Me, "Who has access" = Anyone
 * 5. Copy the Web App URL and paste it into script.js CONFIG.GOOGLE_SCRIPT_URL
 * 6. Create a Google Sheet and copy its ID from the URL
 * 7. Replace SPREADSHEET_ID below with your Sheet ID
 */

// Replace with your Google Sheet ID
const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    let sheet;
    
    if (data.type === 'eligibility') {
      sheet = getOrCreateSheet(ss, 'Eligibility Records');
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name,
        data.salary,
        data.creditScore,
        data.existingEMI,
        data.age,
        data.employment,
        data.status,
        data.eligibleAmount,
        data.riskLevel
      ]);
    } else if (data.type === 'credit_analysis') {
      sheet = getOrCreateSheet(ss, 'Credit Analyses');
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.score,
        data.category,
        data.creditAge,
        data.creditUtil
      ]);
    } else if (data.type === 'emi_calculation') {
      sheet = getOrCreateSheet(ss, 'EMI Calculations');
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.loanAmount,
        data.interestRate,
        data.tenure,
        data.loanType,
        data.emi,
        data.totalInterest,
        data.totalPayment
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'active', service: 'LoanLess AI Data Storage' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    
    // Add headers based on sheet type
    if (name === 'Eligibility Records') {
      sheet.appendRow(['Timestamp', 'Name', 'Salary', 'Credit Score', 'Existing EMI', 'Age', 'Employment', 'Status', 'Eligible Amount', 'Risk Level']);
    } else if (name === 'Credit Analyses') {
      sheet.appendRow(['Timestamp', 'Score', 'Category', 'Credit Age', 'Credit Utilization']);
    } else if (name === 'EMI Calculations') {
      sheet.appendRow(['Timestamp', 'Loan Amount', 'Interest Rate', 'Tenure (Years)', 'Loan Type', 'EMI', 'Total Interest', 'Total Payment']);
    }
    
    // Format header row
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  }
  return sheet;
}
