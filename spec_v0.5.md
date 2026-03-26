# LingLang DSL Specification v0.5.0

Status: Draft

This document defines version `0.5.0` of the LingLang DSL. Version `0.5.0` keeps the syntax and schema layers introduced in `0.1.1` through `0.4.0` and adds two major DSL-internal capabilities:

- a canonical abstract syntax tree (AST)
- a normative short syntax as a second authoring form

Version `0.5.0` standardizes:

- the `0.1.1` core syntax baseline
- the schema layers introduced in `0.2.0`, `0.3.0`, and `0.4.0`
- a canonical AST for all currently standardized block types
- a normative short syntax for common authoring patterns
- mapping rules from long syntax to AST
- mapping rules from short syntax to AST
- minimum roundtrip rules from AST back to canonical long syntax

Version `0.5.0` does not yet standardize:

- a reference parser implementation
- an import or module system
- namespaces or scoped symbol resolution beyond existing typed references
- advanced inheritance merge semantics
- a formatter beyond the minimum canonical long-form rendering rules

## 1. Layer Model

The LingLang DSL now has five normative layers:

- **Core Syntax**: the textual language defined by `0.1.1`
- **Core Schemas**: the first object schemas defined by `0.2.0`
- **Extended Core Schemas**: morphology and diachrony defined by `0.3.0`
- **Variation, Evidence, and Analysis Layer**: defined by `0.4.0`
- **Model and Authoring Layer**: canonical AST plus normative short syntax defined by `0.5.0`

`0.5.0` does not replace the earlier syntax and schema documents. It defines how all currently standardized surface forms map to a shared internal model.

## 2. Version Declaration

Conforming `0.5.0` documents should begin with:

```txt
dsl 0.5.0
```

## 3. Canonical AST

## 3.1 Purpose

The canonical AST is the normative internal representation for LingLang documents. Both long syntax and short syntax must map to this structure without loss of semantic content.

The AST is intentionally syntax-neutral and theory-neutral. It represents document structure, values, references, and source mapping, not linguistic interpretation beyond what the source already encodes.

## 3.2 Core Node Types

The canonical AST must provide at least the following node kinds:

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

Implementations may introduce additional helper nodes internally, but conformance is defined against the minimum node set in this section.

## 3.3 Node Shapes

### `Document`

Required properties:

- `kind: "Document"`
- `version`: `VersionDecl`
- `blocks`: ordered list of block nodes

Optional properties:

- `comments`
- `source_span`

### `VersionDecl`

Required properties:

- `kind: "VersionDecl"`
- `value`: semantic version string

Optional properties:

- `source_span`

### `EntityBlock`

Required properties:

- `kind: "EntityBlock"`
- `block_type`: string
- `identifier`: string
- `body`: ordered list of `Field` or `SectionBlock` or nested `EntityBlock`

Optional properties:

- `source_span`
- `leading_comments`
- `trailing_comments`

### `SectionBlock`

Required properties:

- `kind: "SectionBlock"`
- `block_type`: string
- `body`: ordered list of `Field` or `SectionBlock` or nested `EntityBlock`

Optional properties:

- `source_span`
- `leading_comments`
- `trailing_comments`

### `Field`

Required properties:

- `kind: "Field"`
- `name`: string
- `value`: value node

Optional properties:

- `source_span`
- `leading_comments`
- `trailing_comments`

### `ScalarValue`

Required properties:

- `kind: "ScalarValue"`
- `scalar_type`: one of `atom`, `string`, `number`, `boolean`, `null`
- `value`

Optional properties:

- `source_span`

### `ListValue`

Required properties:

- `kind: "ListValue"`
- `items`: ordered list of value nodes

Optional properties:

- `source_span`

### `ObjectValue`

Required properties:

- `kind: "ObjectValue"`
- `fields`: ordered list of `Field`

Optional properties:

- `source_span`

### `ReferenceValue`

Required properties:

- `kind: "ReferenceValue"`
- `target_type`: string
- `target_id`: string

Optional properties:

- `source_span`

### `IpaValue`

Required properties:

- `kind: "IpaValue"`
- `value`: string

Optional properties:

- `source_span`

### `MultilineTextValue`

Required properties:

- `kind: "MultilineTextValue"`
- `value`: string

Optional properties:

- `source_span`

## 3.4 AST Metadata Requirements

