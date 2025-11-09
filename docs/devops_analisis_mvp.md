##  Objetivo

** implementar DevOps con CI/CD de la forma más rápida y simple (MVP)**, 
	flujo con **mínima infraestructura**, **máximo valor inmediato**, y **todo orquestado desde GitHub + Docker**.

---

## 🚀 Objetivo del MVP

* Tener un **pipeline automatizado** que:

  1. Ejecute **tests** y **build** automáticamente al hacer push o PR.
  2. Genere imágenes **Docker** del backend y frontend.
  3. Despliegue automáticamente a un **entorno de staging o demo** (puede ser un contenedor en un servidor o estación de trabajo).

---

## 🧩 Arquitectura mínima

```
GitHub Actions (CI/CD)
 ├─ Ejecuta tests + build (Spring Boot, React)
 ├─ Construye imágenes Docker
 ├─ Publica en GitHub Container Registry
 └─ Despliega al servidor (staging)
 
Servidor destino (puede ser VPS, VM o local)
 └─ docker-compose con backend + frontend + DB
```

---

## 🧰 Herramientas sugeridas (todas rápidas de levantar)

| Propósito             | Herramienta                             | Forma                                  |
| --------------------- | --------------------------------------- | -------------------------------------- |
| CI/CD                 | **GitHub Actions**                      | Ya incluido con tu repo                |
| Build backend         | **Maven/Gradle** + Dockerfile           | Contenedor Java                        |
| Build frontend        | **Vite build** + Dockerfile             | Contenedor Node                        |
| Infra mínima          | **Docker Compose**                      | Para levantar servicios local o remoto |
| Registry              | **GitHub Container Registry (ghcr.io)** | Gratis y sin setup extra               |
| Despliegue automático | GitHub Action SSH o rsync               | Simple script o docker-compose pull/up |

---

## ⚙️ Estructura de proyecto recomendada

```
/ (repo root)
 ├── backend/
 │    ├── Dockerfile
 │    └── ...
 ├── frontend/
 │    ├── Dockerfile
 │    └── ...
 ├── docker-compose.yml
 └── .github/
      └── workflows/
           └── ci-cd.yml
```

---

## 🐳 Ejemplo: Dockerfile backend (Spring Boot)

```Dockerfile
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

---

## 🐳 Ejemplo: Dockerfile frontend (React + Vite)

```Dockerfile
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## 🧩 docker-compose.yml (entorno de prueba)

```yaml
version: "3.9"
services:
  backend:
    image: ghcr.io/tuusuario/backend:latest
    ports:
      - "8080:8080"
    env_file: .env.backend

  frontend:
    image: ghcr.io/tuusuario/frontend:latest
    ports:
      - "80:80"
```

---

## ⚙️ GitHub Actions: `.github/workflows/ci-cd.yml`

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
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Build backend
        run: |
          cd backend
          ./mvnw clean test package -DskipTests

      - name: Build frontend
        run: |
          cd frontend
          npm ci
          npm run build

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push backend image
        run: |
          docker build -t ghcr.io/${{ github.repository_owner }}/backend:latest ./backend
          docker push ghcr.io/${{ github.repository_owner }}/backend:latest

      - name: Build and push frontend image
        run: |
          docker build -t ghcr.io/${{ github.repository_owner }}/frontend:latest ./frontend
          docker push ghcr.io/${{ github.repository_owner }}/frontend:latest

      # OPCIONAL: Despliegue automático a servidor de staging
      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /srv/app
            docker compose pull
            docker compose up -d
```

---

## 💡 Siguientes pasos (una vez validado el MVP)

1. Añadir tests automáticos (JUnit, Cypress o Playwright).
2. Agregar escaneo de seguridad con [Trivy](https://github.com/aquasecurity/trivy-action).
3. Automatizar versionado/tagging de imágenes con `git tags`.
4. Implementar environments (staging / prod) con ramas y variables separadas.

---

## 🏁 Resumen — setup express (1 día máximo)

| Paso | Descripción                              | Tiempo estimado |
| ---- | ---------------------------------------- | --------------- |
| 1    | Agregar Dockerfiles al backend/frontend  | 1h              |
| 2    | Crear workflow de GitHub Actions         | 1h              |
| 3    | Configurar GitHub Container Registry     | 10 min          |
| 4    | Levantar docker-compose en staging/local | 1h              |
| 5    | Validar despliegue automático            | 1–2h            |

