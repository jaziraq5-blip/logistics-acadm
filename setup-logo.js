const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy the logo image
const sourcePath = path.join(__dirname, 'images', 'photo_2025-10-03_19-10-54.jpg');
const destPath = path.join(publicDir, 'logo.jpg');

try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('Logo copied successfully to public/logo.jpg');
} catch (error) {
  console.error('Error copying logo:', error.message);
}
