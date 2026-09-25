import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Robust path detection for monorepo structure
const possiblePaths = [
  path.join(__dirname, 'dist'),                          // Standard: server.js and dist are in same folder
  path.join(process.cwd(), 'dist'),                       // Root-relative: executed from frontend folder
  path.join(process.cwd(), 'client', 'Top Line', 'dist'), // Repo-root relative
  path.join(process.cwd(), 'Top Line', 'dist'),          // Subfolder relative
];

let distPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(path.join(p, 'index.html'))) {
    distPath = p;
    break;
  }
}

if (!distPath) {
  console.error(`[CRITICAL] Could not find dist/index.html in any checked paths:`);
  possiblePaths.forEach(p => console.error(` - ${p}`));
} else {
  console.log(`[BOOT] Serving static assets from: ${distPath}`);
}

console.log(`[BOOT] Target PORT: ${PORT}`);

app.use(express.static(distPath || ''));

app.get('*', (req, res) => {
  if (!distPath) return res.status(500).send('Server configuration error: dist folder not found.');
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
