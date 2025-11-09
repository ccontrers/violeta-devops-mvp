Pendiente de implementar: **Smoke tests**


**Smoke tests en el backend**

Construir un *pipeline que garantice salud básica del backend*, sin detener la velocidad del equipo.

Así que aquí te dejo lo **mínimo viable y efectivo** en *testing backend* con **Spring Boot + Gradle**, explicado por niveles de impacto y esfuerzo

---

## 🧱 Objetivo del MVP de pruebas backend

> “Verificar automáticamente que la aplicación **compila, arranca y responde** antes de desplegar.”

Esto equivale a:

* Detectar errores de configuración o dependencias.
* Asegurar que el *contexto Spring* carga bien.
* Validar endpoints básicos (ej. `/health` o `/actuator/info`).

Nada más, nada menos.
Más adelante puedes crecer hacia TDD o tests de integración más finos.

---

## 🔹 1️⃣ Smoke Test de contexto Spring

Es el test más importante y mínimo que todo backend debe tener:

```java
// src/test/java/com/violeta/VioletaApplicationTests.java
package com.violeta;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class VioletaApplicationTests {

    @Test
    void contextLoads() {
        // Si el contexto arranca sin excepciones, este test pasa
    }
}
```

✅ Garantiza que:

* La configuración de Spring Boot es válida.
* No hay beans rotos ni dependencias mal definidas.
* Se pueden levantar los perfiles de entorno (dev/staging).

🧠 Este test corre rápido (1–3 segundos) y atrapa la mayoría de errores antes del build Docker.

---

## 🔹 2️⃣ Smoke Test de endpoint básico

Opcional pero muy útil:
Probar que el API realmente **responde en HTTP** a una petición.

Ejemplo con `MockMvc`:

```java
// src/test/java/com/violeta/controller/HealthControllerTest.java
package com.violeta.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturn200OnHealthEndpoint() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }
}
```

🔹 Si tienes el *Spring Actuator* activo, `/actuator/health` ya existe.
🔹 Si no, puedes usar un endpoint propio (ej. `/api/ping`).

---

## 🔹 3️⃣ Configuración Gradle (por si acaso)

En `build.gradle` asegúrate de tener dependencias para testing:

```groovy
dependencies {
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

Y que la tarea `test` esté habilitada:

```bash
./gradlew test
```

---

## 🔹 4️⃣ Integración en el pipeline CI/CD

En tu workflow (`.github/workflows/ci-cd.yml`):

```yaml
- name: Run backend tests
  run: ./gradlew test --no-daemon
