# Frontend Testing Guidelines

Project: VioletaServer

## Estrategia de Testing

### Tech Stack
- **Unit Testing:** Vitest + React Testing Library + Jest-DOM
- **E2E Testing:** Playwright
- **API Testing:** Playwright request API
- **Mocking:** Vi (Vitest) para servicios y componentes

## Testing Pyramid

```
    /\     E2E (Playwright)
   /  \    - Flujos críticos completos
  /____\   - Integración frontend-backend
 /      \  
/________\  Unit Tests (React Testing Library)
           - Componentes individuales
           - Hooks personalizados
           - Funciones utilitarias
```

---

## Unit Testing (Vitest + React Testing Library)

### Configuración Inicial

#### 1. Dependencias Requeridas
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

#### 2. Configuración Vitest (vite.config.ts)
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**', '**/*.spec.ts']
  },
})
```

#### 3. Setup Global (src/test/setup.ts)
```ts
import '@testing-library/jest-dom'

// Mock global para fetch
globalThis.fetch = vi.fn()

// Mock para matchMedia (para componentes que usan media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

### Principios
- Vitest + React Testing Library para tests basados en comportamiento
- Minimal happy path + 1–2 edge cases por componente
- Focus en interacciones del usuario, no implementación interna
- Props tipadas con interfaces TypeScript
- Mocking adecuado de dependencias externas

### Estructura de Archivos
```
src/
├── components/__tests__/           # Tests de componentes React
├── hooks/__tests__/               # Tests de hooks personalizados  
├── services/__tests__/            # Tests de servicios/APIs
├── test/setup.ts                  # Configuración global de tests
└── types/                         # Definiciones TypeScript
```

### Patrones de Testing

#### 1. Testing de Servicios/APIs
```ts
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import { ProveedoresApiService } from '../proveedores.service'

// Mock de Axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    isAxiosError: vi.fn(),
    create: vi.fn(),
  }
}))

const axiosMock = axios as any

describe('ProveedoresApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería realizar búsqueda exitosa', async () => {
    // ARRANGE
    const mockResponse = { success: true, data: [...] }
    axiosMock.post.mockResolvedValueOnce({ data: mockResponse })

    // ACT
    const result = await ProveedoresApiService.buscarProveedores(request)

    // ASSERT
    expect(result).toEqual(mockResponse)
    expect(axiosMock.post).toHaveBeenCalledWith('/api/endpoint', request, config)
  })
})
```

#### 2. Testing de Hooks Personalizados
```ts
import { renderHook, act } from '@testing-library/react'
import { useBusquedaProveedoresForm } from '../useBusquedaProveedoresForm'

// Mock del servicio
vi.mock('../../services/proveedores.service', () => ({
  ProveedoresApiService: {
    buscarProveedores: vi.fn()
  }
}))

describe('useBusquedaProveedoresForm', () => {
  it('debe inicializar con valores por defecto', () => {
    const { result } = renderHook(() => useBusquedaProveedoresForm())
    
    expect(result.current.formData).toEqual(expectedInitialState)
    expect(result.current.loading).toBe(false)
  })

  it('debe actualizar estado al enviar formulario', async () => {
    const { result } = renderHook(() => useBusquedaProveedoresForm())

    await act(async () => {
      await result.current.handleBusqueda()
    })

    expect(result.current.loading).toBe(false)
  })
})
```

#### 3. Testing de Componentes React
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BusquedaProveedores from '../BusquedaProveedores'

// Mock del hook personalizado
vi.mock('@/hooks/useBusquedaProveedoresForm', () => ({
  useBusquedaProveedoresForm: () => ({
    formData: mockFormData,
    loading: false,
    handleBusqueda: mockHandleBusqueda,
    isFormValid: () => true,
    // ... otros valores mockeados
  })
}))

describe('BusquedaProveedores', () => {
  it('debe renderizar correctamente', () => {
    render(<BusquedaProveedores />)
    
    expect(screen.getByText('Búsqueda de Proveedores')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument()
  })

  it('debe manejar click en buscar', async () => {
    const user = userEvent.setup()
    render(<BusquedaProveedores />)
    
    await user.click(screen.getByRole('button', { name: /buscar/i }))
    
    expect(mockHandleBusqueda).toHaveBeenCalled()
  })
})
```

### Mejores Prácticas de Mocking

#### Axios/HTTP Requests
```ts
// ✅ Configuración correcta de mock para Axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    isAxiosError: vi.fn(),
    create: vi.fn(),
  }
}))

const axiosMock = axios as any

// En cada test
axiosMock.post.mockResolvedValueOnce({ data: mockResponse })
```

#### Hooks Personalizados  
```ts
// ✅ Mock de hook personalizado con todos los valores necesarios
vi.mock('@/hooks/useCustomHook', () => ({
  useCustomHook: () => ({
    data: mockData,
    loading: false,
    error: null,
    actions: {
      submit: mockSubmit,
      reset: mockReset
    }
  })
}))
```

#### Cleanup de Mocks
```ts
describe('ComponentTest', () => {
  beforeEach(() => {
    vi.clearAllMocks() // ✅ Limpiar mocks entre tests
  })
})
```

### Ejemplo Completo de Test
```ts
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import CatalogoClientes from '../CatalogoClientes'

describe('CatalogoClientes', () => {
  test('debería mostrar mensaje de error en respuesta 400', async () => {
    // Mock del servicio API
    vi.mock('../services/catalogo-clientes.service', () => ({
      grabarCliente: vi.fn().mockRejectedValue({
        response: { status: 400, data: { message: 'RFC duplicado' } }
      })
    }));

    render(<CatalogoClientes sucursal="01" />);
    
    // Interacción del usuario
    const saveButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(saveButton);
    
    // Verificación del comportamiento
    await waitFor(() => {
      expect(screen.getByText('RFC duplicado')).toBeInTheDocument();
    });
  });
});
```

---

## E2E Testing (Playwright)

### Cuando Crear Tests E2E
**Cuando agregar funcionalidades nuevas, crear tests esenciales de Playwright para:**

1. **Flujos críticos end-to-end:**
   - Alta de registros (clientes, artículos, etc.)
   - Modificación de datos principales
   - Búsquedas y consultas importantes

2. **Casos de uso principales:**
   - Validar que el frontend comunica correctamente con el backend
   - Verificar preservación de campos no modificados
   - Probar validaciones y manejo de errores

### Estructura de Tests E2E
```ts
// Ejemplo: tests/alta-cliente.spec.ts
import { test, expect } from '@playwright/test';

test('alta de cliente nuevo', async ({ request }) => {
  const BASE_API = 'http://localhost:5986/api/v1/catalogos/clientes';
  
  const payload = {
    operacion: 'A',
    cliente: `TEST${Date.now()}`,
    idEmpresa: 1,
    // ... datos del cliente
    nombre: 'Juan Carlos',
    rsocial: 'JUAN CARLOS PEREZ',
    activo: true
  };
  
  const response = await request.post(BASE_API, {
    data: payload,
    headers: { 
      'Content-Type': 'application/json',
      'X-Sucursal': 'S1'
    }
  });
  
  expect(response.status()).toBe(200);
  
  // Verificar que se creó correctamente
  const result = await response.json();
  expect(result.success).toBe(true);
  expect(result.cliente.nombre).toBe(payload.nombre);
});
```

### Tests Mínimos Requeridos
- ✅ **Alta exitosa** con datos válidos
- ✅ **Modificación** preservando campos no enviados
- ✅ **Manejo de errores** de validación (400)
- ✅ **Verificación de respuestas** de la API

### Ejemplos de Tests E2E Existentes
```
frontend/tests/
├── alta-cliente.spec.ts           # Alta de cliente nuevo
├── preservacion-campos.spec.ts    # Preservación de campos no modificados
├── preservacion-digitos.spec.ts   # Preservación digitosdef/digitossup
└── cliente-S100579.spec.ts        # Modificación cliente específico
```

---

### Comandos de Testing

### Unit Tests (Vitest)
```bash
# Ejecutar tests unitarios
cd frontend
npm test

# Watch mode (desarrollo)
npm test -- --watch

# Ejecutar una sola vez
npm test -- --run

# Coverage report
npm test -- --coverage

# UI interactiva
npm test -- --ui

# Test específico
npm test services/proveedores.service.test.ts
```

### Package.json Scripts Recomendados
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui", 
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### E2E Tests
```bash
# Ejecutar tests E2E
cd frontend
npx playwright test

# Test específico
npx playwright test nombre-test.spec.ts

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui
```

---

## Troubleshooting y Soluciones Comunes

### Problemas de TypeScript en Tests
```ts
// ❌ Error: Property 'mockResolvedValueOnce' does not exist
const mockedAxios = axios as vi.Mocked<typeof axios>

// ✅ Solución: Mock manual con tipado correcto  
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  }
}))
const axiosMock = axios as any
```

### Conflictos entre Vitest y Playwright
```ts
// vite.config.ts - Excluir tests de Playwright de Vitest
export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**', '**/*.spec.ts']
  }
})
```

### Mocking de Window APIs
```ts
// src/test/setup.ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    // ... resto de la implementación
  })),
})
```

### Debugging Tests
```bash
# Para debugging interactivo
npm test -- --ui

