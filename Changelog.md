# Changelog

All notable changes to this project will be documented in this file.

The project uses Semantic Versioning.

## [1.0.6] - 2026-03-26

### Added

- new PHP application under [LingLang Suite](/H:/Projekte/LingLang/LingLang%20Suite) with dashboard, project hub, generator, workbench, analysis, presentation, and source views
- file-first suite persistence through [ProjectRepository.php](/H:/Projekte/LingLang/LingLang%20Suite/app/Infrastructure/Storage/ProjectRepository.php)
- generator service for creating starter language projects and dialect variants in [GeneratorService.php](/H:/Projekte/LingLang/LingLang%20Suite/app/Service/GeneratorService.php)
- analysis service that reuses the Python reference validator when available and falls back to structural inspection in [AnalysisService.php](/H:/Projekte/LingLang/LingLang%20Suite/app/Service/AnalysisService.php)
- presentation service for dictionary, grammar, text, and dialect views in [PresentationService.php](/H:/Projekte/LingLang/LingLang%20Suite/app/Service/PresentationService.php)
- AI-provider abstraction with safe null-provider defaults under [app/Service/Ai](/H:/Projekte/LingLang/LingLang%20Suite/app/Service/Ai)
- suite templates, Bootstrap-based styling, and lightweight JS assets for a usable browser UI
- starter demo project under [storage/projects/demo-taren](/H:/Projekte/LingLang/LingLang%20Suite/storage/projects/demo-taren)

### Changed

- updated [README.md](/H:/Projekte/LingLang/README.md) to surface the new PHP suite alongside the existing playground and tooling layers
- expanded [LingLang Suite/README.md](/H:/Projekte/LingLang/LingLang%20Suite/README.md) with run instructions, routes, and architecture notes

### Notes

- the suite is already usable without Composer through a lightweight in-repo fallback runtime
- `composer.json` remains aligned with the intended Slim + Smarty dependency-based stack for the next phase

## [1.0.5] - 2026-03-26

### Added

- new static HTML/CSS/JS playground at [packages/playground/index.html](/H:/Projekte/LingLang/packages/playground/index.html)
- browser-side long-syntax parsing, validation, canonical rendering, block inspection, and derived views in [packages/playground/app.js](/H:/Projekte/LingLang/packages/playground/app.js)
- dedicated playground styling in [packages/playground/styles.css](/H:/Projekte/LingLang/packages/playground/styles.css)
- root helper script `npm run playground:start` for serving the repo locally
- strict and lenient validation modes inside the playground UI

### Changed

- updated [packages/playground/src/README.md](/H:/Projekte/LingLang/packages/playground/src/README.md) from placeholder text to usage guidance
- updated [README.md](/H:/Projekte/LingLang/README.md) to surface the new usable web application
- changed the playground package checks to validate the browser app JavaScript directly

### Notes

- the playground is currently static and browser-side; it does not yet reuse the future TS runtime package implementation
- when opened directly from disk, the app falls back gracefully if live schema fetches are blocked by browser policy

## [1.0.4] - 2026-03-26

### Added

- new JS/TS workspace root in [package.json](/H:/Projekte/LingLang/package.json) and [tsconfig.base.json](/H:/Projekte/LingLang/tsconfig.base.json)
- new [tooling_roadmap_1.x.md](/H:/Projekte/LingLang/tooling_roadmap_1.x.md) documenting Milestones E-L and the package graph
- first scaffold packages for `@linglang/schemas`, `@linglang/conformance`, `@linglang/core`, `@linglang/query`, `@linglang/views`, `@linglang/cli`, `@linglang/playground`, `@linglang/studio`, and `@linglang/language-service`
- typed TS access to the `1.0.0` schema and conformance JSON tables
- explicit public API contracts for the future runtime, query, views, CLI, and language-service layers

### Changed

- updated [README.md](/H:/Projekte/LingLang/README.md) to describe the new TypeScript-first tooling line alongside the Python reference implementation
- repositioned the repository focus from parser-only consolidation toward a broader runtime and developer-toolkit line

### Notes

- `1.0.4` scaffolds the TS monorepo and public interfaces but does not yet port the Python parser or validator into TypeScript
- the Python implementation remains the executable reference runtime for now

## [1.0.3] - 2026-03-26

### Added

- dependency-free Python reference validator under [linglang](/H:/Projekte/LingLang/linglang)
- hand-written long-syntax lexer and parser producing the stable `1.0.0` AST shape
- schema-driven validation against [core.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/core.schema-tables.json) and [advanced.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/advanced.schema-tables.json)
- canonical long-syntax renderer and `roundtrip` CLI entry point
- new [run_validator_fixture_checks.py](/H:/Projekte/LingLang/checks/run_validator_fixture_checks.py) for assertion-based validator fixture checks

### Changed

- updated [README.md](/H:/Projekte/LingLang/README.md) to document the reference validator and its CLI entry points
- connected the existing `1.0.0` fixture baseline to executable validator checks

