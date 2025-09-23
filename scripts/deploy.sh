set -euo pipefail

echo "[deploy] docker compose build & up..."
docker compose down || true
docker compose up -d --build

echo "[deploy] containers:"
docker compose ps

echo "[deploy] done."
