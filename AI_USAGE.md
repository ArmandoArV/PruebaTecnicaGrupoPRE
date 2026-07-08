# AI_USAGE

## Para qué se usó

- **Tests unitarios:** generación de los casos de prueba (Jest) para las fases implementadas y para los escenarios de error (`tests/*.test.ts`).
- **Documentación:** redacción del `README.md` (instrucciones de ejecución, endpoints, fases completadas, supuestos y notas de complejidad).

## Qué se revisó y corrigió manualmente

- Se validó que cada test refleje el comportamiento esperado del dominio y no solo que "pase"; se ajustaron los casos y las aserciones donde hacía falta.
- Se revisaron los supuestos documentados en el `README.md` para que coincidan con la implementación real (por ejemplo, el manejo de `subcategories` faltante y el contrato de "no encontrado").
- El resto del código de dominio y de la API se revisó y ajustó manualmente para asegurar coherencia entre código, tests y documentación.
