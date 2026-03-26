# LingLang DSL Core Specification v1.0.0

Status: Stable

This document defines the stable core of LingLang DSL version `1.0.0`.

Version `1.0.0` is a stabilization release. It does not introduce a new broad fachliche expansion. Instead, it freezes the mature general DSL core that emerged across `0.1.1`, `0.5.0`, `0.8.0`, and `0.9.0`.

The `1.0.0` core defines what conforming implementations may rely on as stable throughout the `1.x` line.

## 1. Purpose of the Stable Core

The stable core exists to guarantee a dependable baseline for:

- parsing
- validation
- reference resolution
- AST mapping
- canonical long-form rendering
- general linguistic description across the main common domains

The stable core is intentionally narrower than the full LingLang body of advanced schemas. Advanced areas remain valid and normative in `1.0.0`, but they are not covered by the same compatibility guarantee.

## 2. Version Declaration

Conforming `1.0.0` documents should begin with:

```txt
dsl 1.0.0
```

## Machine-Readable Schema Tables

LingLang `1.0.0` additionally defines a co-normative machine-readable schema layer in JSON:

- [core.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/core.schema-tables.json)
- [advanced.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/advanced.schema-tables.json)
- [conformance.schema-tables.json](/H:/Projekte/LingLang/schemas/1.0.0/conformance.schema-tables.json)

These JSON files do not replace the prose specification. They are the primary machine-readable layer for schema-aware tooling.

The `1.0.0` core remains defined by the aligned markdown and JSON layers together. If a mismatch is discovered, the current `1.0.x` maintenance state must bring both representations back into alignment explicitly rather than silently privileging one over the other.

## 3. Stable Core Contents

The following areas are part of the stable `1.0.0` core.

### 3.1 Surface Syntax

The stable core includes the syntax baseline defined in `0.1.1`, including:

- document structure
- tokens and lexical classes
- comments and whitespace handling
- block syntax
- field syntax
- scalar, list, object, reference, IPA, and multi-line value forms
- the normative EBNF and aligned prose rules

### 3.2 Typed References

The stable core includes the typed reference model, including:

- typed references of the form `<type>:<id>`
- referenceability of addressable blocks
- normative expectations for type-safe target resolution
- reference-based linking across core entities

### 3.3 Canonical AST

The stable core includes the canonical AST layer defined in `0.5.0`, including:

- `Document`
- `VersionDecl`
- `EntityBlock`
- `SectionBlock`
- `Field`
- `ScalarValue`
- `ListValue`
- `ObjectValue`
- `ReferenceValue`
- `IpaValue`
- `MultilineTextValue`

The stable core also includes the normative mapping rules from long syntax to AST and from AST to semantically equivalent canonical long syntax.

#### Additive `1.0.0` AST sharpening

`1.0.0` does not replace or restructure the `0.5.0` AST. It sharpens it additively in the following ways:

- optional source and comment metadata are explicitly allowed on AST nodes
- optional origin metadata is explicitly allowed for distinguishing long syntax, short syntax, and generated nodes
- child blocks and inline objects are explicitly distinguished as different structural categories
- canonical rendering rules are slightly sharpened for stable-core roundtripping

These additions do not change the required node kinds or their semantic roles.

#### Optional AST metadata

Where tooling can provide it, AST nodes may additionally carry:

- `source_span`
- `leading_comments`
- `trailing_comments`
- `origin`

`origin`, if present, should use values such as:

- `long`
- `short`
- `generated`

These metadata fields are optional and must not be required for stable-core conformance.

#### Structural distinction between child blocks and inline objects

For `1.0.0`, the following distinction is normative:

- `SectionBlock` and nested `EntityBlock` are structural child nodes in block body order
- `ObjectValue` is an inline field value and is not a block
- normalization and rendering must not collapse child blocks into inline objects
- normalization and rendering must not rewrite inline objects into child blocks

This distinction is especially important for section-heavy stable-core blocks such as `grammar`, `text`, `paradigm`, and `soundchange`.

#### Minimal canonical rendering rules

In addition to the `0.5.0` baseline, stable-core canonical rendering should:

- preserve AST order exactly
- render all content in canonical long syntax
- preserve typed references in typed form
- render `IpaValue` using slash delimiters
- render `MultilineTextValue` using triple quotes
- avoid heuristic field reordering

The renderer is not required to preserve the original authoring form if the source used short syntax.

### 3.4 Short Syntax

The stable core includes only the short-syntax targets already normatively defined in `0.5.0`.

No new short-syntax targets are introduced or implied by `1.0.0`.

The stable short-syntax scope covers:

- `entry`
- `morpheme`
- `example`
- `phoneme`
- `register`

