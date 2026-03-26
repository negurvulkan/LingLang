# LingLang DSL Specification v0.3.0

Status: Draft

This document defines version `0.3.0` of the LingLang DSL. Version `0.3.0` keeps the core syntax baseline from `0.1.1`, builds on the core schemas introduced in `0.2.0`, and adds the first normative morphology and diachrony schemas.

Version `0.3.0` standardizes:

- the `0.1.1` core syntax baseline
- the `0.2.0` core schema layer
- new normative schemas for `morpheme`, `paradigm`, `construction`, `soundchange`, `etymology`, and `stage`
- tighter integration between lexical, grammatical, phonological, and historical blocks
- richer child-block structures for paradigms and sound changes
- extended cross-block reference rules for morphology and diachrony

Version `0.3.0` does not yet standardize:

- a canonical AST
- a reference parser
- formal short syntax
- corpus annotation layers
- full schemas for `dialect`, `register`, `phoneme`, `text`, or `analysis`

## 1. Layer Model

The LingLang DSL now consists of three normative layers:

- **Core Syntax**: the textual and token-level language defined by `0.1.1`
- **Core Schemas**: the first standardized object schemas defined by `0.2.0`
- **Extended Core Schemas**: richer object schemas for morphology, constructions, and diachrony defined by `0.3.0`

`0.3.0` does not replace the syntax definition in [spec_v0.1.md](/H:/Projekte/LingLang/spec_v0.1.md). It reuses it and adds additional schema-level rules.

## 2. Version Declaration

Conforming `0.3.0` documents should begin with:

```txt
dsl 0.3.0
```

## 3. Cross-Cutting Conventions

### 3.1 Validation Classes

Schema-aware tooling should distinguish:

- **Schema error**: wrong structure, missing required fields, wrong value type, invalid child-block type
- **Reference error**: unresolved reference or invalid target type
- **Domain warning**: structurally valid but incomplete, theoretically ambiguous, or unusually underspecified

### 3.2 Cross-Cutting Metadata

The following metadata fields remain cross-cutting but only where the block schema explicitly allows them:

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

`0.3.0` retains the `0.2.0` starter sets for `status`, `certainty`, and `pos` and adds a controlled starter set for `morpheme.type`.

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

Implementations may allow additional atoms but should emit a domain warning when a non-standard atom is used in a standardized field.

## 4. Relationship to Earlier Specs

`0.3.0` inherits the syntax baseline from `0.1.1` and the core schemas from `0.2.0`. When this document sharpens a previously standardized block, the `0.3.0` version of that block takes precedence for `0.3.0` documents.

## 5. Existing Schemas Refined in `0.3.0`

This section records only the normative refinements added on top of `0.2.0`.

## 5.1 `language` Refinements

### New optional fields

- `stages`: list of `stage` references
- `default_register`: reference to `register`

### Refined interpretation

- `periods` remains a descriptive list of labels or intervals
- `stages` is the normative field for addressable historical or synchronic stage objects
- `dialects` remains for varieties parallel to the language anchor rather than chronological stages

### Additional validation

- `stages`, if present, must contain only `stage` references
- tooling should warn when both `periods` and `stages` are used inconsistently, for example when a stage-like object is encoded only as free text in `periods`

## 5.2 `entry` Refinements

### New optional fields

- `morphemes`: list of `morpheme` references
- `paradigm`: reference to `paradigm`
- `stage`: reference to `stage`

### Refined interpretation

- `derived_from` models synchronic or lexical compositional derivation
- `etymology` models diachronic origin or development history
- `morphemes` lists current structural parts without claiming etymological direction

### Additional validation

- `morphemes`, if present, must contain only `morpheme` references
- `paradigm`, if present, must target `paradigm`
- `stage`, if present, must target `stage`

## 5.3 `phonology` Refinements

### New optional fields

- `stage`: reference to `stage`
- `affected_by`: list of `soundchange` references

### Additional validation

- `stage`, if present, must target `stage`
- `affected_by`, if present, must contain only `soundchange` references

## 5.4 `example` Refinements

### New optional fields

- `stage`: reference to `stage`

### Refined interpretation

- `uses` may explicitly include `construction` references in `0.3.0`

### Additional validation

- `stage`, if present, must target `stage`
- `uses`, if present, may target `entry`, `morpheme`, `construction`, or `language`

## 5.5 `grammar` Refinements

### New optional fields

- `constructions`: list of `construction` references
- `paradigms`: list of `paradigm` references

### Additional validation

- `constructions`, if present, must contain only `construction` references
- `paradigms`, if present, must contain only `paradigm` references

## 5.6 `script` Refinements

No major structural changes are introduced in `0.3.0`. Implementations may continue to treat `script` as a lighter-weight schema focused on graphemes and orthographic description.

