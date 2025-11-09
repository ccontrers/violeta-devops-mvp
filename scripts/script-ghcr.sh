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