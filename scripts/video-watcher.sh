#!/bin/bash
# Watches public/videos/ for new .mp4 uploads and auto-compresses them.

WATCH_DIR="/var/www/serwell/public/videos"
SCRIPT="/var/www/serwell/scripts/compress-video.sh"
MARKER_SUFFIX="-original-backup.mp4"

echo "Watching $WATCH_DIR for new videos..."

inotifywait -m -e close_write -e moved_to --format '%f' "$WATCH_DIR" | while read FILENAME
do
  # Skip non-mp4, backups, and temp files
  case "$FILENAME" in
    *.mp4) ;;
    *) continue ;;
  esac
  case "$FILENAME" in
    *-original-backup.mp4|*-compressed-tmp.mp4) continue ;;
  esac

  FILEPATH="$WATCH_DIR/$FILENAME"
  BACKUP_PATH="$WATCH_DIR/$(basename "$FILENAME" .mp4)-original-backup.mp4"

  # Skip if already compressed (backup already exists)
  if [ -f "$BACKUP_PATH" ]; then
    continue
  fi

  echo "New video detected: $FILENAME — compressing..."
  sleep 2  # let the upload fully finish writing
  bash "$SCRIPT" "$FILEPATH"
  echo "Auto-compression done for $FILENAME"
done