```

✅ Si alguno de los tests falla, **el pipeline se detiene antes de construir la imagen Docker**.
Así evitas subir contenedores rotos al registro.

---

## 🔹 5️⃣ Resultado esperado

| Test                   | Qué valida                         | Cuándo falla                                           |
| ---------------------- | ---------------------------------- | ------------------------------------------------------ |
| `contextLoads()`       | Configuración base y beans válidos | Problemas de dependencias, YAML mal formateado         |
| `HealthControllerTest` | API responde correctamente         | Endpoint no disponible, errores en seguridad o routing |

Con estos dos tests tienes cobertura del **80 % de los fallos típicos de build/deploy**.

---

## ⚙️ Bonus: paso siguiente (cuando escales)

Cuando el equipo ya tenga confianza en el pipeline, puedes agregar:

* Tests de **repositorios** (con H2 in-memory)
* Tests de **servicios** (con mocks)
* Tests de **integración** (con Testcontainers para DB reales)
  Pero no son necesarios en el MVP.

---

## 🧭 Conclusión

**Lo mínimo viable en testing backend** para tu DevOps inicial:

| Nivel          | Test             | Propósito                      |
| -------------- | ---------------- | ------------------------------ |
| 🟢 Esencial    | `contextLoads()` | Verificar que Spring arranca   |
| 🟡 Recomendado | Health endpoint  | Verificar API básica           |
| 🟣 CI/CD       | `./gradlew test` | Validar antes del build Docker |

---


**Smoke tests en el frontend** es justo lo ideal para un **MVP de DevOps**: poca inversión, pero mucho retorno.

**Qué son, por qué importan y cómo aplicarlos rápido con Vite + React + Vitest + Testing Library** 👇

---

## 💨 Qué son los *Smoke Tests*

**Smoke tests** = *“¿El sistema prende sin explotar?”*

En frontend:

* No buscan validar lógica compleja.
* Solo confirman que **la app arranca, renderiza lo esencial y no crashea**.
* Detectan rápido errores de build, dependencias o cambios de entorno.

> 🔍 Su propósito: **verificar que las partes básicas del UI funcionan y se pueden montar** (por ejemplo: App, Layout, rutas principales).

---

## 🧠 Ejemplo conceptual

Piensa que en backend un smoke test es:

```bash
curl http://localhost:8080/health
# Esperas 200 OK
```

En frontend sería equivalente a:

> “¿La app carga sin lanzar errores en consola y muestra el título principal?”

---

## ⚙️ Cómo hacerlo con **Vite + React + Vitest + Testing Library**

Ya que usas:

* **React + Vite**
* **TypeScript**
* **Tailwind + shadcn/ui**

Entonces **Vitest + React Testing Library** es la pareja perfecta:

* se integra directo con Vite (sin config especial),
* se ejecuta en CI sin navegador real (usando jsdom).

---

## 🧩 Instalación (si no lo tienes aún)

Desde la raíz del frontend:

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## ⚙️ Configuración mínima (`vite.config.ts`)

Agrega (si no existe) la sección `test`:

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts"
  },
});
```

---

## 🧩 Archivo `src/setupTests.ts`

```ts
import "@testing-library/jest-dom";
```

---

## 🧪 Ejemplo de **Smoke Test** (`src/App.test.tsx`)

```tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Smoke Test", () => {
  it("renders the main app without crashing", () => {
    render(<App />);
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
  });
});
```

👉 Este test:

* Monta tu `App` completa (como en el navegador),
* Verifica que exista algo esperable (ej. texto principal),
* Falla si hay errores de importación, dependencias o JSX.

---

## 🚀 Ejecución local

```bash
npm run test
```

(En `package.json`, asegúrate de tener)

```json
"scripts": {
  "test": "vitest run"
}
```

---

## ⚙️ Integración en CI/CD (GitHub Actions)

En tu workflow (`.github/workflows/ci-cd.yml`):

```yaml
- name: Run frontend smoke tests
  run: npm run test --prefix frontend
```

De esta forma:

* Cada `push` ejecuta el smoke test.
* Si algo rompe la app (por ejemplo, imports, JSX, Tailwind config), el pipeline falla antes de hacer build o deploy.

---

## 🧩 Qué deberías cubrir con Smoke Tests

| Componente              | Qué probar                       | Ejemplo                                   |
| ----------------------- | -------------------------------- | ----------------------------------------- |
| App raíz                | Renderiza sin errores            | `render(<App />)`                         |
| Layout principal        | Renderiza logo o título          | `screen.getByText('Dashboard')`           |
| Rutas base              | Que cada ruta no lance excepción | `render(<Router><Home /></Router>)`       |
| Componentes UI críticos | Que existan en DOM               | `getByRole('button', { name: /login/i })` |

💡 *No pruebes lógica de negocio aquí*, solo que la interfaz **arranca y muestra lo básico.**

---

## 📈 Beneficio real en DevOps

✔️ Detecta fallas antes del build o deploy (falla rápida).
✔️ Incrementa la confianza del pipeline sin fricción.
✔️ No exige mucha cultura de testing.
✔️ Es el “check vital” de tu frontend.

---

## 🧭 Conclusión

> En tu MVP DevOps, los **smoke tests de frontend** son el “termómetro de salud” más simple y valioso que puedes automatizar.

Te permiten:

* probar builds con Vitest en segundos,
* detectar errores de integración,
* tener feedback inmediato en CI.
