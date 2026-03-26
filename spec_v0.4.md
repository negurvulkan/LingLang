# LingLang DSL Specification v0.4.0

Status: Draft

This document defines version `0.4.0` of the LingLang DSL. Version `0.4.0` keeps the syntax baseline from `0.1.1`, builds on the core schemas introduced in `0.2.0`, extends the morphology and diachrony layer from `0.3.0`, and adds the first normative schemas for variation, evidence, and explicit analysis.

Version `0.4.0` standardizes:

- the `0.1.1` core syntax baseline
- the `0.2.0` core schema layer
- the `0.3.0` morphology and diachrony layer
- new normative schemas for `dialect`, `register`, `phoneme`, `text`, and `analysis`
- stronger cross-linking between language, phonology, script, entry, example, construction, and text
- a first normative treatment of variation, pragmatics, evidence, and competing interpretations

Version `0.4.0` does not yet standardize:

- a canonical AST
- a reference parser
- formal short syntax
- a full corpus query model
- complete prosodic, autosegmental, or sign-language-specific submodels

## 1. Layer Model

The LingLang DSL now has four normative layers:

- **Core Syntax**: the textual language defined by `0.1.1`
- **Core Schemas**: the first object schemas defined by `0.2.0`
- **Extended Core Schemas**: morphology and diachrony defined by `0.3.0`
- **Variation, Evidence, and Analysis Layer**: variation, social meaning, segment inventories, text evidence, and explicit interpretation defined by `0.4.0`

`0.4.0` reuses the syntax definition in [spec_v0.1.md](/H:/Projekte/LingLang/spec_v0.1.md) and the schema principles established in [spec_v0.2.md](/H:/Projekte/LingLang/spec_v0.2.md) and [spec_v0.3.md](/H:/Projekte/LingLang/spec_v0.3.md).

## 2. Version Declaration

Conforming `0.4.0` documents should begin with:

```txt
dsl 0.4.0
```

## 3. Cross-Cutting Conventions

### 3.1 Validation Classes

Schema-aware tooling should distinguish:

- **Schema error**: missing required content, invalid field type, invalid child block, disallowed field
- **Reference error**: unresolved reference or invalid target type
- **Domain warning**: structurally valid but semantically underspecified, theoretically ambiguous, or unusually incomplete

### 3.2 Cross-Cutting Metadata

The following metadata fields remain cross-cutting but only where a block schema explicitly allows them:

- `name`
- `label`
- `status`
- `certainty`
- `notes`
- `tags`
- `source`
- `sources`
- `based_on`

### 3.3 Controlled Values

`0.4.0` retains the starter sets introduced earlier and adds controlled starter sets for `register.scope` and `phoneme.class`.

`certainty`:

- `low`
- `medium`
- `high`

`status`:

- `living`
- `historical`
- `reconstructed`
- `planned`
- `deprecated`

`pos`:

- `noun`
- `verb`
- `adjective`
- `adverb`
- `pronoun`
- `particle`
- `adposition`
- `conjunction`
- `interjection`
- `numeral`
- `determiner`

`morpheme.type`:

- `root`
- `prefix`
- `suffix`
- `infix`
- `circumfix`
- `clitic`
- `particle`

`register.scope`:

- `formal`
- `informal`
- `ritual`
- `literary`
- `colloquial`
- `honorific`
- `technical`

`phoneme.class`:

- `vowel`
- `consonant`
- `glide`
- `tone`

Implementations may allow additional atoms but should emit a domain warning when a non-standard atom is used in a standardized field.

## 4. Relationship to Earlier Specs

`0.4.0` inherits all earlier syntax and schema layers. When this document refines a previously standardized block, the `0.4.0` interpretation takes precedence for `0.4.0` documents.

## 5. Existing Schemas Refined in `0.4.0`

This section records only normative refinements added on top of `0.3.0`.

## 5.1 `language` Refinements

### New optional fields

- `registers`: list of `register` references
- `default_dialect`: reference to `dialect`

### Additional validation

- `registers`, if present, must contain only `register` references
- `default_dialect`, if present, must target `dialect`
- tooling should distinguish clearly between `dialects`, `stages`, and `registers`

## 5.2 `entry` Refinements

### New optional fields

- `registers`: list of `register` references

### Additional validation

- `registers`, if present, must contain only `register` references
- tooling should warn when a register distinction is encoded only as a loose tag while a `register` object exists

