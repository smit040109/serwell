#!/bin/bash
# Usage: ./scripts/compress-video.sh path/to/video.mp4 [crf]
# Compresses in-place (keeps a .backup copy), optimized for web autoplay.

set -e

INPUT="$1"
CRF="${2:-26}"

if [ -z "$INPUT" ]; then
  echo "Usage: $0 <video-path> [crf]"
  echo "Example: $0 public/videos/new-video.mp4"
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "File not found: $INPUT"
  exit 1
fi

DIR=$(dirname "$INPUT")
BASE=$(basename "$INPUT" .mp4)
BACKUP="$DIR/${BASE}-original-backup.mp4"
TEMP="$DIR/${BASE}-compressed-tmp.mp4"

echo "Compressing: $INPUT (CRF $CRF)"
cp "$INPUT" "$BACKUP"

ffmpeg -y -i "$INPUT" \
  -vcodec libx264 -crf "$CRF" -preset slow \
  -vf "scale='min(1920,iw)':-2" \
  -movflags +faststart \
  -c:a aac -b:a 96k \
  "$TEMP"

ORIGINAL_SIZE=$(du -h "$INPUT" | cut -f1)
NEW_SIZE=$(du -h "$TEMP" | cut -f1)

mv "$TEMP" "$INPUT"

echo "Done: $ORIGINAL_SIZE -> $NEW_SIZE"
echo "Backup saved at: $BACKUP"
