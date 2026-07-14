#!/usr/bin/env node
// Regenerates the static per-invoice PDFs in ../pdfs/.
// Mirrors the invoice generation logic in invoices.html (61 invoices, -30..+30
// days from the day this script is run) so each invoice gets its own PDF with
// distinct, correctly-labeled content instead of everyone sharing one file.
//
// Usage: node scripts/generate-invoice-pdfs.js
// Requires: npm install jspdf (in this scripts/ directory, or anywhere on the require path)

const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

const OUT_DIR = path.join(__dirname, '..', 'pdfs');

function formatDate(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildInvoicePdf(invId, invDate, invDue, invAmount) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('INVOICE', 20, 20);

  doc.setFontSize(11);
  doc.text('Tech Solutions Ltd.', 20, 35);
  doc.text('123 Innovation Drive', 20, 41);
  doc.text('Tel Aviv, Israel', 20, 47);
  doc.text('Contact: Alex Rivera', 20, 53);
  doc.text('Email: info@techsolutions.com', 20, 59);

  doc.text('BILL TO:', 120, 35);
  doc.text('Future Corp', 120, 41);
  doc.text('456 Business Ave', 120, 47);
  doc.text('Jerusalem, Israel', 120, 53);
  doc.text('Email: contact@futurecorp.com', 120, 59);

  doc.text('Invoice No: ' + invId, 20, 75);
  doc.text('Invoice Date: ' + invDate, 20, 82);
  doc.text('Due Date: ' + invDue, 20, 89);

  doc.text('Description', 20, 105);
  doc.text('Amount', 160, 105);
  doc.line(20, 108, 190, 108);
  doc.text('Dynamic Agent Services', 20, 115);
  doc.text('$' + invAmount, 160, 115);

  doc.text('Payment Instructions:', 20, 135);
  doc.text('Bank: Bank Leumi', 20, 141);
  doc.text('IBAN: IL620108000000012345678', 20, 147);

  doc.setFontSize(10);
  doc.text('Thank you for your business!', 105, 170, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const today = new Date();
let written = 0;

for (let i = -30; i <= 30; i++) {
  const invDate = new Date(today);
  invDate.setDate(today.getDate() + i);

  const dueDate = new Date(invDate);
  dueDate.setDate(invDate.getDate() + 14);

  const invId = 'INV-' + String(i + 31).padStart(4, '0');
  const amount = (100 + Math.abs(i) * 15.5).toFixed(2);

  const pdfBytes = buildInvoicePdf(invId, formatDate(invDate), formatDate(dueDate), amount);
  fs.writeFileSync(path.join(OUT_DIR, `Invoice-${invId}.pdf`), pdfBytes);
  written++;
}

console.log(`Wrote ${written} invoice PDFs to ${OUT_DIR}`);