## 5.3 `phonology` Refinements

### New optional fields

- `phonemes`: list of `phoneme` references

### Additional validation

- `phonemes`, if present, must contain only `phoneme` references

## 5.4 `script` Refinements

### Refined interpretation

- `grapheme.*.phoneme` now normatively prefers a `phoneme` reference over a fallback string when a phoneme inventory is modeled

### Additional validation

- `grapheme.*.phoneme`, if given as a reference, must target `phoneme`

## 5.5 `example` Refinements

### New optional fields

- `dialect`: reference to `dialect`
- `register`: reference to `register`
- `text`: reference to `text`

### Additional validation

- `dialect`, if present, must target `dialect`
- `register`, if present, must target `register`
- `text`, if present, must target `text`

## 5.6 `construction` Refinements

### New optional fields

- `register`: reference to `register`

### Additional validation

- `register`, if present, must target `register`

## 5.7 `text` and `analysis` as Linking Anchors

In `0.4.0`, `text` acts as the normative anchor for longer evidence, and `analysis` acts as the normative anchor for explicit alternative interpretations. Existing blocks may reference them where the schema allows.

## 6. New Normative Schemas

## 6.1 `dialect`

### Purpose

The `dialect` block defines an addressable regional, social, or internally differentiated variety linked to a language anchor or another dialect.

### Required fields

- `name`: string

### Optional fields

- `language`: reference to `language`
- `based_on`: reference to `dialect` or `language`
- `regions`: list of strings or atoms
- `status`: atom
- `phonology`: reference to `phonology`
- `grammar`: reference to `grammar`
- `registers`: list of `register` references
- `lexicon_notes`: string or multi-line text
- `notes`: string or multi-line text
- `certainty`: atom
- `source`: object or string
- `sources`: list

### Disallowed fields

- `pos`
- `translation`

### Reference targets

- `language` -> `language`
- `based_on` -> `dialect` or `language`
- `phonology` -> `phonology`
- `grammar` -> `grammar`
- `registers` -> `register`

### Minimal validation

- `name` is required
- `language`, if present, must target `language`
- `based_on`, if present, must target `dialect` or `language`
- `phonology`, if present, must target `phonology`
- `grammar`, if present, must target `grammar`
- `registers`, if present, must contain only `register` references

### Minimal example

```txt
dialect north_taren {
  name: "North Taren"
}
```

### Standard example

```txt
dialect north_taren {
  name: "North Taren"
  language: language:taren
  regions: ["North Coast"]
}
```

### Extended example

```txt
dialect north_taren {
  name: "North Taren"
  language: language:taren
  based_on: language:taren
  regions: ["North Coast"]
  phonology: phonology:north_taren_core
  grammar: grammar:north_taren_grammar
  registers: [register:formal_north]
}
```

### Invalid examples

Missing `name`:

```txt
dialect north_taren {
  language: language:taren
}
```

Wrong `registers` target:

```txt
dialect north_taren {
  name: "North Taren"
  registers: [entry:varu]
}
```

## 6.2 `register`

### Purpose

The `register` block defines a social, stylistic, interactional, or discourse-conditioned variety layer.

### Required fields

At least one of:

- `name`: string
- `label`: string

### Optional fields

- `name`: string
- `label`: string
- `based_on`: reference to `register`, `language`, or `dialect`
- `scope`: atom
- `social_meaning`: string or multi-line text
- `politeness`: atom or string
- `used_in`: list of `language`, `dialect`, `entry`, `construction`, or `text` references
- `status`: atom
- `certainty`: atom
- `notes`: string or multi-line text
- `source`: object or string
- `sources`: list

### Disallowed fields

- `ipa`
- `translation`

### Reference targets

- `based_on` -> `register`, `language`, or `dialect`
- `used_in` -> `language`, `dialect`, `entry`, `construction`, or `text`

### Minimal validation

- at least one of `name` or `label` is required
- `based_on`, if present, must target `register`, `language`, or `dialect`
- `used_in`, if present, must contain only allowed reference types
- `scope`, if present, should use the controlled starter set

### Minimal example

```txt
register formal_taren {
  name: "Formal Taren"
}
```

### Standard example

```txt
register formal_taren {
  name: "Formal Taren"
  scope: formal
  used_in: [language:taren]
}
```

### Extended example

