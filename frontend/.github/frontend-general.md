# Frontend — reglas y guardrails

**Última actualización:** Octubre 6, 2025  
**Estado:** Estandarización UI Completada ✅

Alcance: frontend React + TypeScript (Vite) con patrones de consistencia visual establecidos.

## Guardrails
- TypeScript en modo estricto (`strict: true`).
- Componentes funcionales con hooks.
- Usar alias `@/` para imports (configurar en `tsconfig.json` y `vite.config.ts`).
- Estados consolidados con hooks personalizados cuando sea posible.
- Manejo de estados `loading`, `error`, `empty` consistente.
- Preferir componentes UI reutilizables (Shadcn UI / Tailwind componentes propios).

## Estructura recomendada
- `frontend/src/components`
- `frontend/src/hooks`
- `frontend/src/services` (API)
- `frontend/src/types`

## Archivos a versionar
- `package.json`, `package-lock.json`, `src/`, `public/`, `vite.config.ts`, `tsconfig.json`.

## Ignorar en git (`.gitignore`)
- `node_modules/`, `dist/`, `build/`, `.env*`, `.vscode/`, `.idea/`.

## Comandos útiles
- Desarrollo: `cd frontend; npm install; npm run dev`
- Build: `npm run build`; Preview: `npm run preview`

## Patrones UI
- Inputs/Selects/Modal/Tabla reutilizables.
- Utilidades para `readOnly/disabled` basadas en el modo (edición vs consulta).

## Consistencia Visual ✅ **ESTABLECIDA (Octubre 2025)**

### Tema Violeta Unificado
Todos los módulos de búsqueda siguen el patrón visual establecido:

```tsx
// ✅ PATRÓN ESTÁNDAR - Headers con gradiente
<h2 className="text-3xl font-bold bg-gradient-to-r from-violeta-700 to-violeta-900 bg-clip-text text-transparent">
  Título del Módulo
</h2>

// ✅ PATRÓN ESTÁNDAR - Cards con glass effect
<Card className="glass-violeta border-violeta-200 shadow-lg">

// ✅ PATRÓN ESTÁNDAR - Controles Switch
<div className="flex items-center space-x-2 glass-violeta p-3 rounded-lg border border-violeta-200">
  <Label className="text-sm font-medium text-violeta-700">Etiqueta</Label>
  <Switch />
</div>

// ✅ PATRÓN ESTÁNDAR - Tabs
<TabsList className="bg-violeta-50 border border-violeta-200 h-12">
  <TabsTrigger className="data-[state=active]:bg-violeta-600 data-[state=active]:text-white">
```

### Módulos Estandarizados
- **BusquedaClientes** - Modelo de referencia original
- **BusquedaProveedores** - Estandarizado con controles específicos preservados
- **BusquedaArticulos** - Completamente transformado para consistencia

### Reglas de Consistencia
1. **Gradientes de títulos**: Siempre `from-violeta-700 to-violeta-900`
2. **Headers de formularios**: Usar "Criterios de Búsqueda" como título estándar
3. **Controles de filtros**: Switch components con estilo glass-violeta
4. **Botón Limpiar**: Único y centralizado después de tabs
5. **Resultados**: Preferir cards responsivas sobre tablas
6. **Estados loading**: Usar colores violeta consistentes

## Documentación relacionada
- `docs/frontend-standards.md`
- **[modulos-tipo-busquedas.md](modulos-tipo-busquedas.md)** - Patrones de estandarización UI aplicados
- **[backend-general.md](backend-general.md)** - Coordinación backend-frontend

---

## Anexo: Frontend Standards (desde docs/frontend-standards.md)

````markdown
# Frontend Standards

Project: VioletaServer

## Tech Stack
- React 18 + TypeScript
- Vite
- Shadcn UI + Tailwind CSS
- Axios
- Lucide React

## Core Principles
- TypeScript strict types everywhere
- Functional components with hooks
- Single-responsibility components; extract UI primitives
- Manage errors via try/catch and user feedback
- Use `@/` import alias for `src/`

## Structure
```
src/
├── components/
│   ├── ui/              # Shadcn UI wrappers
│   └── BusquedaArticulos.tsx
├── services/
│   └── api.service.ts
├── types/
│   └── api.types.ts
└── lib/
	└── utils.ts
```

## UI Patterns
- Tabs for multi-mode search forms
- Loading states on actions
- Reusable selectors and tables; avoid duplication across tabs

## Testing y Build
- React Testing Library for behavior-first tests
- Playwright E2E tests for critical workflows
- **Ver documentación completa:** [`frontend-testing.md`](frontend-testing.md)

### Build Status Post-Estandarización
```bash
# ✅ Build exitosa después de estandarización UI completa
npm run build

> violeta-frontend@0.0.0 build
> tsc && vite build

vite v5.4.19 building for production...
✓ 1454 modules transformed.
dist/assets/index-LeVGWjoq.js   369.93 kB │ gzip: 100.47 kB
✓ built in 1.78s
```

**Validaciones de Build:**
- Cero errores TypeScript
- Todas las dependencias resueltas
- Imports consistency verificada
- Componentes UI funcionando correctamente

## Performance and DX
- Prefer controlled components with debounced inputs for searches
- Memoize expensive lists; virtualize if needed

## Conventions
- Props typed with interfaces
- Avoid many independent useState; prefer grouped state/hooks

## Estandarización UI - Lecciones Aprendidas

### Proceso Exitoso Aplicado
1. **Identificar Modelo de Referencia**: Elegir el componente más limpio y consistente
2. **Análisis Comparativo**: Documentar diferencias específicas entre componentes
3. **Transformación Incremental**: Un módulo a la vez, validando build en cada paso
4. **Preservación Funcional**: Mantener características únicas mientras se estandariza UI
5. **Validación Continua**: Build + pruebas manuales después de cada cambio

### Template para Nuevos Módulos de Búsqueda
```tsx
const BusquedaNueva = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header estándar */}
      <div className="glass-violeta p-6 rounded-xl border border-violeta-200 shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violeta-700 to-violeta-900 bg-clip-text text-transparent">
          Búsqueda de Nueva Entidad
        </h2>
        <p className="text-violeta-600 font-medium">Descripción del módulo</p>
        
        {/* Controles de filtros */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 glass-violeta p-3 rounded-lg border border-violeta-200">
            <Label className="text-sm font-medium text-violeta-700">Control</Label>
            <Switch />
          </div>
        </div>
      </div>
      
      {/* Formulario estándar */}
      <Card className="glass-violeta border-violeta-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-violeta-900">
            <Search className="h-5 w-5 text-violeta-600" />
            Criterios de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Contenido específico */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={limpiar}>Limpiar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

### Checklist de Consistencia UI
- [ ] Header con gradiente `from-violeta-700 to-violeta-900`
- [ ] Cards con clase `glass-violeta border-violeta-200 shadow-lg`
- [ ] Controles Switch con labels `text-violeta-700`
- [ ] Título "Criterios de Búsqueda" en formularios
- [ ] Botón Limpiar centralizado (no múltiples)
- [ ] Tabs con `bg-violeta-50 border border-violeta-200 h-12`
- [ ] Estados loading con colores violeta
- [ ] Build exitosa sin errores TypeScript
````