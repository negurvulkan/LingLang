# LingLang Tooling Roadmap After `1.0.x`

This document records the post-`1.0.0` TypeScript-first implementation line for LingLang.

## Direction

- TypeScript is the primary runtime and toolkit basis.
- The existing Python implementation remains the reference and test implementation.
- The runtime and tools are organized as a monorepo with separate packages.
- No new language syntax is introduced in this roadmap before the runtime line is stable.

## Milestones

### E — Reference Runtime

Primary packages:

- `@linglang/core`
- `@linglang/schemas`
- `@linglang/conformance`

Runtime scope:

- parse long syntax
- stable-core AST mapping
- schema validation
- typed reference resolution
- canonical rendering
- fixture execution hooks

### F — Query & Inspection Layer

Primary package:

- `@linglang/query`

Initial API shape:

- find blocks by type or identifier
- inspect fields and child blocks
- inspect outgoing and incoming references
- walk documents and resolved graphs

### G — Transformation & Derived Views

Primary package:

- `@linglang/views`

Initial view families:

- dictionary
- phoneme inventory
- paradigm table
- text and gloss view
- analysis and irregularity view
- reference graph view

### H — CLI

Primary package:

- `@linglang/cli`

Initial commands:

- `validate`
- `ast`
- `render`
- `fixtures run`
- `query`
- `export`

### I — Playground

Primary package:

- `@linglang/playground`

Initial layout:

- editor
- diagnostics
- AST and canonical view
- resolved reference view
- derived preview tabs

### J — Editor / Studio

Primary package:

- `@linglang/studio`

Initial capabilities:

- schema-aware snippets
- autocomplete
- inline validation
- tree and outline views
- query and fixture panels

### K — Language Services

Primary package:

- `@linglang/language-service`

Initial capabilities:

- autocomplete
- hover
- go to definition
- find references
- rename symbol
- document symbols

### L — Module / Namespace / Import Line

Handled as a later language and runtime expansion after the runtime and tooling line is stable.

## Package Graph

- `@linglang/schemas` provides typed access to the co-normative JSON tables.
- `@linglang/conformance` provides conformance levels, fixture metadata, and runtime-facing capability data.
- `@linglang/core` depends on `@linglang/schemas` and `@linglang/conformance`.
- `@linglang/query` depends on `@linglang/core`.
- `@linglang/views` depends on `@linglang/core` and `@linglang/query`.
- `@linglang/cli` depends on `@linglang/core`, `@linglang/conformance`, `@linglang/query`, and `@linglang/views`.
- `@linglang/playground`, `@linglang/studio`, and `@linglang/language-service` build on the same shared packages.

## Current Repository Baseline

This roadmap assumes and preserves:

- the stable `1.0.0` core in [spec_1.0.0-core.md](/H:/Projekte/LingLang/spec_1.0.0-core.md)
- the integrated `1.0.0` spec in [spec_1.0.0.md](/H:/Projekte/LingLang/spec_1.0.0.md)
- the co-normative JSON schema layer under [schemas/1.0.0](/H:/Projekte/LingLang/schemas/1.0.0)
- the fixture baseline under [fixtures/1.0.0](/H:/Projekte/LingLang/fixtures/1.0.0)
- the Python reference implementation under [linglang](/H:/Projekte/LingLang/linglang)