```txt
register formal_taren {
  name: "Formal Taren"
  based_on: language:taren
  scope: honorific
  social_meaning: "Used in elevated address and ceremonial contexts."
  used_in: [language:taren, construction:basic_clause]
}
```

### Invalid examples

Missing `name` and `label`:

```txt
register formal_taren {
  scope: formal
}
```

Wrong `used_in` target:

```txt
register formal_taren {
  name: "Formal Taren"
  used_in: [soundchange:proto_to_old]
}
```

## 6.3 `phoneme`

### Purpose

The `phoneme` block defines a segmental or tone-level phonological unit inside an inventory.

### Required fields

- `symbol`: string or IPA literal

### Optional fields

- `class`: atom
- `features`: list of atoms or strings
- `allophones`: list of strings, IPA literals, or references
- `distribution`: string or multi-line text
- `phonology`: reference to `phonology`
- `notes`: string or multi-line text
- `certainty`: atom

### Disallowed fields

- `translation`
- `pos`

### Reference targets

- `phonology` -> `phonology`
- `allophones` -> optionally `phoneme`

### Minimal validation

- `symbol` is required
- `phonology`, if present, must target `phonology`
- `class`, if present, should use the controlled starter set
- `allophones`, if present, may contain strings, IPA literals, or `phoneme` references

### Minimal example

```txt
phoneme a {
  symbol: /a/
}
```

### Standard example

```txt
phoneme t {
  symbol: /t/
  class: consonant
  features: [alveolar, voiceless, stop]
}
```

### Extended example

```txt
phoneme n {
  symbol: /n/
  class: consonant
  features: [alveolar, nasal, voiced]
  allophones: ["[n]", "[N]"]
  distribution: "Before velars, [N] is common."
  phonology: phonology:taren_core
}
```

### Invalid examples

Missing `symbol`:

```txt
phoneme n {
  class: consonant
}
```

Wrong `phonology` target:

```txt
phoneme n {
  symbol: /n/
  phonology: entry:varu
}
```

## 6.4 `text`

### Purpose

The `text` block defines a longer linguistic witness such as a sentence cluster, short narrative, dialogue, inscription, ritual text, or parallel text.

### Required content

At least one of:

- `content`: string or multi-line text
- one or more `segment <id>` child blocks

### Optional fields

- `content`: string or multi-line text
- `language`: reference to `language`
- `stage`: reference to `stage`
- `dialect`: reference to `dialect`
- `register`: reference to `register`
- `translation`: string or multi-line text
- `parallel`: list of `text` references
- `notes`: string or multi-line text
- `tags`: list of atoms or strings
- `source`: object or string
- `sources`: list

### Optional child blocks

- `segment <id>`
- `translation_block`
- `annotation`

Each `segment` block may contain:

- `surface`: string
- `morph`: string
- `gloss`: string
- `translation`: string
- `uses`: list of `entry`, `morpheme`, `construction`, or `analysis` references

The `translation_block` section may contain translation variants.

The `annotation` section may contain scalar descriptive metadata and analysis anchors.

### Disallowed fields

- `pos`
- `ipa`

### Reference targets

- `language` -> `language`
- `stage` -> `stage`
- `dialect` -> `dialect`
- `register` -> `register`
- `parallel` -> `text`
- `segment.*.uses` -> `entry`, `morpheme`, `construction`, or `analysis`

### Minimal validation

- at least one of `content` or `segment` is required
- `language`, `stage`, `dialect`, and `register`, if present, must target the correct type
- `parallel`, if present, must contain only `text` references
- each `segment` must have an identifier

### Minimal example

```txt
text tx1 {
  content: "Ka varu."
}
```

### Standard example

```txt
text tx1 {
  content: """
Ka varu.
Ka tiral varu.
"""
  translation: "I drink. I drink water."
  language: language:taren
}
```

### Extended example

```txt
text tx1 {
  language: language:taren
  stage: stage:old_taren
  register: register:formal_taren

  segment s1 {
    surface: "Ka varu."
    morph: "Ka | varu"
    gloss: "1SG | drink"
    translation: "I drink."
    uses: [entry:varu, analysis:varu_main]
  }

  translation_block {
    literal: "I drink."
    idiomatic: "I am drinking."
  }
}
```

### Invalid examples

Missing `content` and segments:

```txt
text tx1 {
  language: language:taren
}
```

Wrong `parallel` target:

