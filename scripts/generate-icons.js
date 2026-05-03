/**
 * @file generate-icons.js
 * @description Generates PNG icons for the extension using the `canvas` package.
 *
 * Run with: node scripts/generate-icons.js
 * Requires: npm install canvas
 */

const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "icons");
fs.mkdirSync(OUT_DIR, { recursive: true });

const SIZES = [16, 32, 48, 128];

for (const size of SIZES) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#141414";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.18);
  ctx.fill();

  // Red subtitle bar
  ctx.fillStyle = "#e50914";
  const barH = size * 0.18;
  const barY = size * 0.58;
  ctx.beginPath();
  ctx.roundRect(size * 0.12, barY, size * 0.76, barH, barH * 0.5);
  ctx.fill();

  // Smaller bar below
  ctx.fillStyle = "rgba(229,9,20,0.5)";
  const bar2H = size * 0.1;
  ctx.beginPath();
  ctx.roundRect(size * 0.12, barY + barH + size * 0.04, size * 0.52, bar2H, bar2H * 0.5);
  ctx.fill();

  // "Aa" text above
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(size * 0.34)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Aa", size / 2, size * 0.38);

  const buffer = canvas.toBuffer("image/png");
  const outPath = path.join(OUT_DIR, `icon${size}.png`);
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated ${outPath}`);
}

console.log("Done! Icons written to /icons/");
