# Like Animals — INWED 2026

Landing interactiva one-pager para el **Día Internacional de la Mujer en la Ingeniería (23 de junio)**.

## Stack

- **Vite** — bundler / dev server
- **GSAP + ScrollTrigger** — animaciones de scroll y parallax
- **Three.js** — escena 3D de partículas reactivas
- HTML5, CSS3, JavaScript ES6+ (sin frameworks pesados)

## Instalación local

```bash
npm install
npm run dev
```

Se abre automáticamente en `http://localhost:5173`.

## Build para producción

```bash
npm run build
npm run preview
```

## Deploy a Vercel / Netlify

1. `npm run build` genera la carpeta `dist/`
2. Subila directamente o conectá el repo:

### Vercel
```bash
npx vercel --prod
```
(Detecta Vite automáticamente)

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`

## Personalización

Buscá los placeholders `[EDITAME ...]` y `[TU MENSAJE ...]` en el HTML.
Editá variables de color en `src/styles/variables.css`.

## Estructura

```
like-animals/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── styles/
    │   ├── main.css
    │   └── variables.css
    ├── scripts/
    │   ├── main.js
    │   ├── terminal.js
    │   ├── parallax.js
    │   ├── scene3d.js
    │   └── mockApi.js
    └── assets/
```
