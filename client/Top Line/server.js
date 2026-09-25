import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

console.log(`Server starting...`);
console.log(`Current directory: ${__dirname}`);
console.log(`Looking for static files in: ${distPath}`);

if (fs.existsSync(distPath)) {
  console.log(`✅ Dist folder found!`);
} else {
  console.log(`❌ Dist folder NOT found at ${distPath}. Check your build output!`);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server successfully started on 0.0.0.0:${PORT}`);
});
