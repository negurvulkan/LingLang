# `@linglang/playground`

This package now contains a usable static HTML/CSS/JS playground at [index.html](/H:/Projekte/LingLang/packages/playground/index.html).

Current capabilities:

- LingLang long-syntax editor
- sample loading and local file import
- browser-side parsing and validation
- strict and lenient validation modes
- diagnostics panel
- AST view
- canonical long rendering
- block and reference inspection
- basic derived views
- schema browser with live or fallback schema tables

Recommended local run:

1. start a static server from the repository root with `npm run playground:start`
2. open `http://localhost:4173/packages/playground/index.html`

If the app is opened directly from disk, it still works in fallback mode, but live schema fetches may not be available depending on browser policy.