### Notes

- `1.0.3` validates long syntax only; short syntax remains deferred
- reference resolution is currently document-local
- unresolved typed references currently surface as warnings, while invalid target types are errors

## [1.0.2] - 2026-03-26

### Added

- new fixture-first conformance set under [fixtures/1.0.0](/H:/Projekte/LingLang/fixtures/1.0.0)
- grouped valid and invalid core fixtures covering all stable-core blocks
- grouped valid and invalid advanced fixtures covering all advanced block tables
- conformance fixtures for AST node kinds, short syntax targets, metadata capabilities, rendering rules, and doc-vs-JSON checks
- new [run_fixture_consistency.py](/H:/Projekte/LingLang/checks/run_fixture_consistency.py) for manifest and schema-table consistency checks

### Changed

- linked the `1.0.0` conformance statements to the repository fixture baseline
- updated [README.md](/H:/Projekte/LingLang/README.md) to surface fixtures and the consistency runner

### Notes

- `1.0.2` still does not add a full LingLang parser or AST roundtrip harness
- the fixture set is assertion-oriented and consistency-focused by design

## [1.0.1] - 2026-03-26

### Added

- new machine-readable schema tables under [schemas/1.0.0](/H:/Projekte/LingLang/schemas/1.0.0)
- [core.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/core.schema-tables.json) for stable-core block schemas
- [advanced.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/advanced.schema-tables.json) for advanced normative areas
- [conformance.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/conformance.schema-tables.json) for AST, short syntax, rendering, and conformance data

### Changed

- anchored the `1.0.0` markdown specifications to a co-normative JSON schema layer
- documented the machine-readable layer in [README.md](/H:/Projekte/LingLang/README.md)

### Notes

- `1.0.1` does not change the DSL version frozen by `1.0.0`
- the JSON files are co-normative with the prose specifications and are intended for tooling consumption

## [1.0.0] - 2026-03-26

### Added

- new [spec_1.0.0-core.md](/H:/Projekte/LingLang/spec_1.0.0-core.md) defining the stable `1.0.0` core
- new [spec_1.0.0.md](/H:/Projekte/LingLang/spec_1.0.0.md) integrating stable core and advanced normative areas into the first `1.0.0` release
- an explicit `1.x` stability, compatibility, and deprecation policy
- a formal distinction between stable-core and advanced-but-non-stable normative areas

### Changed

- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect `1.0.0` as the newest stable specification
- shifted the repository from pre-`1.0` consolidation to post-`1.0` stabilization and tooling preparation
- sharpened the `1.0.0` AST position additively without introducing a structural AST break

### Notes

- `1.0.0` is a stabilization release, not a new breadth expansion
- advanced areas remain valid and normative, but they are not covered by the stable-core compatibility guarantee
- the canonical AST from `0.5.0` remains valid for `1.0.0`, with only additive clarification around metadata, child blocks, and canonical rendering

## [0.9.0] - 2026-03-26

### Added

- new [spec_v0.9.md](/H:/Projekte/LingLang/spec_v0.9.md) defining the fachliche consolidation before `1.0.0`
- refined sign-language modeling, prosodic structure, annotation anchoring, and specialist profile behavior
- an explicit readiness statement for `1.0.0`

### Changed

- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect `0.9.0` as the newest specification
- shifted the roadmap from large fachliche expansion toward final stabilization for `1.0.0`

### Notes

- `0.9.0` is a fachlicher consolidation release, not a new breadth expansion
- `0.9.0` is intended to make `1.0.0` plausible as a stable general DSL core

## [0.8.0] - 2026-03-26

### Added

- new [spec_v0.8.md](/H:/Projekte/LingLang/spec_v0.8.md) defining the irregularity and exception expansion
- a general irregularity core with `irregularity`, `exception_case`, and `blocking_rule`
- specialized exception schemas for morphology, paradigms, sound change, constructions, and text evidence
- explicit priority and conflict rules for regular patterns, exceptions, and blocking behavior

### Changed

- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect `0.8.0` as the newest specification
- extended the roadmap from broad fachliche coverage toward technically consolidating the now richer DSL

### Notes

- `0.8.0` is a fachlicher refinement release focused on formalizing irregularity rather than adding a completely new linguistic domain
- `0.8.0` still does not standardize parser execution or automatic derivation behavior

## [0.7.0] - 2026-03-26

### Added

- new [spec_v0.7.md](/H:/Projekte/LingLang/spec_v0.7.md) defining the advanced linguistic coverage expansion
- normative schemas for `semantic_domain`, `sense`, `semantic_role`, `pragmatic_profile`, `prosody`, `annotation_layer`, and `corpus_view`
- directly standardized specialist schemas for `sign_unit`, `classifier_system`, `switch_reference`, `template_morphology`, and `polysynthesis_profile`
- refined integration hooks for existing blocks such as `entry`, `construction`, `phonology`, `text`, `analysis`, and `grammar`