```txt
text tx1 {
  content: "Ka varu."
  parallel: [entry:varu]
}
```

## 6.5 `analysis`

### Purpose

The `analysis` block defines an explicit interpretive claim about a target object, including competing or theory-specific alternatives.

### Required fields

- `target`: reference

### Optional fields

- `interpretation`: atom or string
- `claim`: string or multi-line text
- `theory`: string or atom
- `status`: atom
- `certainty`: atom
- `competes_with`: list of `analysis` references
- `supports`: list of references
- `notes`: string or multi-line text
- `source`: object or string
- `sources`: list

### Disallowed fields

- `translation`
- `ipa`

### Reference targets

- `target` -> any addressable LingLang object
- `competes_with` -> `analysis`
- `supports` -> any addressable LingLang object

### Minimal validation

- `target` is required
- `competes_with`, if present, must contain only `analysis` references
- `supports`, if present, must contain only references
- tooling should warn when an `analysis` block gives neither `interpretation` nor `claim`

### Minimal example

```txt
analysis ren_as_suffix {
  target: morpheme:-ren
}
```

### Standard example

```txt
analysis ren_as_suffix {
  target: morpheme:-ren
  interpretation: suffix
  claim: "The marker behaves as a suffix in the productive possessive pattern."
}
```

### Extended example

```txt
analysis ren_as_clitic {
  target: morpheme:-ren
  interpretation: clitic
  theory: "morphosyntactic clitic analysis"
  claim: "The form attaches outside the lexical stem in several peripheral constructions."
  competes_with: [analysis:ren_as_suffix]
  supports: [text:tx1, construction:basic_clause]
}
```

### Invalid examples

Missing `target`:

```txt
analysis ren_as_suffix {
  interpretation: suffix
}
```

Wrong `competes_with` target:

```txt
analysis ren_as_suffix {
  target: morpheme:-ren
  competes_with: [entry:varu]
}
```

## 7. Combined Example

```txt
dsl 0.4.0

language taren {
  name: "Taren"
  status: living
  dialects: [dialect:north_taren]
  registers: [register:formal_taren]
  default_dialect: dialect:north_taren
}

dialect north_taren {
  name: "North Taren"
  language: language:taren
  regions: ["North Coast"]
}

register formal_taren {
  name: "Formal Taren"
  scope: formal
  used_in: [language:taren]
}

phonology taren_core {
  vowels: /a e i o u/
  consonants: /p t k m n s l r/
  phonemes: [phoneme:a, phoneme:t, phoneme:n]
}

phoneme a {
  symbol: /a/
  class: vowel
  phonology: phonology:taren_core
}

phoneme t {
  symbol: /t/
  class: consonant
  phonology: phonology:taren_core
}

phoneme n {
  symbol: /n/
  class: consonant
  allophones: ["[n]", "[N]"]
  phonology: phonology:taren_core
}

construction basic_clause {
  pattern: "Subject Object Verb"
  register: register:formal_taren
}

entry varu {
  pos: verb
  gloss: "to drink"
  registers: [register:formal_taren]
}

analysis varu_main {
  target: entry:varu
  interpretation: lexical_entry
  claim: "This entry represents the main verbal lexeme for 'drink'."
}

text tx1 {
  language: language:taren
  dialect: dialect:north_taren
  register: register:formal_taren

  segment s1 {
    surface: "Ka varu."
    morph: "Ka | varu"
    gloss: "1SG | drink"
    translation: "I drink."
    uses: [entry:varu, analysis:varu_main]
  }
}

example ex1 {
  surface: "Ka varu."
  translation: "I drink."
  dialect: dialect:north_taren
  register: register:formal_taren
  text: text:tx1
}
```

## 8. Conformance

A `0.4.0` schema-aware implementation conforms if it:

- accepts the `0.1.1` syntax baseline
- validates the `0.2.0`, `0.3.0`, and `0.4.0` schema layers
- applies the refined field and reference rules for previously standardized block types
- distinguishes schema errors, reference errors, and domain warnings

A `0.4.0` document conforms if it:

- declares `dsl 0.4.0`
- uses valid core syntax
- uses standardized block types according to their `0.4.0` schema rules when those block types appear

## 9. Future Directions

Likely next steps after `0.4.0`:

- canonical AST design
- parser fixtures and machine-readable schema tables
- formal short syntax
- more specialized prosodic, corpus, and modality-specific extensions
