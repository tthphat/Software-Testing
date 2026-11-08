#!/usr/bin/env python3
"""Stamp a student-identity banner onto REAL screenshots (does not create screenshots).

Usage:
  python overlay_username.py shot.png --email EMAIL --id MSSV --name "Full Name" [--platform "Firefox 130 / Windows 11"] [--out shot_wm.png]
  python overlay_username.py shots_dir/ --email EMAIL --id MSSV --name "Full Name" [--recursive] [--in-place] [--out stamped_dir/]

Auto-detects platform from filename if --platform is omitted:
  *-chrome.*  -> "Chrome 130 / Windows 11"
  *-firefox.* -> "Firefox 130 / Windows 11"
  *-safari.*  -> "Safari 18 / macOS (BrowserStack)"
  *-expo.*    -> "Expo Go SDK 52 / Android"

The banner is added as an extra strip below the image so it never hides UI content.
"""
import argparse
import datetime
import os
import sys

from PIL import Image, ImageDraw, ImageFont

FONTS = [
    "DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "arial.ttf", "C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/segoeui.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
]
EXTS = (".png", ".jpg", ".jpeg", ".webp")

PLATFORM_PATTERNS = [
    ("-chrome", "Chrome 130 / Windows 11"),
    ("-firefox", "Firefox 130 / Windows 11"),
    ("-safari", "Safari 18 / macOS (BrowserStack)"),
    ("-expo", "Expo Go SDK 52 / Android"),
]


def detect_platform(filename, explicit_platform=""):
    if explicit_platform:
        return explicit_platform
    lower = filename.lower()
    for pattern, name in PLATFORM_PATTERNS:
        if pattern in lower:
            return name
    return "Desktop / Windows 11"


def load_font(size):
    for f in FONTS:
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            continue
    sys.exit("No Unicode font found (Vietnamese needs one). Install DejaVu Sans, Segoe UI, or Arial.")


def stamp(src, dst, text):
    img = Image.open(src).convert("RGB")
    w, h = img.size
    size = max(14, w // 60)
    font = load_font(size)
    pad = size // 2
    strip_h = size + pad * 2
    out = Image.new("RGB", (w, h + strip_h), (20, 20, 20))
    out.paste(img, (0, 0))
    ImageDraw.Draw(out).text((pad, h + pad), text, font=font, fill=(255, 255, 255))
    out.save(dst)


def format_text(email, sid, name, platform):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    parts = [email, f"{sid} - {name}"]
    if platform:
        parts.append(platform)
    parts.append(now)
    return " | ".join(parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path", help="Path to file or directory of screenshots")
    ap.add_argument("--email", required=True, help="Student email")
    ap.add_argument("--id", required=True, dest="sid", help="Student MSSV")
    ap.add_argument("--name", required=True, help="Student full name")
    ap.add_argument("--platform", default="", help="Explicit platform name (or auto-detected from filename)")
    ap.add_argument("--out", default="", help="Output directory or output file path")
    ap.add_argument("--recursive", "-r", action="store_true", help="Recursively process subdirectories")
    ap.add_argument("--in-place", action="store_true", help="Overwrite original files directly with stamped version")
    a = ap.parse_args()

    if os.path.isdir(a.path):
        count = 0
        if a.recursive:
            for root, dirs, files in os.walk(a.path):
                for fn in sorted(files):
                    if fn.lower().endswith(EXTS):
                        src = os.path.join(root, fn)
                        platform = detect_platform(fn, a.platform)
                        text = format_text(a.email, a.sid, a.name, platform)
                        if a.in_place:
                            dst = src
                        elif a.out:
                            rel = os.path.relpath(src, a.path)
                            dst = os.path.join(a.out, rel)
                            os.makedirs(os.path.dirname(dst), exist_ok=True)
                        else:
                            base, ext = os.path.splitext(src)
                            dst = f"{base}_wm{ext}"
                        stamp(src, dst, text)
                        count += 1
                        print(f"Stamped [{platform}] -> {dst}")
            print(f"Total recursively stamped: {count} images.")
        else:
            outdir = a.out or os.path.join(a.path, "stamped")
            os.makedirs(outdir, exist_ok=True)
            for fn in sorted(os.listdir(a.path)):
                if fn.lower().endswith(EXTS):
                    src = os.path.join(a.path, fn)
                    platform = detect_platform(fn, a.platform)
                    text = format_text(a.email, a.sid, a.name, platform)
                    dst = src if a.in_place else os.path.join(outdir, fn)
                    stamp(src, dst, text)
                    count += 1
                    print(f"Stamped [{platform}] -> {dst}")
            print(f"Total stamped {count} images into {outdir if not a.in_place else a.path}")
    else:
        platform = detect_platform(a.path, a.platform)
        text = format_text(a.email, a.sid, a.name, platform)
        if a.in_place:
            dst = a.path
        elif a.out:
            dst = a.out
        else:
            base, ext = os.path.splitext(a.path)
            dst = f"{base}_wm{ext}"
        stamp(a.path, dst, text)
        print(f"Wrote [{platform}] -> {dst}")


if __name__ == "__main__":
    main()
