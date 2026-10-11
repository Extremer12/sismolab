const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sismolab-one.vercel.app/';
const OUTPUT_DIR = path.join(__dirname, '../playstore-assets');

async function capture() {
  console.log('Iniciando captura de pantallas móviles con Chrome...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Emulate Pixel 7 / modern smartphone (1080 x 2400 aspect ratio)
  await page.setViewport({
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625, // Produces ~1081 x 2401 px high-res screenshot
    isMobile: true,
    hasTouch: true
  });

  console.log('1. Navegando a Inicio...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'screenshot-1-inicio.png'),
    type: 'png'
  });
  console.log('-> Captura 1 guardada: screenshot-1-inicio.png');

  // Navigate to Kids / Missions
  console.log('2. Navegando a Misiones...');
  // Try finding and clicking "Modo Niños" or navigate direct
  try {
    const kidsBtn = await page.$('a[href*="kids"], button:has-text("Niños"), [data-screen="kids"]');
    if (kidsBtn) {
      await kidsBtn.click();
    } else {
      await page.goto(TARGET_URL + '#/kids', { waitUntil: 'networkidle2' });
    }
  } catch (e) {
    await page.goto(TARGET_URL + 'kids', { waitUntil: 'networkidle2' });
  }
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'screenshot-2-misiones.png'),
    type: 'png'
  });
  console.log('-> Captura 2 guardada: screenshot-2-misiones.png');

  // Navigate to Historia Sísmica
  console.log('3. Navegando a Historia Sísmica...');
  try {
    await page.goto(TARGET_URL + '#/historia', { waitUntil: 'networkidle2' });
  } catch (e) {
    await page.goto(TARGET_URL + 'historia', { waitUntil: 'networkidle2' });
  }
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'screenshot-3-historia.png'),
    type: 'png'
  });
  console.log('-> Captura 3 guardada: screenshot-3-historia.png');

  // Navigate to Adultos / Guía
  console.log('4. Navegando a Guía Adultos...');
  try {
    await page.goto(TARGET_URL + '#/adultos', { waitUntil: 'networkidle2' });
  } catch (e) {
    await page.goto(TARGET_URL + 'adultos', { waitUntil: 'networkidle2' });
  }
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'screenshot-4-prevencion.png'),
    type: 'png'
  });
  console.log('-> Captura 4 guardada: screenshot-4-prevencion.png');

  await browser.close();
  console.log('Todas las capturas se generaron con éxito en playstore-assets/');
}

capture().catch(err => {
  console.error('Error capturando pantallas:', err);
  process.exit(1);
});
