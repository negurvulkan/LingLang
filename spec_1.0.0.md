# LingLang DSL Specification v1.0.0

Status: Stable Core with Advanced Extensions

This document defines LingLang DSL version `1.0.0` as a stable general linguistic DSL.

Version `1.0.0` consolidates the earlier `v0.x` line into a stable general core and an explicitly marked set of advanced but non-stable areas. It is not a broad new fachliche expansion. It is the release that freezes the mature baseline and makes future `1.x` evolution predictable.

The stable core is defined normatively in [spec_1.0.0-core.md](/H:/Projekte/LingLang/spec_1.0.0-core.md). This document provides the integrated full `1.0.0` view.

## 1. Purpose of `1.0.0`

`1.0.0` has three goals:

- freeze the stable general DSL core
- keep advanced specialist areas available and normative
- define explicit `1.x` compatibility expectations

`1.0.0` therefore distinguishes between:

- **Core**
- **Advanced**

Core content is stable across the `1.x` line unless a future major version changes it.

Advanced content is valid and normative, but it is not covered by the same compatibility guarantee.

## 2. Version Declaration

Conforming `1.0.0` documents should begin with:

```txt
dsl 1.0.0
```

## 3. Relationship to Earlier Versions

The `1.0.0` release incorporates the main results of the earlier versioned specifications:

- [spec_v0.1.md](/H:/Projekte/LingLang/spec_v0.1.md) for the `0.1.1` syntax baseline
- [spec_v0.2.md](/H:/Projekte/LingLang/spec_v0.2.md) for the first schema layer
- [spec_v0.3.md](/H:/Projekte/LingLang/spec_v0.3.md) for morphology and diachrony
- [spec_v0.4.md](/H:/Projekte/LingLang/spec_v0.4.md) for variation, text, and analysis
- [spec_v0.5.md](/H:/Projekte/LingLang/spec_v0.5.md) for canonical AST and short syntax
- [spec_v0.7.md](/H:/Projekte/LingLang/spec_v0.7.md) for broad advanced linguistic coverage
- [spec_v0.8.md](/H:/Projekte/LingLang/spec_v0.8.md) for irregularity and exception behavior
- [spec_v0.9.md](/H:/Projekte/LingLang/spec_v0.9.md) for pre-`1.0.0` fachliche consolidation

These earlier files remain part of the repository as historical evolution documents. They do not share final normative authority with `1.0.0`.

### 3.1 Machine-Readable Schema Tables

The integrated `1.0.0` specification is accompanied by a co-normative machine-readable schema layer in JSON:

- [core.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/core.schema-tables.json)
- [advanced.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/advanced.schema-tables.json)
- [conformance.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/conformance.schema-tables.json)

These files are intended for parser, validator, fixture, and conformance tooling. The markdown specifications remain the primary human-readable explanation layer, while the JSON tables are the primary machine-readable layer.

`1.0.0` treats the markdown and JSON layers as co-normative. If a discrepancy appears, the aligned `1.0.x` maintenance state must restore consistency explicitly.

## 4. Core Areas in `1.0.0`

The following sections are **Core** and are covered by the stable-core compatibility guarantee.

### 4.1 Core: Syntax and Document Model

The core includes:

- the `0.1.1` syntax baseline
- typed references
- canonical AST
- canonical long-form rendering expectations
- standardized short syntax for previously defined targets only

For `1.0.0`, the AST remains structurally identical to the `0.5.0` baseline. Only additive sharpening is applied. In particular:

- optional AST metadata for source spans, comments, and authoring origin may be preserved
- child blocks and inline objects remain explicitly distinct structural categories
- canonical rendering is expected to preserve AST order and render stable-core content in canonical long syntax

### 4.2 Core: General Descriptive Blocks

The core includes these general descriptive blocks:

- `language`
- `entry`
- `phonology`
- `grammar`
- `script`
- `example`
- `text`

These blocks form the minimum stable descriptive backbone of LingLang.

### 4.3 Core: Morphology and Diachrony Basis

The core includes:

- `morpheme`
- `paradigm`
- `construction`
- `soundchange`
- `etymology`
- `stage`

These are part of the stable core because they are now central to the general-purpose linguistic modeling target of LingLang.

### 4.4 Core: Variation and Analysis Baseline

The core includes:

- `dialect`
- `register`
- `phoneme`
- `analysis`

These blocks are treated as core because they are required for general linguistic description rather than only specialist profiling.

### 4.5 Core: Shared Meta-Fields and Validation Concepts

