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

En las rutas `POST` podés enviar tu propia estructura en el body; sin body se
usa la estructura de ejemplo (`src/sampleStructure.ts`).

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

## Supuestos

- Categoría no encontrada (Fase 2) → la función devuelve `null`; el endpoint responde `404`.
- Fases 1 y 2 asumen una estructura válida (según el enunciado).
