const fs = require('fs');
const { minify } = require("terser");

const files = [
    "./src/js/css.js",
    "./src/js/html.js",
    "./src/js/consent.js",
];
const args = process.argv.slice(2) + '';

async function compress() {
    let filename = './dist/consent' + (args ? '.' + args : '') + '.min.js';
    let originalCode = "";
    files.forEach(js => {
        originalCode += fs.readFileSync(js, 'utf8') + ";\n\n";
    });

    const minifiedCode = await minify(originalCode, {
        output: {
            comments: false // Remove all comments
        }
    });
    fs.writeFileSync(filename, minifiedCode.code);
}

compress();
