Configurar el **GitHub Container Registry (GHCR)** permite:

* Subir y descargar imágenes Docker del pipeline
* Probar `docker pull` o `docker run` manualmente
* Usar el mismo registry para staging o producción

---

## 🧩 1️⃣ Inicia sesión en GitHub Container Registry

### Si usas **autenticación por token personal (PAT)**:

Primero, en GitHub:

* Ve a 👉 [**Settings → Developer settings → Personal access tokens → Tokens (classic)**](https://github.com/settings/tokens)
* Crea un token nuevo con:

  * ✅ **read:packages**
  * ✅ **write:packages**
  * ✅ **delete:packages**
  * ✅ **repo** (solo si tus repos son privados)
* Copia el token (solo se muestra una vez).

---

## 🧩 2️⃣ Autentícate en Docker

Ejecuta en tu terminal:

```bash
echo "TU_TOKEN_PERSONAL" | docker login ghcr.io -u TU_USUARIO_GITHUB --password-stdin
```

**Ejemplo:**

```bash
echo "ghp_xxx123..." | docker login ghcr.io -u cesarcontreras --password-stdin
```

Si ves el mensaje:

```
Login Succeeded
```

✅ Ya estás dentro.

---

## 🧩 3️⃣ Probar manualmente un `pull` o `push`

Si el pipeline ya subió tus imágenes (o lo hará en breve), puedes probar:

```bash
docker pull ghcr.io/TU_USUARIO_GITHUB/backend:latest
docker pull ghcr.io/TU_USUARIO_GITHUB/frontend:latest
```

> 🔎 Nota: Si los repos son privados, asegúrate de usar el token con permisos `read:packages` al hacer el pull.

---

## 🧩 4️⃣ (Opcional) Hacer push manual de una imagen

Si quieres probar localmente antes de usar GitHub Actions:

```bash
# build local
docker build -t ghcr.io/TU_USUARIO_GITHUB/backend:latest ./backend

# push
docker push ghcr.io/TU_USUARIO_GITHUB/backend:latest
```

---

## 🧩 5️⃣ Ver las imágenes en GitHub

Entra a tu perfil o tu organización:
👉 `https://github.com/TU_USUARIO_GITHUB?tab=packages`

Ahí aparecerán tus imágenes de Docker publicadas desde el pipeline:

* `backend`
* `frontend`

---

## 🧩 6️⃣ (Opcional) Dar acceso público o privado

Si quieres que otros puedan hacer `docker pull` sin autenticación:

* Entra a cada paquete → “Package settings” → **Change visibility → Public**

---

## ⚙️ Bonus: autenticar GHCR en el servidor de staging

En tu servidor (donde haces el `docker compose pull`), también puedes autenticarlo para evitar límites:

```bash
echo "TU_TOKEN_PERSONAL" | sudo docker login ghcr.io -u TU_USUARIO_GITHUB --password-stdin
```

De esa forma, cuando el pipeline ejecute `docker compose pull`, no tendrá problemas de permisos o rate limits.

---

**Script automatizado** que configura todo lo necesario para usar el **GitHub Container Registry (GHCR)** 
	tanto **en tu máquina local** como en **tu servidor de staging**, sin errores y sin tener que recordar los comandos.

---

## 📄 Archivo: `setup-ghcr.sh`

```bash
#!/bin/bash
# ---------------------------------------------------------
# Script de configuración de GitHub Container Registry (GHCR)
# ---------------------------------------------------------

echo "🚀 Configuración automática de GitHub Container Registry (GHCR)"
echo "--------------------------------------------------------------"

# Solicita los datos necesarios
read -p "👤 Ingresa tu usuario de GitHub: " GH_USER
read -s -p "🔑 Ingresa tu token personal de GitHub (PAT): " GH_TOKEN
echo ""
read -p "🌎 ¿Quieres configurar GHCR en esta máquina o en un servidor remoto? [local/remoto]: " TARGET

# Verificación de Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker no está instalado. Instálalo antes de continuar."
  exit 1
fi

# Función para login local
login_local() {
  echo "🧩 Autenticando localmente con GHCR..."
  echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USER" --password-stdin
  if [ $? -eq 0 ]; then
    echo "✅ Autenticación local exitosa."
  else
    echo "❌ Error en la autenticación local."
    exit 1
  fi
}

# Función para login remoto (via SSH)
login_remote() {
  read -p "📡 IP o dominio del servidor: " HOST
  read -p "👤 Usuario SSH: " USER
  echo "🔐 Asegúrate de tener acceso SSH sin contraseña (clave configurada)."
  echo "🧩 Ejecutando login remoto en $HOST..."
  ssh "$USER@$HOST" "echo '$GH_TOKEN' | sudo docker login ghcr.io -u '$GH_USER' --password-stdin"
  if [ $? -eq 0 ]; then
    echo "✅ Autenticación remota exitosa en $HOST."
  else
    echo "❌ Error al autenticar en el servidor remoto."
    exit 1
  fi
}

# Selección de destino
if [[ "$TARGET" == "local" ]]; then
  login_local
elif [[ "$TARGET" == "remoto" ]]; then
  login_remote
else
  echo "❌ Opción inválida. Usa 'local' o 'remoto'."
  exit 1
fi

echo "--------------------------------------------------------------"
echo "🎉 Configuración completada. Ya puedes hacer push/pull desde GHCR."
echo "Ejemplo:"
echo "  docker pull ghcr.io/$GH_USER/backend:latest"
echo "  docker pull ghcr.io/$GH_USER/frontend:latest"
echo "--------------------------------------------------------------"
```

---

## ⚙️ Cómo usarlo

1️⃣ **Guardar el archivo:**

```bash
nano setup-ghcr.sh
```

Pega el contenido anterior y guarda (`CTRL + O`, `ENTER`, `CTRL + X`).

2️⃣ **Dar permisos de ejecución:**

```bash
chmod +x setup-ghcr.sh
```

3️⃣ **Ejecutar el script:**

```bash
./setup-ghcr.sh
```

4️⃣ **Responde las preguntas:**

* Tu usuario de GitHub
* Tu token personal (PAT)
* Si deseas configurar `local` o `remoto`
* (Si eliges remoto) IP y usuario SSH del servidor

---

## 💡 Resultado

✅ El script:

* Autentica Docker contra `ghcr.io`
* Permite subir y descargar imágenes desde GitHub Packages
* Se puede reutilizar tanto en tu laptop como en staging
