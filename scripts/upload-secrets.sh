#!/usr/bin/env bash
set -euo pipefail

REPO="luisfuturist/termsite"
ENV_FILE=".env"

# Ensure authenticated
if ! gh auth status >/dev/null 2>&1; then
  echo "Not authenticated. Running gh auth login..."
  gh auth login
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

echo "Uploading secrets..."

while IFS= read -r line || [[ -n "$line" ]]; do
  # skip empty lines and comments
  [[ -z "$line" ]] && continue
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  
  # remove 'export ' prefix if present
  line="${line#export }"
  
  # skip lines without =
  [[ ! "$line" =~ = ]] && continue

  # split on first = only
  key="${line%%=*}"
  value="${line#*=}"

  # trim whitespace from key
  key="$(echo "$key" | xargs)"
  
  # skip if key is empty
  [[ -z "$key" ]] && continue

  # remove surrounding quotes from value (but keep internal quotes)
  if [[ "$value" =~ ^\"(.*)\"$ ]]; then
    value="${BASH_REMATCH[1]}"
  elif [[ "$value" =~ ^\'(.*)\'$ ]]; then
    value="${BASH_REMATCH[1]}"
  fi

  echo "Setting secret: $key"
  gh secret set "$key" \
    --repo "$REPO" \
    --body "$value"

done < "$ENV_FILE"

echo "Done."
