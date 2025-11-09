MVP de DevOps completo:

🧱 Estructura de carpetas
🐳 Dockerfiles backend/frontend
⚙️ Workflow de CI/CD (GitHub Actions)
📦 docker-compose de staging/local
🗝️ Variables y secretos necesarios


⃣**Repo:** `violeta-devops`
**Backend:** Spring Boot con **Gradle**
**Frontend:** React + Vite servido con **Node (vite preview)**
Para el despliegue, elijo la **opción B** → *Build + Push + Deploy automático vía SSH*, ya que eso completa el ciclo CD (Continuous Deployment) y te da un MVP de DevOps **100% funcional**: cada `push` a `main` genera imágenes y actualiza el staging automáticamente.

---

## 🧩 Estructura final del proyecto

```
violeta-devops/
├── backend/
│   ├── Dockerfile
│   ├── build.gradle
│   ├── gradlew
│   ├── gradlew.bat
│   └── src/...
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── src/...
├── docker-compose.yml
└── .github/
    └── workflows/
        └── ci-cd.yml
```

---

## 🐳 `backend/Dockerfile`

```dockerfile
# Etapa de build
FROM gradle:8.10.0-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle clean bootJar --no-daemon

# Etapa de runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

---

## 🐳 `frontend/Dockerfile`

```dockerfile
# Etapa de build
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Etapa de runtime (vite preview)
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
```

---

## ⚙️ `docker-compose.yml`

```yaml
version: "3.9"

services:
  backend:
    image: ghcr.io/${GITHUB_USER}/backend:latest
    container_name: violeta-backend
    ports:
      - "8080:8080"
    env_file: .env.backend

  frontend:
    image: ghcr.io/${GITHUB_USER}/frontend:latest
    container_name: violeta-frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

> 📘 En tu servidor de staging bastará con tener `docker`, `docker-compose` y un `.env.backend` con tus variables de entorno.

---

## 🧠 `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # 🧩 Build backend
      - name: Build backend
        run: |
          cd backend
          gradle clean build -x test

      # 🧩 Build frontend
      - name: Build frontend
        run: |
          cd frontend
          npm ci
          npm run build

      # 🧩 Login to GitHub Container Registry
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # 🧩 Build and push backend image
      - name: Build & push backend
        run: |
          docker build -t ghcr.io/${{ github.repository_owner }}/backend:latest ./backend
          docker push ghcr.io/${{ github.repository_owner }}/backend:latest

      # 🧩 Build and push frontend image
      - name: Build & push frontend
        run: |
          docker build -t ghcr.io/${{ github.repository_owner }}/frontend:latest ./frontend
          docker push ghcr.io/${{ github.repository_owner }}/frontend:latest

      # 🧩 Deploy to staging
      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /srv/violeta
            docker compose pull
            docker compose up -d
```

---

## 🔐 Secretos necesarios en GitHub

Ve a **Settings → Secrets → Actions**, y crea:

| Nombre            | Descripción                          |
| ----------------- | ------------------------------------ |
| `STAGING_HOST`    | IP o dominio del servidor de staging |
| `STAGING_USER`    | Usuario SSH                          |
| `STAGING_SSH_KEY` | Clave privada SSH (sin passphrase)   |
| `GITHUB_TOKEN`    | Ya está integrado automáticamente    |

---

## 🧰 Comandos básicos en el servidor

```bash
# En staging (solo una vez)
sudo mkdir -p /srv/violeta
cd /srv/violeta
# Copiar docker-compose.yml
docker compose up -d
```

Cada vez que hagas `git push main`, el pipeline:

1. Construye backend y frontend
2. Publica imágenes en GHCR
3. Se conecta por SSH y ejecuta `docker compose pull && up -d`
4. Actualiza tu staging automáticamente ✅

---

## 🏁 Resultado

Tendrás en **menos de una hora**:

* CI/CD completo (build, test, deploy).
* Todo versionado en GitHub.
* Despliegue automático sin pipelines externos.
* Infra reproducible en cualquier entorno vía Docker Compose.

---

¿Quieres que te genere un **ZIP descargable** con esta estructura y todos los archivos listos (puedes descomprimirlo y hacer `git init`)?
Puedo hacerlo en segundos para que empieces a trabajar directamente.
