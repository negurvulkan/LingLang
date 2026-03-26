# LingLang

LingLang is a project for designing a general linguistic DSL for describing languages, language stages, dialects, lexica, phonologies, scripts, grammar, examples, and historical developments in a way that is both pleasant to write and reliable to process.

## Example

A minimal LingLang document describing a small fragment of a language:

```txt
dsl 1.0.0

language example_lang {
  name: "Example Language"
  family: "Constructed"
  status: draft
  scripts: [script:latin]
}

phonology core {
  vowels: "/a e i o u/"
  consonants: "/p t k m n s l r/"
  syllable: "(C)V(C)"
}

entry varu {
  pos: verb
  gloss: "to drink"
  ipa: /va.ru/
}

entry tiral {
  pos: noun
  gloss: "water"
  ipa: /ti.ral/
}

example ex1 {
  surface: "Varu tiral."
  morph: "varu | tiral"
  gloss: "drink | water"
  translation: "Drink water."
  uses: [entry:varu, entry:tiral]
}
```

This example already demonstrates several core principles:

* human-readable source
* structured blocks with typed fields
* typed references between objects (`entry:varu`)
* separation of phonology, lexicon, and usage examples
* renderability into glossed examples and dictionary-style views

## What LingLang Covers

LingLang is designed to model languages as structured, interconnected systems rather than isolated notes. The DSL covers most major areas of linguistics:

### Core Coverage

* **Language metadata**

  * languages, stages, dialects, registers
* **Phonology**

  * phoneme inventories, syllable structure, allophony
* **Lexicon**

  * entries, meanings, IPA, semantic fields
* **Grammar**

  * categories, constructions, agreement, word order
* **Morphology**

  * morphemes, paradigms, derivation, inflection
* **Examples and texts**

  * glossed examples, segmented texts, usage contexts
* **Scripts and orthography**

  * graphemes, writing systems, orthographic rules

### Extended Coverage

* **Diachrony**

  * stages, sound changes, etymology
* **Variation**

  * dialects, registers, sociolinguistic variation
* **Analysis layer**

  * competing interpretations, explicit analyses
* **Irregularities**

  * exceptions, blocking rules, non-regular behavior
* **Uncertainty**

  * partial knowledge, alternative reconstructions

### Structural Features

* **Typed references**

  * explicit links between linguistic objects
* **Canonical AST model**

  * stable internal representation for tooling
* **Schema-driven validation**

  * machine-readable rules for all blocks
* **Short and long syntax**

  * ergonomic writing vs. canonical representation
* **Conformance levels**

  * stable core vs. extensible advanced features

## What This Enables

Because LingLang combines structured data with a readable syntax, it can be used as:

* a **documentation format** for languages
* a **generation base** for conlang tools
* an **analysis model** for linguistic inspection
* a **render source** for dictionaries, grammars, and glosses
* an **exchange format** between tools and systems

## Current Status

The repository currently contains the pre-`1.0` evolution line plus the first stable `1.0.0` release:

- [spec_1.0.0-core.md](spec_1.0.0-core.md): the stable `1.0.0` core definition
- [spec_1.0.0.md](spec_1.0.0.md): the integrated `1.0.0` specification with core and advanced areas
- [spec_v0.1.md](spec_v0.1.md): the `0.1.1` core syntax baseline with normative EBNF
- [spec_v0.2.md](spec_v0.2.md): the `0.2.0` schema-layer expansion for the first normative domain blocks
- [spec_v0.3.md](spec_v0.3.md): the `0.3.0` morphology and diachrony expansion
- [spec_v0.4.md](spec_v0.4.md): the `0.4.0` variation, evidence, and analysis expansion
- [spec_v0.5.md](spec_v0.5.md): the `0.5.0` model and short-syntax expansion
- [spec_v0.7.md](spec_v0.7.md): the `0.7.0` advanced linguistic coverage expansion
- [spec_v0.8.md](spec_v0.8.md): the `0.8.0` irregularity and exception expansion
- [spec_v0.9.md](spec_v0.9.md): the `0.9.0` fachliche consolidation before `1.0.0`

The current newest spec version is `1.0.0`.

Version `1.0.0` freezes the stable general DSL core and keeps advanced areas available as normative but not stability-guaranteed extensions.

## Goals

- human-readable source files
- structurally parseable syntax
- typed references between linguistic objects
- support for uncertainty and competing analyses
- a stable core with room for linguistic extensions
- renderability into dictionaries, paradigms, glosses, and other views

## Repository Files

