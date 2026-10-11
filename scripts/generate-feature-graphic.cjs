const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createFeatureGraphic() {
  console.log('Generating Google Play Feature Graphic (1024x500)...');

  const width = 1024;
  const height = 500;

  // 1. Process background from hero_missions.png
  // Resize to cover 1024x500 with slight crop and dark navy overlay
  const bgBuffer = await sharp('public/images/Banners/hero_missions.png')
    .resize(width, height, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.75, saturation: 1.1 })
    .toBuffer();

  // 2. Prepare avatar image on the right (avatar_1.png or avatar_10.png)
  const avatarBuffer = await sharp('public/images/avatar/avatar_1.png')
    .resize(420, 420, { fit: 'contain' })
    .toBuffer();

  // 3. Prepare App Icon 512x512 scaled down
  const iconBuffer = await sharp('public/pwa-512x512.png')
    .resize(110, 110, { fit: 'contain' })
    .toBuffer();

  // 4. Create an SVG overlay with modern typography, dark gradient vignette, and badges
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Horizontal vignette gradient to make text readable on the left -->
        <linearGradient id="vignette" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#061426" stop-opacity="0.95" />
          <stop offset="45%" stop-color="#061426" stop-opacity="0.80" />
          <stop offset="75%" stop-color="#061426" stop-opacity="0.40" />
          <stop offset="100%" stop-color="#061426" stop-opacity="0.70" />
        </linearGradient>

        <linearGradient id="cyanYellow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#facc15" />
        </linearGradient>

        <linearGradient id="badgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(56, 189, 248, 0.25)" />
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.05)" />
        </linearGradient>

        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.7"/>
        </filter>
      </defs>

      <!-- Vignette Overlay -->
      <rect width="${width}" height="${height}" fill="url(#vignette)" />

      <!-- Top Border Accent line -->
      <rect x="0" y="0" width="${width}" height="4" fill="url(#cyanYellow)" />

      <!-- Left Content Group -->
      <g transform="translate(60, 0)">
        
        <!-- Category Pill Badge -->
        <rect x="130" y="72" width="230" height="28" rx="14" fill="url(#badgeGlow)" stroke="#38bdf8" stroke-width="1.2" />
        <circle cx="146" cy="86" r="4" fill="#38bdf8" />
        <text x="160" y="90" font-family="-apple-system, Roboto, sans-serif" font-size="11" font-weight="800" fill="#38bdf8" letter-spacing="1.5">PREVENCIÓN SÍSMICA</text>

        <!-- Main Title -->
        <text x="130" y="148" font-family="-apple-system, Roboto, 'Segoe UI', sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="-1">SISMO LAB</text>
        
        <!-- Subtitle -->
        <text x="60" y="210" font-family="-apple-system, Roboto, 'Segoe UI', sans-serif" font-size="18" font-weight="800" fill="#38bdf8" letter-spacing="0.5">APRENDÉ · JUGÁ · PREPARATE</text>

        <!-- Description line -->
        <text x="60" y="242" font-family="-apple-system, Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">Plataforma Educativa y Gamificada de Prevención Sísmica</text>
        <text x="60" y="266" font-family="-apple-system, Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">Simulaciones Interactivas · Kit 72h · Ciencia Ciudadana</text>

        <!-- Feature Pills Row -->
        <g transform="translate(60, 310)">
          <!-- Pill 1: 100% Offline -->
          <rect x="0" y="0" width="130" height="34" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <text x="16" y="22" font-family="-apple-system, Roboto, sans-serif" font-size="12" font-weight="700" fill="#ffffff">📶 100% Offline</text>

          <!-- Pill 2: 6 Misiones -->
          <rect x="142" y="0" width="125" height="34" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <text x="156" y="22" font-family="-apple-system, Roboto, sans-serif" font-size="12" font-weight="700" fill="#ffffff">🎮 6 Misiones</text>

          <!-- Pill 3: Niños y Adultos -->
          <rect x="279" y="0" width="145" height="34" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <text x="293" y="22" font-family="-apple-system, Roboto, sans-serif" font-size="12" font-weight="700" fill="#ffffff">👨‍👩‍👧 Todas las Edades</text>
        </g>

        <!-- Institution Credit -->
        <text x="60" y="420" font-family="-apple-system, Roboto, sans-serif" font-size="11" font-weight="600" fill="#64748b" letter-spacing="0.5">DESARROLLADO POR ZION CODE · ESCUELA POLICÍA FEDERAL ARGENTINA</text>
      </g>
    </svg>
  `);

  // 5. Composite everything together
  const outputPath = path.join(__dirname, '../playstore-assets/feature-graphic-1024x500.png');

  await sharp(bgBuffer)
    .composite([
      // Avatar on the right
      {
        input: avatarBuffer,
        top: 60,
        left: 620
      },
      // App icon next to title
      {
        input: iconBuffer,
        top: 60,
        left: 60
      },
      // SVG text & vignette overlay
      {
        input: svgOverlay,
        top: 0,
        left: 0
      }
    ])
    .removeAlpha() // Google Play requires NO alpha channel in Feature Graphic
    .toFile(outputPath);

  console.log('Feature graphic created successfully at:', outputPath);
}

createFeatureGraphic().catch(console.error);