### Changed

- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect `0.7.0` as the newest specification
- shifted the roadmap toward technical consolidation after broad fachliche coverage

### Notes

- `0.7.0` is a large fachlicher Ausbau intended to close most remaining general linguistic coverage gaps
- `0.7.0` does not yet standardize modules, parser implementations, or full query-oriented corpus mechanics

## [0.5.0] - 2026-03-26

### Added

- new [spec_v0.5.md](/H:/Projekte/LingLang/spec_v0.5.md) defining the canonical AST and normative short syntax
- a canonical internal model for all currently standardized block types
- normative short syntax for common `entry`, `morpheme`, `example`, `phoneme`, and `register` patterns
- mapping and roundtrip rules connecting long syntax, short syntax, AST, and canonical long-form rendering

### Changed

- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect `0.5.0` as the newest specification
- shifted the roadmap focus from missing schema coverage toward DSL-internal tooling foundations

### Notes

- `0.5.0` is a minor release focused on DSL-internal consolidation rather than new linguistic domain coverage
- `0.5.0` still does not standardize modules, namespaces, or advanced override semantics

## [0.4.0] - 2026-03-26

### Added

- new [spec_v0.4.md](/H:/Projekte/LingLang/spec_v0.4.md) defining the variation, evidence, and analysis expansion
- normative schemas for `dialect`, `register`, `phoneme`, `text`, and `analysis`
- richer linking between variation, text evidence, phonological inventories, and explicit interpretation
- a combined `0.4.0` example tying dialect, register, phoneme inventory, text evidence, and analysis together

### Changed

- refined the existing `language`, `entry`, `phonology`, `script`, `example`, and `construction` schemas for stronger integration with the new `0.4.0` layer
- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect `0.4.0` as the newest specification

### Notes

- `0.4.0` is a minor release that broadens the DSL into variation, pragmatics, text evidence, and explicit competing analysis while preserving the `0.1.1` syntax baseline
- `0.4.0` extends the prior schema layers rather than replacing them

## [0.3.0] - 2026-03-26

### Added

- new [spec_v0.3.md](/H:/Projekte/LingLang/spec_v0.3.md) defining the morphology and diachrony expansion
- normative schemas for `morpheme`, `paradigm`, `construction`, `soundchange`, `etymology`, and `stage`
- richer validation and examples for paradigms, constructions, sound changes, and etymology paths
- a combined `0.3.0` example tying language, stage, phonology, grammar, lexicon, and diachrony together

### Changed

- refined the existing `language`, `entry`, `phonology`, `example`, and `grammar` schemas for stronger cross-block linking
- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect `0.3.0` as the newest specification

### Notes

- `0.3.0` is a minor release that expands the DSL into morphology and historical modeling while preserving the `0.1.1` syntax baseline
- `0.3.0` keeps `0.2.0` as the base schema layer and extends it rather than replacing it
## [0.2.0] - 2026-03-26

### Added

- new [spec_v0.2.md](/H:/Projekte/LingLang/spec_v0.2.md) defining the first normative domain schemas
- normative schema profiles for `language`, `entry`, `phonology`, `example`, `script`, and `grammar`
- controlled starter values for `status`, `certainty`, and `pos`
- schema validation scenarios and a full `0.2.0` example document

### Changed

- documented the separation between core syntax and core schemas
- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect `0.2.0` as the newest specification

### Notes

- `0.2.0` is the first minor release that expands the DSL beyond syntax clarification into normative domain modeling
- `0.2.0` reuses the `0.1.1` syntax baseline rather than redefining the EBNF in a second file

## [0.1.1] - 2026-03-26

### Added

- normative EBNF grammar in [spec_v0.1.md](/H:/Projekte/LingLang/spec_v0.1.md)
- grammar notes clarifying tokenization and syntax boundaries
- negative syntax examples for parser-facing validation cases

### Changed

- raised the core specification version in [spec_v0.1.md](/H:/Projekte/LingLang/spec_v0.1.md) from `0.1.0` to `0.1.1`
- clarified that the EBNF and aligned prose together define the canonical `0.1.1` surface syntax
- updated [README.md](/H:/Projekte/LingLang/README.md) to reflect the `0.1.1` clarification release

### Notes

- `0.1.1` is a patch-level clarification release and is not intended to introduce breaking syntax changes

## [0.1.0] - 2026-03-26

### Added

- initial formal core specification in [spec_v0.1.md](/H:/Projekte/LingLang/spec_v0.1.md)
- initial repository overview in [README.md](/H:/Projekte/LingLang/README.md)
- contributor and agent working conventions in [AGENTS.md](/H:/Projekte/LingLang/AGENTS.md)

### Notes

- version `0.1.0` defines the LingLang DSL core syntax as a draft specification
- future changes should continue to be versioned using Semantic Versioning
