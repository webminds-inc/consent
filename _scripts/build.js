const fs = require('fs');
const { minify } = require("terser");

const files = [
    "./src/js/css.js",
    "./src/js/html.js",
    "./src/js/consent.js",
];

function convertToBase(number) {
    if (isNaN(number) || number < 0 || !Number.isInteger(number)) {
        return "Invalid input";
    }

    const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    do {
        result = characters[number % characters.length] + result;
        number = Math.floor(number / characters.length);
    } while (number > 0);

    return result;
}

async function compress() {
    //' + convertToBase((new Date()).getTime()) + '
    let filename = './dist/consent.min.js';
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