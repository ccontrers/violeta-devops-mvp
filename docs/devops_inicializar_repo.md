**Comandos** para inicializar tu repo `violeta-devops`, subirlo a GitHub y activar el pipeline CI/CD.

---

## 🚀 Paso 1: Descomprimir el ZIP y entrar al proyecto

```bash
unzip violeta-devops.zip
cd violeta-devops
```

---

## 🧰 Paso 2: Inicializar Git y crear el primer commit

```bash
git init
git add .
git commit -m "chore: initial DevOps MVP setup"
```

---

## 🪣 Paso 3: Crear el repositorio en GitHub

En GitHub, crea manualmente un nuevo repositorio vacío llamado:

👉 `violeta-devops`

No agregues README, .gitignore ni licencia (ya están en tu carpeta local).

---

## 🌐 Paso 4: Conectar tu repositorio local con GitHub

Reemplaza `TU_USUARIO_GITHUB` con tu nombre de usuario o tu organización en GitHub:

```bash
git remote add origin https://github.com/TU_USUARIO_GITHUB/violeta-devops.git
```

(O si usas SSH:)

```bash
git remote add origin git@github.com:TU_USUARIO_GITHUB/violeta-devops.git
```

---

## 🚢 Paso 5: Subir los cambios a la rama principal

```bash
git branch -M main
git push -u origin main
```

Esto activará automáticamente el pipeline de CI/CD en **GitHub Actions** 🚀

---

## 🔐 Paso 6: Configurar los secretos del despliegue

En GitHub → tu repo → **Settings → Secrets → Actions**, crea:

| Nombre del secreto | Valor                                          |
| ------------------ | ---------------------------------------------- |
| `STAGING_HOST`     | IP o dominio de tu servidor                    |
| `STAGING_USER`     | Usuario SSH (por ejemplo `ubuntu`)             |
| `STAGING_SSH_KEY`  | Contenido de tu clave privada (sin passphrase) |

GitHub ya incluye automáticamente `GITHUB_TOKEN`, no necesitas crearla.

---

## 🧩 Paso 7: Preparar tu servidor de staging

En tu servidor (Linux con Docker y docker-compose instalados):

```bash
sudo mkdir -p /srv/violeta
cd /srv/violeta

# Copiar manualmente el docker-compose.yml del repo
# o clonar el repo si prefieres
```

Y la primera vez, ejecuta:

```bash
docker compose up -d
```

Después de eso, cada `git push main`:

* Construye las imágenes
* Las publica en GHCR
* Se conecta a tu servidor
* Ejecuta `docker compose pull && docker compose up -d`
  ✅ ¡Despliegue automático completo!

