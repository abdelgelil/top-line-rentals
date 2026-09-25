import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Detect dist folder location dynamically
let distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  distPath = path.join(process.cwd(), 'Top Line', 'dist');
}

console.log(`[BOOT] Serving static assets from: ${distPath}`);
console.log(`[BOOT] Target PORT: ${PORT}`);

app.use(express.static(distPath));

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build output dist/index.html not found.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ONLINE] Server running on http://0.0.0.0:${PORT}`);
});
