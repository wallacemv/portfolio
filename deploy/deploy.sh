#!/usr/bin/env bash
#
# Deploy do Portfolio via git — roda NO SERVIDOR, dentro de /opt/portfolio.
#
# O código vem do GitHub (deploy key SSH read-only) — sem rsync. Fluxo:
#   1) git fetch + reset --hard <ref>
#   2) docker build (imagem portfolio:latest)
#   3) kubectl apply (deploy/k8s/portfolio.yaml)
#   4) importa a imagem no containerd (ctr -n k8s.io) + rollout
#
# Uso (no servidor):
#   ./deploy/deploy.sh                 # deploy do origin/main
#   REF=v1.2.0 ./deploy/deploy.sh      # deploy de uma tag/commit
#
set -euo pipefail

REF="${REF:-origin/master}"
MAIN_DOMAIN="${MAIN_DOMAIN:-codedbywallace.dev}"

cd "$(dirname "$0")/.."

echo "==> 1/4 Atualizando código via git (${REF})"
git fetch origin
git reset --hard "${REF}"

echo "==> 2/4 Build da imagem (docker build)"
docker build -t portfolio:latest .

echo "==> 3/4 Kubernetes: aplica manifests (deploy/k8s/)"
kubectl apply -f deploy/k8s/

echo "==> 4/4 Kubernetes: importa imagem no containerd (k8s.io) + rollout"
docker save portfolio:latest -o /tmp/portfolio-img.tar
ctr -n k8s.io images import --all-platforms /tmp/portfolio-img.tar || echo "   aviso: falha ao importar imagem"
rm -f /tmp/portfolio-img.tar
kubectl rollout restart deploy/portfolio
kubectl rollout status deploy/portfolio --timeout=180s

echo
echo "Deploy OK: https://${MAIN_DOMAIN}/portfolio"