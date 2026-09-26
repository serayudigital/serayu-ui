/*
 * Generate Serayu UI icons from SVG.
 * Output: public/favicon.ico, public/apple-touch-icon.png,
 *         public/icons/icon-{192,384,512}.png,
 *         public/icons/icon-maskable-512.png
 *
 * No gradient. Solid #0064f0 (Serayu Digital brand) + white monogram "S"
 * in the center. The maskable icon keeps a 25% safe zone around the edge.
 */

import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = resolve(__dirname, "..", "public");
const ICONS_DIR = resolve(PUBLIC_DIR, "icons");
mkdirSync(ICONS_DIR, { recursive: true });

// Monogram "S" in a rounded square with solid brand color (no gradient).
function buildSvg({
  size = 512,
  rounded = true,
  fontSize = 320,
  fontWeight = 800,
  foreground = "#ffffff",
  background = "#0064f0",
  safeZone = false,
} = {}) {
  // Maskable: 25% safe zone (central circle stays safe).
  // For maskable we only render the icon inside the central 50% area;
  // the solid background fills the entire canvas.
  const inner = safeZone ? size * 0.5 : size;
  const offset = safeZone ? (size - inner) / 2 : 0;
  const rx = safeZone ? size * 0.05 : size * 0.22;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="${background}"/>
  <text
    x="${size / 2}"
    y="${size / 2}"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="${fontWeight}"
    fill="${foreground}"
    text-anchor="middle"
    dominant-baseline="central"
    letter-spacing="-0.05em"
    transform="translate(${offset - offset}, ${offset - offset})"
  >S</text>
</svg>`.trim();
}

async function writeSvg(svg, outPath) {
  writeFileSync(outPath, svg, "utf8");
  console.log("wrote", outPath);
}

async function writePng(svg, size, outPath, safeZone = false) {
  const buffer = Buffer.from(svg);
  await sharp(buffer, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log("wrote", outPath);
}

const tasks = [
  // Favicon SVG (solid, no gradient).
  {
    svg: buildSvg({ size: 64, fontSize: 42 }),
    out: resolve(PUBLIC_DIR, "favicon.ico"),
  },
  // Apple touch icon (180x180).
  {
    svg: buildSvg({ size: 180, fontSize: 120 }),
    out: resolve(PUBLIC_DIR, "apple-touch-icon.png"),
    size: 180,
    png: true,
  },
  // Manifest icons.
  {
    svg: buildSvg({ size: 192, fontSize: 128 }),
    out: resolve(ICONS_DIR, "icon-192.png"),
    size: 192,
    png: true,
  },
  {
    svg: buildSvg({ size: 384, fontSize: 256 }),
    out: resolve(ICONS_DIR, "icon-384.png"),
    size: 384,
    png: true,
  },
  {
    svg: buildSvg({ size: 512, fontSize: 340 }),
    out: resolve(ICONS_DIR, "icon-512.png"),
    size: 512,
    png: true,
  },
  // Maskable icon: 25% safe zone on every side.
  {
    svg: buildSvg({ size: 512, fontSize: 200, safeZone: true }),
    out: resolve(ICONS_DIR, "icon-maskable-512.png"),
    size: 512,
    png: true,
    safeZone: true,
  },
];

for (const t of tasks) {
  if (t.png) {
    await writePng(t, t.size, t.out, t.safeZone);
  } else {
    await writeSvg(t.ico, t.out);
  }
}

console.log("Done generating Serayu UI icons.");
