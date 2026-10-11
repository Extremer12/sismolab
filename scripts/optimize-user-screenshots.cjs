const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeScreenshots() {
  const list = [
    'screenshot-1-inicio.png',
    'screenshot-2-misiones.png',
    'screenshot-3-historia.png',
    'screenshot-4-prevencion.png'
  ];

  console.log('Optimizando capturas para cumplir con Google Play Store (mínimo 320px, estándar 1080px)...');

  for (const name of list) {
    const inputPath = path.join(__dirname, '../playstore-assets/originales_usuario', name);
    const outputPath = path.join(__dirname, '../playstore-assets', name);

    // Get current dimensions
    const meta = await sharp(inputPath).metadata();
    console.log(`Procesando ${name} (original: ${meta.width}x${meta.height})...`);

    // Scale to standard mobile width 1080px with Lanczos3 high quality filter
    await sharp(inputPath)
      .resize({
        width: 1080,
        kernel: sharp.kernel.lanczos3,
        fit: 'inside'
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);

    const newMeta = await sharp(outputPath).metadata();
    console.log(`-> ${name} optimizada a: ${newMeta.width}x${newMeta.height} px (Válida para Play Store)`);
  }
}

optimizeScreenshots().catch(console.error);
