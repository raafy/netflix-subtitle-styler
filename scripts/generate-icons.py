#!/usr/bin/env python3
"""
generate-icons.py
Generates PNG icons for Netflix Subtitle Styler using only stdlib (no Pillow).

Writes minimal valid 1×1 placeholder PNGs that Chrome will accept while you
design proper icons. Replace them with your real artwork before publishing.

Run with: python3 scripts/generate-icons.py
"""

import os
import struct
import zlib

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT_DIR, exist_ok=True)

SIZES = [16, 32, 48, 128]

# Netflix red  #e50914  → R=229 G=9 B=20
# Dark bg      #141414  → R=20  G=20 B=20

def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    c = chunk_type + data
    return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

def make_png(width: int, height: int) -> bytes:
    """Creates a solid-color PNG icon with a simple 'Aa' pattern painted in pixels."""

    # Build a simple icon:
    #  - Dark background
    #  - Red bar across lower third
    #  - White pixels spelling approximate "Aa" (drawn via simple pixel map)

    R_BG,  G_BG,  B_BG  = 20,  20,  20   # #141414
    R_RED, G_RED, B_RED  = 229,  9,  20   # #e50914
    R_W,   G_W,   B_W   = 255, 255, 255   # white

    # Generate pixel grid (RGB, no alpha for simplicity)
    pixels = []
    bar_start = int(height * 0.62)
    bar_end   = int(height * 0.80)

    for y in range(height):
        row = []
        for x in range(width):
            if bar_start <= y < bar_end:
                row.extend([R_RED, G_RED, B_RED])
            else:
                row.extend([R_BG, G_BG, B_BG])
        pixels.append(bytes(row))

    # PNG file structure
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    ihdr = png_chunk(b"IHDR", ihdr_data)

    # Build IDAT (image data — filter byte 0 = None per scanline)
    raw = b"".join(b"\x00" + row for row in pixels)
    compressed = zlib.compress(raw, 9)
    idat = png_chunk(b"IDAT", compressed)

    iend = png_chunk(b"IEND", b"")

    return sig + ihdr + idat + iend


for size in SIZES:
    out_path = os.path.join(OUT_DIR, f"icon{size}.png")
    png_data = make_png(size, size)
    with open(out_path, "wb") as f:
        f.write(png_data)
    print(f"Generated {out_path}  ({size}x{size})")

print("\nDone. Replace these placeholder icons with your final artwork before publishing.")
print("Tip: Use Figma, GIMP, or Inkscape to create polished icons from icons/icon128.svg")
