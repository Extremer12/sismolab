const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateIcons() {
  const masterPath = path.join(__dirname, '../public/sismolablogo.png');
  
  if (!fs.existsSync(masterPath)) {
    console.error('No se encontró el master logo en public/sismolablogo.png');
    process.exit(1);
  }

  console.log('Generando conjunto completo de iconos desde public/sismolablogo.png (1254x1254)...');

  const targets = [
    { out: 'public/pwa-512x512.png', size: 512 },
    { out: 'public/pwa-192x192.png', size: 192 },
    { out: 'public/apple-touch-icon.png', size: 180 },
    { out: 'public/logo-120x120.png', size: 120 },
    { out: 'public/images/icono.png', size: 512 },
    { out: 'playstore-assets/icon-512x512.png', size: 512 }
  ];

  for (const t of targets) {
    const dest = path.join(__dirname, '..', t.out);
    await sharp(masterPath)
      .resize(t.size, t.size, { fit: 'cover' })
      .png({ quality: 100 })
      .toFile(dest);
    console.log(`✓ Creado ${t.out} (${t.size}x${t.size} px)`);
  }

  console.log('Todos los iconos se regeneraron exitosamente con el nuevo diseño.');
}

generateIcons().catch(console.error);