## 6. New Normative Schemas

## 6.1 `morpheme`

### Purpose

The `morpheme` block defines a free or bound morphological unit used in lexical structure, inflection, derivation, or cliticization.

### Required fields

At least one of:

- `type`: atom
- `gloss`: string or atom

### Optional fields

- `type`: atom
- `gloss`: string or atom
- `function`: string or atom
- `ipa`: IPA literal
- `allomorphs`: list of strings, IPA literals, or `morpheme` references
- `combines_with`: list of `morpheme`, `entry`, or `register` references
- `etymology`: reference to `etymology`
- `status`: atom
- `certainty`: atom
- `notes`: string or multi-line text
- `tags`: list of strings or atoms
- `source`: object or string
- `sources`: list

### Disallowed fields

- `translation`
- `scripts`

### Reference targets

- `allomorphs` -> optionally `morpheme`
- `combines_with` -> `morpheme`, `entry`, or `register`
- `etymology` -> `etymology`

### Minimal validation

- at least one of `type` or `gloss` is required
- `type`, if present, should use the controlled starter set
- `ipa`, if present, must be an IPA literal
- `combines_with`, if present, must contain only allowed reference types
- `etymology`, if present, must target `etymology`

### Minimal example

```txt
morpheme -ren {
  type: suffix
}
```

### Standard example

```txt
morpheme -ren {
  type: suffix
  gloss: POSS
  function: possessive
}
```

### Extended example

```txt
morpheme -ren {
  type: suffix
  gloss: POSS
  function: possessive
  allomorphs: ["-ren", "-r"]
  combines_with: [entry:ka, morpheme:-ta]
  certainty: high
}
```

### Invalid examples

Missing both `type` and `gloss`:

```txt
morpheme -ren {
  function: possessive
}
```

Wrong `etymology` target:

```txt
morpheme -ren {
  type: suffix
  etymology: entry:varu
}
```

## 6.2 `paradigm`

### Purpose

The `paradigm` block defines a structured set of inflectional, agreement, or form-distribution cells.

### Required fields

- `dimensions`: list of atoms or strings

### Optional fields

- `applies_to`: reference to `entry`, `morpheme`, `pos`, or `grammar`
- `notes`: string or multi-line text
- `based_on`: reference to `paradigm`
- `status`: atom
- `certainty`: atom

### Required or optional child blocks

- zero or more `row <id>` child blocks

Each `row` block may contain:

- `label`: string or atom
- one or more cell fields keyed by dimension values or composite labels

### Disallowed fields

- `ipa`
- `translation`

### Reference targets

- `applies_to` -> `entry`, `morpheme`, `grammar`
- `based_on` -> `paradigm`

### Minimal validation

- `dimensions` is required
- `dimensions` must be a list
- each `row` block must have an identifier
- a paradigm with no `row` blocks is valid but should emit a domain warning

### Minimal example

```txt
paradigm pronoun_case {
  dimensions: [person, case]
}
```

### Standard example

```txt
paradigm pronoun_case {
  dimensions: [person, case]

  row first_singular {
    label: first_singular
    nominative: ka
    accusative: kar
  }
}
```

### Extended example

```txt
paradigm pronoun_case {
  dimensions: [person, case]
  applies_to: grammar:taren_grammar

  row first_singular {
    label: first_singular
    nominative: ka
    accusative: kar
    genitive: ka-ren
  }

  row second_singular {
    label: second_singular
    nominative: ta
    accusative: tar
    genitive: ta-ren
  }
}
```

### Invalid examples

Missing `dimensions`:

```txt
paradigm pronoun_case {
  row first_singular {
    nominative: ka
  }
}
```

Wrong `based_on` target:

```txt
paradigm pronoun_case {
  dimensions: [person, case]
  based_on: entry:varu
}
```

## 6.3 `construction`

### Purpose

The `construction` block models reusable syntactic, morphosyntactic, or discourse patterns.

### Required fields

At least one of:

- `pattern`: string
- `base`: reference to `construction`

### Optional fields

- `pattern`: string
- `base`: reference to `construction`
- `marking`: atom or string
- `category`: atom or string
- `uses`: list of `entry`, `morpheme`, `construction`, or `grammar` references
- `notes`: string or multi-line text
- `status`: atom
- `certainty`: atom

### Optional child blocks

- `constraints`

The `constraints` section may contain scalar fields expressing construction-level conditions.

### Disallowed fields

- `ipa`
- `translation`

### Reference targets

- `base` -> `construction`
- `uses` -> `entry`, `morpheme`, `construction`, or `grammar`

### Minimal validation

- at least one of `pattern` or `base` is required
- `base`, if present, must target `construction`
- `constraints`, if present, must be a section block
- `uses`, if present, must contain only allowed reference types

