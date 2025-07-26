#!/bin/bash

set -eu

for dir in char door effect obj map; do
  mkdir -p prj/assets/image/$dir
  for file in ORIGINAL_ASSETS/$dir/*.gif; do
    if [ -f "$file" ]; then
      convert "$file" -transparent "#007575" "prj/assets/image/$dir/$(basename "$file" .gif).png"
    fi
  done
done