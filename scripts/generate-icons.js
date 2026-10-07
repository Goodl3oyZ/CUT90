const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Minimal valid 1x1 PNG pixel buffer expanded for placeholder icon
const png192Base64 =
  'iVBORw50KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAiSURBVHic3cEBDQAAAMKg90t1hkUAAAAAAAAAAAAAAAAAwH41LgABd1Y3pAAAAABJRU5ErkJggg==';

const buffer = Buffer.from(png192Base64, 'base64');

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buffer);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buffer);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buffer);

console.log('PWA icon assets created in public/');