### Minimal example

```txt
construction basic_clause {
  pattern: "Subject Object Verb"
}
```

### Standard example

```txt
construction basic_clause {
  pattern: "Subject Object Verb"

  constraints {
    object_optional: true
  }
}
```

### Extended example

```txt
construction polar_question {
  base: construction:basic_clause
  marking: final_particle
  category: question
  uses: [grammar:taren_grammar]

  constraints {
    particle: "na"
  }
}
```

### Invalid examples

Missing `pattern` and `base`:

```txt
construction polar_question {
  marking: final_particle
}
```

Wrong `base` target:

```txt
construction polar_question {
  base: entry:varu
}
```

## 6.4 `soundchange`

### Purpose

The `soundchange` block models diachronic change sets between stages, languages, or named phonological states.

### Required content

- `from_stage`: reference to `stage`, `language`, or `phonology`
- `to_stage`: reference to `stage`, `language`, or `phonology`
- at least one `rule <id>` child block

### Optional fields

- `notes`: string or multi-line text
- `status`: atom
- `certainty`: atom

### Required child blocks

- one or more `rule <id>` child blocks

Each `rule` block may contain:

- `from`: string, atom, or IPA literal
- `to`: string, atom, or IPA literal
- `environment`: string
- `exceptions`: list of strings or references
- `status`: atom
- `certainty`: atom
- `notes`: string or multi-line text

### Disallowed fields

- `translation`
- `gloss`

### Reference targets

- `from_stage` -> `stage`, `language`, or `phonology`
- `to_stage` -> `stage`, `language`, or `phonology`
- `rule.*.exceptions` -> optionally `entry`, `morpheme`, or `stage`

### Minimal validation

- `from_stage` is required
- `to_stage` is required
- at least one `rule` child block is required
- every `rule` should contain `from` and `to`; omission is a schema error
- `from_stage` and `to_stage` must not target the wrong type

### Minimal example

```txt
soundchange proto_to_old {
  from_stage: stage:proto_taren
  to_stage: stage:old_taren

  rule sc1 {
    from: p
    to: f
  }
}
```

### Standard example

```txt
soundchange proto_to_old {
  from_stage: stage:proto_taren
  to_stage: stage:old_taren

  rule sc1 {
    from: p
    to: f
    environment: "V_V"
  }
}
```

### Extended example

```txt
soundchange proto_to_old {
  from_stage: stage:proto_taren
  to_stage: stage:old_taren
  certainty: medium

  rule sc1 {
    from: p
    to: f
    environment: "V_V"
  }

  rule sc2 {
    from: a
    to: e
    environment: "_i"
    exceptions: ["frozen forms"]
    certainty: low
  }
}
```

### Invalid examples

Missing `rule`:

```txt
soundchange proto_to_old {
  from_stage: stage:proto_taren
  to_stage: stage:old_taren
}
```

Wrong stage target:

```txt
soundchange proto_to_old {
  from_stage: entry:varu
  to_stage: stage:old_taren

  rule sc1 {
    from: p
    to: f
  }
}
```

## 6.5 `etymology`

### Purpose

The `etymology` block describes diachronic origin, intermediate development, borrowing, or reconstruction paths.

### Required fields

At least one of:

- `origin`: string or reference
- `development`: string or multi-line text

### Optional fields

- `origin`: string or reference
- `development`: string or multi-line text
- `source_language`: reference to `language` or `stage`
- `intermediate`: list of `stage`, `language`, `entry`, or `morpheme` references
- `soundchanges`: list of `soundchange` references
- `status`: atom
- `certainty`: atom
- `notes`: string or multi-line text

### Disallowed fields

- `translation`
- `scripts`

### Reference targets

- `origin` -> optionally `entry`, `morpheme`, `stage`, or `language`
- `source_language` -> `language` or `stage`
- `intermediate` -> `stage`, `language`, `entry`, or `morpheme`
- `soundchanges` -> `soundchange`

### Minimal validation

- at least one of `origin` or `development` is required
- `source_language`, if present, must target `language` or `stage`
- `soundchanges`, if present, must contain only `soundchange` references

### Minimal example

```txt
etymology varu_origin {
  origin: "Proto-Taren *waru"
}
```

### Standard example

```txt
etymology varu_origin {
  origin: stage:proto_taren
  development: "Proto-Taren *waru > Old Taren varu"
  source_language: stage:proto_taren
}
```

### Extended example

```txt
etymology varu_origin {
  origin: stage:proto_taren
  source_language: stage:proto_taren
  intermediate: [stage:old_taren]
  soundchanges: [soundchange:proto_to_old]
  development: """
Proto-Taren *waru develops regularly into Old Taren varu.
No irregular analogical reshaping is currently assumed.
"""
  certainty: medium
}
```

