# PruebaTecnicaGrupoPRE

Backend en TypeScript + Express que expone una capa de dominio para analizar,
consultar y modificar estructuras jerárquicas (categorías/subcategorías).

## Requisitos

- Node.js 18+ (usa `fetch` y `structuredClone` nativos)

## Instalación

```bash
npm install
npx playwright install chromium   # solo para los tests e2e
```

## Ejecución

```bash
npm run dev     # servidor en modo watch (ts-node-dev) en http://localhost:3000
npm run build   # compila a dist/
npm start       # ejecuta dist/server.js
```

## Endpoints

| Método    | Ruta                     | Descripción                                  |
| --------- | ------------------------ | -------------------------------------------- |
| GET       | `/api/health`            | Healthcheck                                  |
| GET/POST  | `/api/active-leaf-paths` | Fase 1: rutas de hojas activas               |
| GET/POST  | `/api/category/:id`      | Fase 2: busca una categoría por ID           |
| GET/POST  | `/api/analyze`           | Fase 3: reporte + anomalías de la estructura |

En las rutas `POST` podés enviar tu propia estructura en el body; sin body se
usa la estructura de ejemplo (`src/sampleStructure.ts`).

### Manejo de errores y logging

- **Errores normalizados:** todo error responde con la forma `{ "error": { "code", "message" } }`. Los errores de dominio usan `AppError` (`src/errors/AppError.ts`) con `code` estable + status HTTP; un middleware central (`src/middleware/errorHandler.ts`) los traduce y captura cualquier error no controlado como `INTERNAL_ERROR` (500).
- **Logger:** `src/utils/logger.ts` (basado en `console`, con timestamp y nivel). El error handler loguea cada error; el endpoint `/api/analyze` loguea las anomalías detectadas.

## Tests

```bash
npm test          # unit tests (Jest) de la capa de dominio
npm run test:e2e  # e2e: levanta el server y prueba TODOS los endpoints (Playwright)
npm run test:all  # unit + e2e en un solo comando
```

El e2e (`tests/e2e/run.mjs`) es genérico: levanta el servidor una sola vez,
recorre la lista `CASES`, toma un screenshot por endpoint (en `tests/e2e/*.png`)
y valida status + payload. Para cubrir un endpoint nuevo, agregá una entrada
`{ name, path, status, check }` a `CASES`. Devuelve exit code ≠ 0 si algo falla.

## Fases completadas

- **Fase 1** — `getActiveLeafPaths`: rutas de hojas activas, podando ramas inactivas, ordenadas alfabéticamente.
- **Fase 2** — `findCategoryById`: nodo, path, profundidad, `parentId` e `isLeaf`; `null` si no existe.
- **Fase 3** — `analyzeStructure`: reporte con rutas de hojas activas, conteo de nodos válidos/activos/inactivos, profundidad máxima y lista de anomalías. Tolera datos inválidos y ciclos sin romper.

### Complejidad y árboles profundos (Fase 3)

- **Tiempo:** O(n) — cada nodo se visita una vez; operaciones de `Set` O(1).
- **Espacio:** O(n) — `Set` de ids + `Set` de objetos visitados + pila de recorrido.
- **Ciclos:** se detectan por referencia de objeto (`Set<object>`). Un objeto ya visitado no se vuelve a expandir → no hay loop infinito; se emite `CYCLE_DETECTED`.
- **Profundidad:** el recorrido es **iterativo con pila explícita** (no recursión), por lo que árboles muy profundos no desbordan el call stack (test con 20 000 niveles).

### Códigos de anomalía

`INVALID_NODE`, `INVALID_ID`, `DUPLICATE_ID`, `INVALID_NAME`, `INVALID_SUBCATEGORIES`, `NULL_CHILD`, `CYCLE_DETECTED`.

## Supuestos

- Categoría no encontrada (Fase 2) → la función devuelve `null`; el endpoint responde `404`.
- Fases 1 y 2 asumen una estructura válida (según el enunciado).
- Fase 3: `subcategories` faltante (`undefined`) se trata como hoja vacía sin anomalía; un valor presente no-array (incluido `null`) sí reporta `INVALID_SUBCATEGORIES`.
- Un nodo objeto se cuenta como "procesado" aunque tenga campos inválidos; sus problemas se reportan como anomalías.
