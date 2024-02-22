const fs = require('fs');

const htmlFilePath = './src/html/consent.html';

// Read HTML file
fs.readFile(htmlFilePath, 'utf8', (htmlErr, htmlContent) => {
  if (htmlErr) {
    console.error('Error reading HTML file:', htmlErr);
    return;
  }

  let html = htmlContent.
    replace(/\r|\n/g, '').
    replace(/>\s+</g, '><').
    replace(/[']/g, '\\\'').
    replace(/\s+/g, ' ');

  const htmlScript = `window.__wmConsentHTML='${html}';`;
  
  const htmlOutputPath = './src/js/html.js';
  fs.writeFileSync(htmlOutputPath, htmlScript, 'utf8');

  console.log(`HTML content saved to ${htmlOutputPath}`);
});