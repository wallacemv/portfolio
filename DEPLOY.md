# Deploy (via git)

Site estático — sem backend/DB/secrets. O servidor puxa do GitHub (deploy key read-only), builda e instala.

## Fluxo

```bash
# local: commit + push (branch master)
git add -A && git commit -m "..." && git push origin master

# servidor (VPS 104.251.211.44, root)
cd /opt/portfolio && ./deploy/deploy.sh        # deploy do origin/master
REF=v1.2.0 ./deploy/deploy.sh
```

## O que o `deploy.sh` faz (roda no servidor)

1. `git fetch && git reset --hard <ref>`
2. `docker build -t portfolio:latest .`
3. `kubectl apply -f deploy/k8s/`
4. Importa a imagem no containerd + rollout

## Segredos

Nenhum (site estático). Acesso público em `https://codedbywallace.dev/portfolio`.