# Ver output detallado
npm test -- --reporter=verbose

# Run solo tests que fallan
npm test -- --reporter=verbose --run
```

---

## Patrones y Best Practices

### Testing de Preservación de Campos
```ts
test('preservación de campos no modificados', async ({ request }) => {
  // 1. Consultar estado original
  const originalResponse = await request.get(`${BASE_API}/S100579`);
  const datosOriginales = await originalResponse.json();
  
  // 2. Modificar solo un campo
  const payload = {
    operacion: 'M',
    cliente: 'S100579',
    nomnegocio: 'NUEVO NOMBRE ' + Date.now(),
    // NO incluir otros campos para verificar preservación
  };
  
  // 3. Enviar actualización
  const updateResponse = await request.post(BASE_API, { data: payload });
  expect(updateResponse.status()).toBe(200);
  
  // 4. Verificar preservación
  const finalResponse = await request.get(`${BASE_API}/S100579`);
  const datosFinales = await finalResponse.json();
  
  expect(datosFinales.cliente.otrocampo).toBe(datosOriginales.cliente.otrocampo);
});
```

### Testing de Validaciones
```ts
test('validación RFC duplicado', async ({ request }) => {
  const payload = {
    operacion: 'A',
    cliente: 'TEST123',
    rfc: 'RFC_YA_EXISTENTE' // RFC que ya existe en BD
  };
  
  const response = await request.post(BASE_API, { data: payload });
  
  expect(response.status()).toBe(400);
  const error = await response.json();
  expect(error.message).toContain('RFC duplicado');
});
```

---

## Configuración

### Playwright Config
```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch", 
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "vitest": "^3.2.4",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.6.3", 
    "@testing-library/user-event": "^14.5.2",
    "@playwright/test": "^1.40.0"
  }
}
```