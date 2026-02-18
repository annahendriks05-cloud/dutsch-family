const fs = require('fs');
const path = require('path');

// Read the index.html file
const html = fs.readFileSync('./index.html', 'utf8');

// Create images/logo directory if it doesn't exist
const logoDir = './images/logo';
if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir, { recursive: true });
}

// Extract base64 images using regex
const imgRegex = /<img[^>]+src="data:image\/(png|jpeg|jpg);base64,([^"]+)"[^>]*alt="([^"]+)"[^>]*>/gi;
let match;
let count = 0;

while ((match = imgRegex.exec(html)) !== null) {
    const extension = match[1];
    const base64Data = match[2];
    const altText = match[3].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Create filename based on alt text
    let filename;
    if (altText.includes('dutch') || altText.includes('family')) {
        filename = count === 0 ? 'dutch-family-logo.png' : 'dutch-family-logo-footer.png';
    } else if (altText.includes('shell')) {
        filename = count === 1 ? 'shell-logo.png' : 'shell-logo-footer.png';
    } else {
        filename = `logo-${count + 1}.${extension}`;
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const filepath = path.join(logoDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`Saved: ${filename}`);
    count++;
}

console.log(`\nExtracted ${count} logos to ${logoDir}`);