Conforming AST-producing tooling should preserve:

- block type
- block identifier where applicable
- field order
- list item order
- source positions for diagnostics

Comment preservation is a normative optional goal in `0.5.0`:

- tooling may preserve comments in dedicated metadata structures
- failure to preserve comments does not break `0.5.0` conformance

## 3.5 Standardized Block Coverage

The AST must be able to represent all currently standardized block types:

- `language`
- `script`
- `phonology`
- `grammar`
- `entry`
- `example`
- `morpheme`
- `paradigm`
- `construction`
- `soundchange`
- `etymology`
- `stage`
- `dialect`
- `register`
- `phoneme`
- `text`
- `analysis`

## 4. Mapping from Long Syntax to AST

Long syntax maps directly to the canonical AST using the `0.1.1` grammar and the schema layers from `0.2.0` through `0.4.0`.

Rules:

- every top-level entity block becomes an `EntityBlock`
- every named or unnamed nested section becomes a `SectionBlock`
- every key-value pair becomes a `Field`
- atoms, strings, numbers, booleans, and nulls become `ScalarValue`
- slash-delimited forms become `IpaValue`
- triple-quoted text becomes `MultilineTextValue`
- typed references become `ReferenceValue`
- lists become `ListValue`
- inline objects become `ObjectValue`

## 5. Normative Short Syntax

## 5.1 Purpose

Short syntax is a second normative authoring layer for common, repetitive linguistic records. It is designed for fast writing while remaining losslessly mappable to the canonical AST.

Short syntax is not a replacement for long syntax. It is allowed only where the mapping to AST is explicit and deterministic.

## 5.2 General Rule

Every short-syntax construct expands to exactly one canonical long-form target shape and therefore to exactly one AST shape.

If a construct would require guessing:

- field identity
- target type
- nesting level
- block kind

then it is not valid short syntax in `0.5.0`.

## 5.3 Supported Short-Syntax Targets

`0.5.0` standardizes short syntax for:

- `entry`
- `morpheme`
- `example`
- `phoneme`
- `register`

Other block types remain long-form only in `0.5.0`.

## 5.4 Short-Syntax Tokens

The following token prefixes are normative in short syntax:

- `%` for controlled category-like atoms such as `pos`, `type`, or `scope`
- `?` for gloss-like or translation-like human-readable text payloads
- `$` for IPA-like payloads
- `=` for derivational or usage reference lists
- `@` for explicit typed references or anchor references when required by the short form

Whitespace separates short-syntax tokens.

## 5.5 `entry` Short Syntax

Form:

```txt
<id> %<pos> ?<gloss> [$<ipa>] [=<ref_plus_ref_plus_ref>]
```

Example:

```txt
varu %verb ?to_drink $/va.ru/
```

Expanded long form:

```txt
entry varu {
  pos: verb
  gloss: "to_drink"
  ipa: /va.ru/
}
```

If `=` is present, each segment must resolve to an `entry` or `morpheme` reference.

Example:

```txt
tiralulta %noun ?sea_water $/ti.ra.lul.ta/ =entry:tiral+entry:ulta
```

## 5.6 `morpheme` Short Syntax

Form:

```txt
<id> %<type> ?<gloss> [$<ipa>]
```

Example:

```txt
-ren %suffix ?POSS
```

Expanded long form:

```txt
morpheme -ren {
  type: suffix
  gloss: POSS
}
```

## 5.7 `example` Short Syntax

Form:

```txt
<id> ?<surface> => ?<translation>
```

Minimal example:

```txt
ex1 ?Ka_varu. => ?I_drink.
```

Expanded long form:

```txt
example ex1 {
  surface: "Ka_varu."
  translation: "I_drink."
}
```

Extended example with optional glossing payload:

```txt
ex2 ?Ka_tiral_varu. | ?Ka_|_tiral_|_varu | ?1SG_|_water_|_drink => ?I_drink_water.
```

Expanded long form:

```txt
example ex2 {
  surface: "Ka_tiral_varu."
  morph: "Ka_|_tiral_|_varu"
  gloss: "1SG_|_water_|_drink"
  translation: "I_drink_water."
}
```

## 5.8 `phoneme` Short Syntax

Form:

```txt
<id> $<ipa> [%<class>]
```

Example:

```txt
t $/t/ %consonant
```

Expanded long form:

