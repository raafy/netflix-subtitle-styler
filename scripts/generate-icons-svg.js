/**
 * @file generate-icons-svg.js
 * @description Generates SVG-based PNG icons WITHOUT external dependencies.
 *              Uses only Node.js built-ins by writing SVG files that browsers
 *              and tools like Inkscape / rsvg-convert can rasterize.
 *
 * Alternatively, the SVG below can be opened in a browser and saved as PNG.
 *
 * Run with: node scripts/generate-icons-svg.js
 * (Writes .svg placeholders; convert manually or use the canvas script instead.)
 */

const fs   = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "icons");
fs.mkdirSync(OUT_DIR, { recursive: true });

const SIZES = [16, 32, 48, 128];

const svgTemplate = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="22" fill="#141414"/>
  <text x="64" y="58" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial, sans-serif" font-weight="bold" font-size="44" fill="#ffffff">Aa</text>
  <rect x="15" y="74" width="98" height="22" rx="11" fill="#e50914"/>
  <rect x="15" y="102" width="68" height="14" rx="7" fill="#e50914" opacity="0.5"/>
</svg>`;

for (const size of SIZES) {
  const svgPath = path.join(OUT_DIR, `icon${size}.svg`);
  fs.writeFileSync(svgPath, svgTemplate(size));
  console.log(`Written ${svgPath}`);
}

console.log(
  "\nTip: Convert SVGs to PNGs with:\n" +
  "  rsvg-convert -w 128 -h 128 icons/icon128.svg -o icons/icon128.png\n" +
  "Or open each .svg in a browser and save as PNG."
);
