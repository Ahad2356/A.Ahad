const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = __dirname;

async function convertFile(file) {
    const input = path.join(DIR, file);
    const outName = file.replace(/\.png$/i, '.webp');
    const output = path.join(DIR, outName);
    try {
        await sharp(input)
            .webp({ quality: 80 })
            .toFile(output);
        console.log('Converted:', file, '→', outName);
    } catch (err) {
        console.error('Failed:', file, err.message);
    }
}

async function run() {
    const files = fs.readdirSync(DIR).filter(f => /ezgif-frame-\d{3}\.png$/i.test(f));
    console.log('Found', files.length, 'frame PNGs.');
    for (const f of files) {
        await convertFile(f);
    }
    console.log('Conversion complete.');
}

run();