The core includes the standardized shared fields and general validation concepts used throughout the mature baseline, including:

- `status`
- `certainty`
- `notes`
- referencability
- established validation severity distinctions

### 4.6 Core: Irregularity and Exception Framework

The core includes the general irregularity framework and its specialist branches when they target core areas:

- `irregularity`
- `exception_case`
- `blocking_rule`
- `morph_irregularity`
- `paradigm_irregularity`
- `soundchange_exception`
- `construction_exception`
- `text_exception`

## 5. Advanced Areas in `1.0.0`

The following sections are **Advanced**. They remain valid and normative in `1.0.0`, but they are **not covered by the stable-core compatibility guarantee**.

### 5.1 Advanced: Corpus and Annotation

Status:

- Normative
- Advanced
- Not covered by the stable-core compatibility guarantee

Includes:

- `annotation_layer`
- `corpus_view`
- deeper alignment and multi-layer annotation structures beyond the core text baseline

### 5.2 Advanced: Sign-Language-Oriented Modeling

Status:

- Normative
- Advanced
- Not covered by the stable-core compatibility guarantee

Includes:

- `sign_unit`
- deeper nonmanual, simultaneous, and spatially anchored sign modeling

### 5.3 Advanced: Specialist Structural Profiles

Status:

- Normative
- Advanced
- Not covered by the stable-core compatibility guarantee

Includes:

- `classifier_system`
- `polysynthesis_profile`
- `template_morphology`
- other specialist system profiles that remain theoretically extensible

### 5.4 Advanced: Open-Ended Specialist Areas

Status:

- Normative
- Advanced
- Not covered by the stable-core compatibility guarantee

Includes:

- highly specialized prosodic subtheories beyond the stable baseline
- complex pragmatics beyond the stable general baseline
- other advanced specialist zones inherited from `0.7.0` through `0.9.0`

## 6. Compatibility Policy for `1.x`

### 6.1 Stable-Core Guarantee

Within the `1.x` line:

- existing stable-core syntax must remain valid
- existing stable-core AST meaning must remain stable
- existing stable-core short syntax must retain its meaning
- existing stable-core references and block semantics must not be incompatibly redefined

### 6.2 Allowed Additions

The following are allowed in later `1.x` releases:

- new optional fields in core schemas
- new advanced schemas
- additional controlled values that do not invalidate old content
- clarifying editorial refinements

### 6.3 Forbidden Breaking Changes in `1.x`

The following are not allowed without a major version:

- removing stable-core fields
- redefining stable-core field meaning
- breaking long-syntax to AST mapping
- changing the meaning of existing short syntax
- silently narrowing what counts as a valid stable-core reference target

### 6.4 Deprecation Rules

Deprecations in `1.x` must:

- be explicitly marked
- include migration guidance
- remain supported for at least one subsequent `1.x` version before removal is considered

Core deprecations should be exceptional and require especially clear migration guidance.

### 6.5 Advanced Area Evolution

Advanced areas may evolve more aggressively inside `1.x`, including:

- structural refinement
- richer internal decomposition
- tighter validation
- clearer specialist modeling

Such evolution must remain explicitly marked as applying to advanced areas only and must not weaken stable-core guarantees.

## 7. Conformance View

An implementation may claim one of two broad conformance positions:

- **Stable Core Conformance**
- **Full `1.0.0` Conformance**

Stable Core Conformance means the implementation supports the stable-core areas defined in [spec_1.0.0-core.md](/H:/Projekte/LingLang/spec_1.0.0-core.md).

Full `1.0.0` Conformance means the implementation additionally supports the advanced normative areas described here.

Implementations should state clearly which position they target.

For AST-oriented conformance, implementations should also state whether they preserve optional metadata such as:

- source spans
- comments
- origin markers for long, short, or generated source forms

These metadata capabilities are recommended but not required for stable-core conformance.

The repository maintains an initial fixture-first conformance and consistency set under:

- [fixtures/1.0.0](/H:/Projekte/LingLang/fixtures/1.0.0)
- [run_fixture_consistency.py](/H:/Projekte/LingLang/checks/run_fixture_consistency.py)

## 8. Readiness Statement for `1.0.0`

LingLang `1.0.0` is considered ready as a stable general linguistic DSL because:

- the syntax and AST baseline are frozen
- the general descriptive blocks are stable
- morphology, diachrony, variation, analysis, and irregularity now form a mature common baseline
- advanced areas remain available without forcing premature freezing of specialist domains

`1.0.0` does not mean the end of future growth. It means the end of the exploratory pre-`1.0` phase for the common general core.