### 3.5 Core Domain Blocks

The following block types are part of the stable core:

- `language`
- `entry`
- `phonology`
- `grammar`
- `script`
- `example`
- `text`
- `morpheme`
- `paradigm`
- `construction`
- `soundchange`
- `etymology`
- `stage`
- `dialect`
- `register`
- `phoneme`
- `analysis`

### 3.6 Irregularity and Exception Core

The stable core includes the general irregularity framework from `0.8.0`, including:

- `irregularity`
- `exception_case`
- `blocking_rule`

It also includes the specialized exception blocks when they target stable-core domains:

- `morph_irregularity`
- `paradigm_irregularity`
- `soundchange_exception`
- `construction_exception`
- `text_exception`

### 3.7 Shared Meta-Structure

The stable core includes the shared meta-fields and validation concepts used across core schemas, including:

- `status`
- `certainty`
- `notes`
- block identity and referencability
- error, warning, info, and note style validation levels where already standardized

## 4. Explicitly Non-Core but Still Valid in `1.0.0`

The following areas remain valid and normative in the full `1.0.0` specification, but they are not part of the stable core guarantee:

- `corpus_view`
- `annotation_layer`
- `sign_unit`
- `classifier_system`
- `polysynthesis_profile`
- `template_morphology`
- highly specialized prosodic theories beyond the core baseline
- complex pragmatics beyond the stable general baseline
- other advanced or still-open specialist areas inherited from `0.7.0` to `0.9.0`

These areas are not removed. They remain part of LingLang, but implementations must not assume they are frozen to the same degree as the stable core.

## 5. Stability Guarantees for `1.x`

### 5.1 Guaranteed Stable Across `1.x`

The following must not change incompatibly within the `1.x` line:

- the meaning of stable-core syntax
- the meaning of stable-core AST node types
- the meaning of stable-core reference forms
- the meaning of already standardized stable-core short syntax
- the interpretation of stable-core block types and their established field roles

### 5.2 Allowed Additive Changes in `1.x`

The following changes are allowed in `1.x` if they do not invalidate existing conforming `1.0.0` core content:

- adding optional fields to core schemas
- adding new advanced schemas
- adding new controlled values where old values remain valid
- clarifying prose without changing established interpretation

### 5.3 Changes Requiring a Major Version

The following require a future major version:

- removing or redefining stable-core fields
- breaking AST mapping for existing valid content
- changing the meaning of existing short syntax
- changing the stable meaning of typed references
- reclassifying an advanced construct as mandatory core behavior in a way that breaks existing `1.0.0` assumptions

### 5.4 Deprecation Policy

Deprecations in `1.x` must follow these rules:

- a deprecated feature must be explicitly marked as deprecated
- a deprecated feature must include migration guidance
- deprecations should survive at least one subsequent `1.x` release before removal is considered
- stable-core deprecations should be rare and require especially clear migration notes

### 5.5 Advanced Area Policy

Advanced areas remain normative, but they are not covered by the stable-core compatibility guarantee.

Within `1.x`, advanced areas may be:

- further clarified
- structurally refined
- extended with richer substructure
- reorganized for precision

Such changes should remain explicit and must not silently redefine stable-core behavior.

## 6. Minimal Core Conformance Statement

A conforming stable-core implementation for `1.0.0` must:

- parse the stable `1.0.0` surface syntax
- recognize stable-core block types and value forms
- preserve the stable mapping into the canonical AST
- support typed references across stable-core targets
- preserve the semantics of standardized stable-core short syntax
- distinguish stable-core behavior from advanced-but-non-stable areas

Where fixture testing is used, a conforming implementation should also be able to demonstrate:

- long syntax to AST to canonical long syntax roundtrip
- short syntax to AST to canonical long syntax roundtrip for supported targets
- semantic AST equivalence between matching long-form and short-form inputs
- preservation of child-block structure in section-heavy stable-core blocks

The repository fixture baseline for this purpose is maintained under:

- [fixtures/1.0.0](/H:/Projekte/LingLang/fixtures/1.0.0)
- [run_fixture_consistency.py](/H:/Projekte/LingLang/checks/run_fixture_consistency.py)

Optional metadata such as spans, comments, and origin markers may be present, but their absence must not invalidate an otherwise conforming stable-core AST.

## 7. Historical Position

This stable core consolidates earlier layers but does not split normative authority across the old files.

Earlier versioned specifications remain useful as historical development documents:

- `0.1.1` for syntax clarification
- `0.5.0` for AST and short syntax
- `0.8.0` for irregularity
- `0.9.0` for pre-`1.0.0` fachliche consolidation

In case of conflict, the `1.0.0` core statement in this file is authoritative for the stable core.