- [spec_1.0.0-core.md](spec_1.0.0-core.md): stable core specification for DSL version `1.0.0`
- [spec_1.0.0.md](spec_1.0.0.md): integrated full specification for DSL version `1.0.0`
- [core.schema-tables.json](schemas/1.0.0/core.schema-tables.json): machine-readable core schema tables for `1.0.0`
- [advanced.schema-tables.json](schemas/1.0.0/advanced.schema-tables.json): machine-readable advanced schema tables for `1.0.0`
- [conformance.schema-tables.json](schemas/1.0.0/conformance.schema-tables.json): machine-readable AST and conformance tables for `1.0.0`
- [fixtures/1.0.0/README.md](fixtures/1.0.0/README.md): fixture-first conformance and consistency set for `1.0.0`
- [run_fixture_consistency.py](checks/run_fixture_consistency.py): consistency runner for manifests, schema coverage, and conformance metadata
- [linglang/cli.py](linglang/cli.py): dependency-free reference CLI for validation and long-syntax roundtripping
- [run_validator_fixture_checks.py](checks/run_validator_fixture_checks.py): validator fixture runner against assertion-based expected diagnostics
- [tooling_roadmap_1.x.md](tooling_roadmap_1.x.md): TypeScript-first roadmap and package graph for Milestones E-L
- [package.json](package.json): JS/TS workspace root for the new monorepo line
- [packages/playground/index.html](packages/playground/index.html): usable static web playground for editing, validating, and inspecting LingLang documents
- [LingLang Suite/README.md](LingLang%20Suite/README.md): PHP-based suite application for generation, workbench editing, analysis, and presentation
- [spec_v0.1.md](spec_v0.1.md): formal core syntax specification for DSL version `0.1.1`
- [spec_v0.2.md](spec_v0.2.md): first normative domain-schema specification for DSL version `0.2.0`
- [spec_v0.3.md](spec_v0.3.md): morphology and diachrony schema specification for DSL version `0.3.0`
- [spec_v0.4.md](spec_v0.4.md): variation, evidence, and analysis schema specification for DSL version `0.4.0`
- [spec_v0.5.md](spec_v0.5.md): canonical AST and short-syntax specification for DSL version `0.5.0`
- [spec_v0.7.md](spec_v0.7.md): advanced linguistic coverage specification for DSL version `0.7.0`
- [spec_v0.8.md](spec_v0.8.md): irregularity and exception specification for DSL version `0.8.0`
- [spec_v0.9.md](spec_v0.9.md): fachliche consolidation specification for DSL version `0.9.0`
- [Changelog.md](Changelog.md): version history using Semantic Versioning
- [AGENTS.md](AGENTS.md): working conventions for future contributors and coding agents

## Machine-Readable Layer

LingLang `1.0.0` includes a co-normative machine-readable schema layer in JSON under [schemas/1.0.0](schemas/1.0.0).

Recommended reading order:

1. [spec_1.0.0-core.md](spec_1.0.0-core.md)
2. [spec_1.0.0.md](spec_1.0.0.md)
3. [core.schema-tables.json](schemas/1.0.0/core.schema-tables.json)
4. [advanced.schema-tables.json](schemas/1.0.0/advanced.schema-tables.json)
5. [conformance.schema-tables.json](schemas/1.0.0/conformance.schema-tables.json)
6. [fixtures/1.0.0/README.md](fixtures/1.0.0/README.md)

The markdown documents remain the primary explanation layer for humans. The JSON files are the primary schema layer for tooling.

## Reference Validator

The repository now includes a dependency-free Python reference validator under [linglang](linglang).

Current supported implementation scope:

- long syntax only
- stable core validation
- advanced validation through the same schema-driven engine
- document-local typed reference checks
- canonical long-syntax rendering from AST

Useful entry points:

- `python -m linglang.cli validate <path>`
- `python -m linglang.cli validate <path> --scope full --format json`
- `python -m linglang.cli roundtrip <path>`
- `python checks/run_fixture_consistency.py`
- `python checks/run_validator_fixture_checks.py`

## TypeScript Toolkit Line

The repository now also contains the first scaffold for the TypeScript-first tooling line described in [tooling_roadmap_1.x.md](tooling_roadmap_1.x.md).

Current workspace packages:

- `@linglang/schemas`: typed access to the co-normative JSON schema tables
- `@linglang/conformance`: conformance metadata, levels, and runtime capability helpers
- `@linglang/core`: public runtime contracts for parse, validate, resolve, render, and roundtrip
- `@linglang/query`: planned inspection and reference-graph API surface
- `@linglang/views`: planned derived-view API surface
- `@linglang/cli`: planned Node CLI package
- `@linglang/playground`: reserved web playground package
- `@linglang/studio`: reserved editor/studio package
- `@linglang/language-service`: planned language-service package

This workspace is intentionally scaffold-first. The Python implementation remains the executable reference today, while the JS/TS line now has explicit package boundaries and public API contracts.

The playground package is already usable as a static browser app:

- start a local server from the repo root with `npm run playground:start`
- open `http://localhost:4173/packages/playground/index.html`
- switch between `lenient` authoring mode and `strict` norm-checking mode inside the app

## Versioning

This project uses Semantic Versioning.

- `MAJOR`: breaking changes to syntax or interpretation
- `MINOR`: backward-compatible additions
- `PATCH`: editorial fixes and non-breaking clarifications

## Current Focus

- maintain the stable `1.0.0` core
- keep advanced areas available without freezing them prematurely
- build out the new TypeScript-first runtime and toolkit line on top of the stable core

## Next Suggested Steps

- implement Milestone E in `@linglang/core` on top of the existing `1.0.0` schemas and conformance tables
- port the current Python reference behavior into the TS runtime incrementally
- keep expanding fixture coverage so both Python and TS lines can be checked against the same baseline
- evolve the current static playground into the fuller Milestone I browser toolkit
- defer modules, namespaces, and imports until the runtime/query/tooling line is stable