```txt
phoneme t {
  symbol: /t/
  class: consonant
}
```

## 5.9 `register` Short Syntax

Form:

```txt
<id> ?<name> [%<scope>]
```

Example:

```txt
formal_taren ?Formal_Taren %formal
```

Expanded long form:

```txt
register formal_taren {
  name: "Formal_Taren"
  scope: formal
}
```

## 5.10 Unsupported in Short Syntax

The following remain long-form only in `0.5.0`:

- nested section-heavy blocks such as `grammar`, `script`, `text`, `soundchange`, and `paradigm`
- any construct requiring ambiguous inline nesting
- any construct requiring optional field names that cannot be inferred uniquely

## 6. Mapping from Short Syntax to AST

Short syntax maps to AST in two steps:

1. Parse short-syntax tokens into a canonical long-form block shape.
2. Map that long-form block shape into the canonical AST using the long-form rules.

This expansion is normative. Implementations may skip the intermediate materialization step internally, but must behave as if it occurred.

## 7. Canonical Long-Form Rendering

AST to long-form rendering must obey these minimum rules:

- emit `dsl <version>` first
- render all blocks using long syntax
- preserve semantic field content exactly
- preserve block and field ordering as stored in the AST
- render references using typed form `<type>:<id>`
- render multiline text using triple quotes when the AST node type is `MultilineTextValue`
- render IPA using slash delimiters when the AST node type is `IpaValue`

Implementations are not required to preserve the original authoring form. A short-syntax source may roundtrip into canonical long syntax.

## 8. Diagnostic Model

`0.5.0` does not introduce a new diagnostic class hierarchy, but it sharpens where diagnostics arise:

- parse diagnostics belong to long or short syntax parsing
- AST construction diagnostics belong to malformed syntactic structures
- schema diagnostics remain governed by the `0.2.0` through `0.4.0` schema layers

Conforming tooling should be able to point diagnostics at:

- document level
- block level
- field level
- token span or source span where available

## 9. Test and Conformance Fixtures

`0.5.0` recommends that future tooling maintain fixtures for:

- one minimal valid AST example for every standardized block type
- every core value kind
- long-form to AST mapping
- short-form to AST mapping
- long-form and short-form equivalence for the same semantic content
- negative short-syntax cases involving ambiguity or missing required components

Fixture files are not standardized in `0.5.0`, but the existence of a conformance fixture suite is now a normative future requirement.

## 10. Examples

### 10.1 Long Syntax to AST Example

```txt
dsl 0.5.0

entry varu {
  pos: verb
  gloss: "to_drink"
  ipa: /va.ru/
}
```

AST outline:

```txt
Document
  VersionDecl("0.5.0")
  EntityBlock(type="entry", id="varu")
    Field("pos", ScalarValue(atom, "verb"))
    Field("gloss", ScalarValue(string, "to_drink"))
    Field("ipa", IpaValue("va.ru"))
```

### 10.2 Short Syntax to AST Example

```txt
dsl 0.5.0

varu %verb ?to_drink $/va.ru/
```

Canonical long-form expansion:

```txt
entry varu {
  pos: verb
  gloss: "to_drink"
  ipa: /va.ru/
}
```

### 10.3 Negative Short-Syntax Examples

Ambiguous missing target type in derivation:

```txt
tiralulta %noun ?sea_water =tiral+ulta
```

This is invalid in `0.5.0` because the derivational references are not explicitly typed.

Invalid `example` short syntax with missing translation:

```txt
ex1 ?Ka_varu.
```

Invalid `phoneme` short syntax without IPA token:

```txt
t %consonant
```

## 11. Conformance

A `0.5.0` model-aware implementation conforms if it:

- accepts the `0.1.1` syntax baseline
- accepts the schema layers from `0.2.0`, `0.3.0`, and `0.4.0`
- produces a canonical AST conforming to this document
- supports the standardized short syntax defined in this document
- maps both long and short syntax losslessly to the same semantic AST

A `0.5.0` document conforms if it:

- declares `dsl 0.5.0`
- uses valid long syntax or valid standardized short syntax
- uses standardized block types according to their earlier schema rules where those types appear

## 12. Future Directions

Likely next steps after `0.5.0`:

- import and module systems
- namespaces and scoped symbol resolution
- richer inheritance and override semantics
- parser fixtures and machine-readable schema tables
- optional formatter conventions
