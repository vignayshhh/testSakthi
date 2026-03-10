const fs = require('fs');
const path = require('path');

// Create simple square icons by copying existing ones
// Since we can't use image processing, we'll create placeholder files

const iconDir = path.join(__dirname, 'assets', 'images');
const icons = [
  'icon.png',
  'adaptive-icon.png'
];

console.log('Creating square icon files...');

// For now, we'll just log that this needs to be done manually
console.log('Please manually ensure these icons are square (512x512):');
icons.forEach(icon => {
  const iconPath = path.join(iconDir, icon);
  if (fs.existsSync(iconPath)) {
    console.log(`✅ ${icon} exists - ensure it\'s 512x512 pixels`);
  } else {
    console.log(`❌ ${icon} missing`);
  }
});

console.log('\nTo fix icon dimensions:');
console.log('1. Open icon.png in an image editor');
console.log('2. Crop/resize to exactly 512x512 pixels');
console.log('3. Do the same for adaptive-icon.png');
console.log('4. Save and overwrite the existing files');
