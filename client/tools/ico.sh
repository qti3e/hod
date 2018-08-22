#!/bin/bash
set -e

convert -define png:size=200x200 assets/logo.png -thumbnail '512x512>' \
  -background "#111c24" -gravity center -extent 512x512 assets/favicon.png

convert assets/favicon.png -bordercolor white -border 0 \
  \( -clone 0 -resize 16x16 \) \
  \( -clone 0 -resize 32x32 \) \
  \( -clone 0 -resize 48x48 \) \
  \( -clone 0 -resize 64x64 \) \
  \( -clone 0 -resize 128x128 \) \
  \( -clone 0 -resize 256x256 \) \
  \( -clone 0 -resize 512x512 \) \
  -delete 0 -alpha off -colors 256 assets/favicon.ico

cp -t dist \
  assets/favicon.ico \
  assets/favicon.png

echo "Generated assets/favicon.ico"
