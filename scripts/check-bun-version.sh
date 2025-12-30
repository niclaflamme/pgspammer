#!/usr/bin/env bash
set -euo pipefail

min_version="${1:-1.3.0}"

version_raw="$(bun --version)"
version="${version_raw%%-*}"

IFS=. read -r vmaj vmin vpatch <<< "$version"
IFS=. read -r rmaj rmin rpatch <<< "$min_version"

vmaj="${vmaj:-0}"
vmin="${vmin:-0}"
vpatch="${vpatch:-0}"
rmaj="${rmaj:-0}"
rmin="${rmin:-0}"
rpatch="${rpatch:-0}"

if (( vmaj < rmaj )) || \
  (( vmaj == rmaj && vmin < rmin )) || \
  (( vmaj == rmaj && vmin == rmin && vpatch < rpatch )); then
  echo "bun $version_raw is too old; require >= $min_version"
  exit 1
fi
