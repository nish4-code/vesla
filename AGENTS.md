## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Reglas del proyecto

### Separación de responsabilidades

- Un archivo debe tener una única responsabilidad. No mezclar datos, lógica de cliente y presentación en el mismo archivo.
- La presentación vive en `src/components` (un componente por bloque funcional). Los componentes `.astro` solo componen markup y props.
- La lógica de cliente vive en `src/scripts/<dominio>/`, dividida en módulos pequeños con una responsabilidad cada uno.
- Los datos y el copy viven en `src/data`. Los tipos compartidos viven en `src/types`.
- Cada módulo de comportamiento expone una función `createX`/`initX`; si registra listeners, devuelve `destroy()` para limpiarlos.
- No duplicar selectores, strings mágicos ni constantes: centralizarlos en `config.ts` o `src/data`.

### JavaScript en `.astro`

- Prohibido escribir JavaScript dentro de archivos `.astro`: no bloques `<script>` con lógica, no handlers inline `on*`, no code fences ejecutables.
- El único script permitido es un entrypoint externo sin lógica, por ejemplo `<script src="../scripts/hero/index.ts"></script>`. El código real debe estar en `.ts`.
- La interactividad debe delegarse a módulos tipados de `src/scripts`.

### Estilos

- Usar Tailwind CSS para todos los estilos nuevos.
- No agregar bloques `<style>`, archivos CSS nuevos ni reglas nuevas a `src/styles/stratum.css`.
- `src/styles/stratum.css` es legado en migración: solo se permite eliminar reglas a medida que cada componente se pasa a Tailwind.
- Al tocar un componente, migrar sus estilos a clases de Tailwind en el mismo cambio.

### Tipado

- Tipar props, datos, APIs de módulos y estado compartido.
- Evitar `any`. Para entradas externas usar `unknown` y narrowing explícito.
- Ejecutar `npm run check` y `npm run build` antes de dar una tarea por terminada.

### Código

- Preferir funciones puras y módulos pequeños. Evitar estado global mutable compartido.
- Los nombres de código van en inglés; el copy de interfaz va en español y vive en `src/data`.
- No agregar dependencias sin necesidad justificada.
