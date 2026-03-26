# AST Review for LingLang `1.0.0`

Status: Review Note

This document reviews the canonical AST defined in [spec_v0.5.md](/H:/Projekte/LingLang/spec_v0.5.md) against the stable-core scope defined in [spec_1.0.0-core.md](/H:/Projekte/LingLang/spec_1.0.0-core.md).

## Conclusion

The review outcome is:

**Only additive sharpening is needed.**

The AST from `0.5.0` remains structurally valid for the `1.0.0` core. No AST break is required. The right `1.0.0` position is therefore:

- keep the existing node model
- keep the existing long-syntax and short-syntax mapping model
- add a few clarifying metadata and normalization expectations

This is the stable and low-risk path for `1.0.0`.

## 1. What Remains Unchanged from `0.5.0`

The following parts of the `0.5.0` AST remain valid without structural change for `1.0.0`:

- the core node kinds:
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
- the basic shape distinction between document, block, field, and value nodes
- the rule that long syntax and short syntax must map to the same semantic AST
- the rule that AST rendering targets canonical long syntax rather than original authoring form
- the rule that field order and list order are semantically preserved in the AST
- the rule that typed references remain explicit and are represented as `ReferenceValue`
- the rule that inline objects remain values, not blocks
- the rule that child blocks remain blocks, not object values

For `1.0.0`, the AST from `0.5.0` should therefore be considered **still valid and still authoritative as the structural baseline**.

## 2. Small Additions That Are Sensible for `1.0.0`

No structural rewrite is needed, but a few additive clarifications are worth standardizing for `1.0.0` implementations.

### 2.1 Source and Comment Metadata

The AST should more explicitly allow optional metadata for:

- `source_span`
- `leading_comments`
- `trailing_comments`
- optional token-level or child-span precision where tooling can provide it

These should remain optional and must not be required for core conformance.

### 2.2 Origin Metadata

The AST should allow an optional node-level `origin` marker such as:

- `long`
- `short`
- `generated`

This is useful for diagnostics, formatting, and importer behavior, but it must not affect semantic interpretation.

### 2.3 Child-Block vs Inline-Object Clarification

`1.0.0` should state more explicitly:

- a `SectionBlock` or nested `EntityBlock` is always a structural child in block body order
- an `ObjectValue` is always an inline value attached to a field
- implementations must not collapse one into the other during normalization

This is especially important for `grammar`, `text`, `paradigm`, and other section-heavy structures.

### 2.4 Canonical Rendering Clarifications

The AST already roundtrips to canonical long syntax, but `1.0.0` should sharpen a few rendering defaults:

- preserve AST order exactly
- render all AST content in long syntax even if the source was short syntax
- preserve typed references in typed form
- preserve `IpaValue` as slash-delimited output
- preserve `MultilineTextValue` as triple-quoted output
- avoid introducing heuristic field reordering during rendering

These are additive clarifications, not structural AST changes.

## 3. What Explicitly Does Not Belong in the AST

To keep the `1.0.0` core stable, the AST should continue to exclude the following:

- theory-specific linguistic interpretation not explicitly encoded in the source
- inferred semantic roles, pragmatic readings, or phonological analyses that were not present in the document
- resolved inheritance, merge, or override behavior for systems not standardized in the `1.0.0` core
- parser-internal convenience nodes that are not part of the normative document model
- rendering-only style preferences such as indentation width or line-wrap choices
- evaluation or execution results of rules, derivations, sound changes, or irregularity logic
- implicit conversion of advanced specialist structures into core-only node kinds by heuristic rewriting

The AST is the structured representation of the source document, not a linguistic inference graph and not a runtime execution model.

## 4. Roundtrip and Fixture Cases the AST Must Pass

The `1.0.0` AST should be considered acceptable only if it can support at least these fixture classes.

### 4.1 Long Syntax to AST to Canonical Long Syntax

The AST must preserve:

- document version
- block order
- field order
- list order
- block typing
- identifier values
- typed references
- IPA values
- multiline text values

### 4.2 Short Syntax to AST to Canonical Long Syntax

The AST must correctly normalize supported short syntax for:

- `entry`
- `morpheme`
- `example`
- `phoneme`
- `register`

The rendered result may be canonical long syntax rather than the original short form.

### 4.3 Long and Short Syntax Equivalence

Equivalent long-form and short-form inputs must produce the same semantic AST for the same content.

This is especially important for:

- `entry`
- `morpheme`
- `example`
- `phoneme`
- `register`

### 4.4 Section-Heavy Core Blocks

The AST must preserve nested child-block structure for at least:

- `grammar`
- `text`
- `paradigm`
- `soundchange`

This is the main place where child blocks and inline objects must remain clearly distinct.

### 4.5 Core Irregularity Cases

The AST must represent stable-core irregularity structures without special-case node rewrites, including:

- `irregularity`
- `exception_case`
- `blocking_rule`
- specialized exception blocks targeting core areas

### 4.6 Diagnostics and Metadata Cases

Where tooling supports metadata, fixtures should confirm:

- source spans survive parsing
- comments can be attached without changing semantics
- origin metadata can distinguish long syntax from short syntax input
- absence of metadata does not invalidate an otherwise conforming AST

## Final Judgment

The canonical AST from `0.5.0` is still valid for the stable `1.0.0` core.

The recommended `1.0.0` stance is:

- **no structural AST break**
- **small additive sharpening only**
- **treat `0.5.0` as the continuing structural baseline for `1.0.0`**