### Invalid examples

Missing both `origin` and `development`:

```txt
etymology varu_origin {
  certainty: medium
}
```

Wrong `soundchanges` target:

```txt
etymology varu_origin {
  origin: stage:proto_taren
  soundchanges: [entry:varu]
}
```

## 6.6 `stage`

### Purpose

The `stage` block defines an addressable language stage, historical layer, or named chronological state.

### Required fields

- `name`: string

### Optional fields

- `based_on`: reference to `stage` or `language`
- `period`: string, atom, or object
- `status`: atom
- `phonology`: reference to `phonology`
- `grammar`: reference to `grammar`
- `lexicon_notes`: string or multi-line text
- `notes`: string or multi-line text
- `certainty`: atom
- `source`: object or string
- `sources`: list

### Disallowed fields

- `pos`
- `translation`

### Reference targets

- `based_on` -> `stage` or `language`
- `phonology` -> `phonology`
- `grammar` -> `grammar`

### Minimal validation

- `name` is required
- `phonology`, if present, must target `phonology`
- `grammar`, if present, must target `grammar`
- `based_on`, if present, must target `stage` or `language`

### Minimal example

```txt
stage old_taren {
  name: "Old Taren"
}
```

### Standard example

```txt
stage old_taren {
  name: "Old Taren"
  based_on: language:taren
  period: "ca. 400-700"
  status: historical
}
```

### Extended example

```txt
stage old_taren {
  name: "Old Taren"
  based_on: stage:proto_taren
  period: "ca. 400-700"
  status: historical
  phonology: phonology:old_taren_core
  grammar: grammar:old_taren_grammar
  certainty: medium
}
```

### Invalid examples

Missing `name`:

```txt
stage old_taren {
  status: historical
}
```

Wrong `phonology` target:

```txt
stage old_taren {
  name: "Old Taren"
  phonology: entry:varu
}
```

## 7. Combined Example

```txt
dsl 0.3.0

language taren {
  name: "Taren"
  family: "West Avaric"
  status: living
  scripts: [script:tarenic]
  stages: [stage:proto_taren, stage:old_taren]
}

stage proto_taren {
  name: "Proto-Taren"
  status: reconstructed
}

stage old_taren {
  name: "Old Taren"
  based_on: stage:proto_taren
  status: historical
  phonology: phonology:old_taren_core
  grammar: grammar:old_taren_grammar
}

phonology old_taren_core {
  vowels: /a e i o u/
  consonants: /p t k b d g m n s z l r/
  stage: stage:old_taren
  affected_by: [soundchange:proto_to_old]
}

grammar old_taren_grammar {
  categories {
    number: [singular, plural]
    tense: [past, nonpast]
  }
  paradigms: [paradigm:pronoun_case]
  constructions: [construction:basic_clause]
}

morpheme -ren {
  type: suffix
  gloss: POSS
  function: possessive
}

paradigm pronoun_case {
  dimensions: [person, case]

  row first_singular {
    label: first_singular
    nominative: ka
    accusative: kar
  }
}

construction basic_clause {
  pattern: "Subject Object Verb"

  constraints {
    object_optional: true
  }
}

soundchange proto_to_old {
  from_stage: stage:proto_taren
  to_stage: stage:old_taren

  rule sc1 {
    from: p
    to: f
    environment: "V_V"
  }
}

etymology varu_origin {
  origin: stage:proto_taren
  soundchanges: [soundchange:proto_to_old]
  development: "Proto-Taren *waru > Old Taren varu"
}

entry varu {
  pos: verb
  gloss: "to drink"
  ipa: /va.ru/
  stage: stage:old_taren
  morphemes: [morpheme:-ren]
  etymology: etymology:varu_origin
}

example ex1 {
  surface: "Ka varu."
  morph: "Ka | varu"
  gloss: "1SG | drink"
  translation: "I drink."
  stage: stage:old_taren
  uses: [entry:varu, construction:basic_clause]
}
```

## 8. Conformance

A `0.3.0` schema-aware implementation conforms if it:

- accepts the `0.1.1` syntax baseline
- validates the `0.2.0` core schemas and the `0.3.0` morphology and diachrony schemas
- applies the refined field and reference rules for `language`, `entry`, `phonology`, `example`, and `grammar`
- distinguishes schema errors, reference errors, and domain warnings

A `0.3.0` document conforms if it:

- declares `dsl 0.3.0`
- uses valid core syntax
- uses standardized block types according to their `0.3.0` schema rules when those block types appear

## 9. Future Directions

Likely next steps after `0.3.0`:

- canonical AST design
- standardized schemas for `dialect`, `register`, `phoneme`, and `text`
- parser fixtures and machine-readable schema tables
- eventual formal short syntax
