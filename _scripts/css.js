const fs = require('fs');
const CleanCSS = require('clean-css');

const cssFilePath = './src/css/consent.css';

// Read CSS file
fs.readFile(cssFilePath, 'utf8', (cssErr, cssContent) => {
  if (cssErr) {
    console.error('Error reading CSS file:', cssErr);
    return;
  }

  const result = new CleanCSS({}).minify(cssContent);
  
  let css = result.styles.replace(/[']/g, '\\\'');
  css = css.replace(/\s+/g, ' ');
  const cssScript = `window.__wmConsentCss='${css}';`;

  // Save the CSS script to a file
  const cssOutputPath = './src/js/css.js';
  fs.writeFileSync(cssOutputPath, cssScript, 'utf8');

  console.log(`CSS content saved to ${cssOutputPath}`);
});
