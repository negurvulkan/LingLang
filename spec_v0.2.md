# LingLang DSL Specification v0.2.0

Status: Draft

This document defines version `0.2.0` of the LingLang DSL. Version `0.2.0` keeps the core syntax introduced in `0.1.1` and adds the first normative domain schemas for core linguistic objects.

Version `0.2.0` standardizes:

- the core syntax model inherited from `0.1.1`
- the distinction between core syntax and core schemas
- the first normative schemas for `language`, `entry`, `phonology`, `example`, `script`, and `grammar`
- block-level required and optional fields
- basic controlled values for high-frequency interoperable fields
- block-specific reference targets
- minimum validation rules for the first schema layer

Version `0.2.0` does not yet standardize:

- a reference parser
- a canonical AST
- short syntax
- full schemas for `morpheme`, `paradigm`, `construction`, `etymology`, `soundchange`, or corpus annotation
- complete universal inventories for linguistic categories

## 1. Design Structure

The LingLang DSL now has two normative layers:

- **Core Syntax**: tokens, blocks, values, references, and the EBNF surface grammar
- **Core Schemas**: domain-specific block types with required fields, allowed fields, value constraints, reference targets, and minimal validation rules

`0.2.0` uses the core syntax of `0.1.1` unchanged. Any document that conforms to the `0.1.1` syntax remains syntactically valid in `0.2.0`, but may fail schema validation if it uses a standardized block type incorrectly.

## 2. Version Declaration

Conforming `0.2.0` documents should begin with:

```txt
dsl 0.2.0
```

## 3. Cross-Cutting Schema Conventions

### 3.1 Schema Validation Classes

Core schemas classify findings into three functional groups:

- **Schema error**: required field missing, wrong value type, disallowed field, invalid child block
- **Reference error**: reference target missing or target type invalid for the field
- **Domain warning**: content is structurally valid but linguistically incomplete, underspecified, or unusual

These map onto the diagnostic levels defined by the core syntax specification.

### 3.2 Common Metadata Fields

The following fields are available only where explicitly allowed by a block schema:

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

The following controlled values are normative in `0.2.0`.

`certainty`:

- `low`
- `medium`
- `high`

`status` for language-like or analysis-like entities:

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

Implementations may allow additional atoms for forward compatibility, but should emit a domain warning when a non-standard value is used in a standardized field.

### 3.4 Minimal Schema Levels

Each normative core block is described at three levels:

- **Minimal**: smallest recommended valid use
- **Standard**: typical use expected in most projects
- **Extended**: more detailed but still normative use

## 4. Core Syntax Baseline

The syntax rules from version `0.1.1` remain in force for `0.2.0`. This includes:

- block-based structure
- typed references in the form `<type>:<id>`
- lists, object literals, strings, multi-line text, numbers, booleans, nulls, and slash-delimited IPA literals
- the normative EBNF grammar

Implementations should treat [spec_v0.1.md](/H:/Projekte/LingLang/spec_v0.1.md) as the canonical syntax baseline until a consolidated future spec replaces it.

## 5. Normative Core Schemas

## 5.1 `language`

### Purpose

The `language` block defines a language, language stage, standard variety, or project-level anchor object for related linguistic data.

### Required fields

- `name`: string

### Optional fields

- `native_name`: string
- `family`: string or atom
- `status`: atom
- `scripts`: list of `script` references
- `dialects`: list of `dialect` references
- `periods`: list of strings or atoms
- `regions`: list of strings or atoms
- `notes`: multi-line text or string
- `tags`: list of atoms or strings
- `source`: object or string
- `sources`: list
- `certainty`: atom
- `based_on`: reference to `language` or `stage`

### Disallowed fields

- `pos`
- `ipa`
- `translation`

### Reference targets

- `scripts` -> `script`
- `dialects` -> `dialect`
- `based_on` -> `language` or `stage`

### Minimal validation

- `name` is required
- `scripts`, if present, must contain only `script` references
- `dialects`, if present, must contain only `dialect` references
- `status`, if present, should use the controlled set
- `certainty`, if present, should use the controlled set

### Minimal example

```txt
language taren {
  name: "Taren"
}
```

### Standard example

```txt
language taren {
  name: "Taren"
  native_name: "Taren"
  family: "West Avaric"
  status: living
  scripts: [script:tarenic]
  dialects: [dialect:north_taren, dialect:south_taren]
  regions: ["North Coast", "River Basin"]
}
```

## 5.2 `entry`

### Purpose

The `entry` block defines a lexeme or lexical entry.

### Required fields

At least one of:

- `gloss`: string
- `pos`: atom

### Optional fields

- `gloss`: string
- `pos`: atom
- `ipa`: IPA literal
- `derived_from`: list of references
- `semantic_field`: list of atoms or strings
- `valency`: atom or string
- `register`: reference to `register` or atom
- `etymology`: reference to `etymology` or string
- `notes`: multi-line text or string
- `tags`: list of atoms or strings
- `source`: object or string
- `sources`: list
- `certainty`: atom
- `status`: atom

### Disallowed fields

- `scripts`
- `translation`

### Reference targets

- `derived_from` -> `entry` or `morpheme`
- `register` -> `register`
- `etymology` -> `etymology`

### Minimal validation

- at least one of `gloss` or `pos` must exist
- `ipa`, if present, must be an IPA literal
- `derived_from`, if present, must contain only `entry` or `morpheme` references
- `pos`, if present, should use the controlled set
- `certainty`, if present, should use the controlled set

### Minimal example

```txt
entry varu {
  gloss: "to drink"
}
```

### Standard example

```txt
entry varu {
  pos: verb
  gloss: "to drink"
  ipa: /va.ru/
  valency: transitive
  semantic_field: [consumption]
}
```

### Extended example

```txt
entry tiralulta {
  pos: noun
  gloss: "sea-water"
  ipa: /ti.ra.lul.ta/
  derived_from: [entry:tiral, entry:ulta]
  semantic_field: [nature, water]
  certainty: high
}
```

## 5.3 `phonology`

### Purpose

The `phonology` block defines a language- or variety-specific phonological system.

### Required fields

At least one of:

- `vowels`: IPA literal or string
- `consonants`: IPA literal or string

### Optional fields

- `vowels`: IPA literal or string
- `consonants`: IPA literal or string
- `syllable`: string
- `stress`: atom or string
- `tone`: atom, string, or object
- `length`: atom, string, or object
- `notes`: multi-line text or string
- `certainty`: atom
- `based_on`: reference to `phonology`, `language`, or `dialect`

### Optional child blocks

- `allophony`

The `allophony` section may contain fields whose values are strings describing rule-like mappings.

### Disallowed fields

- `translation`
- `pos`

### Reference targets

- `based_on` -> `phonology`, `language`, or `dialect`

### Minimal validation

- at least one of `vowels` or `consonants` must exist
- `allophony`, if present, must be a section block, not a scalar field
- `certainty`, if present, should use the controlled set

### Minimal example

```txt
phonology taren_core {
  vowels: /a e i o u/
}
```

### Standard example

```txt
phonology taren_core {
  vowels: /a e i o u/
  consonants: /p t k b d g m n s z l r/
  syllable: "(C)(C)V(C)"
  stress: penultimate
}
```

### Extended example

```txt
phonology taren_core {
  vowels: /a e i o u/
  consonants: /p t k b d g m n s z l r/
  syllable: "(C)(C)V(C)"
  stress: penultimate

  allophony {
    n_before_velars: "[n] -> [N] / _k,g"
    t_before_i: "[t] -> [ts] / _i"
  }
}
```

## 5.4 `example`

### Purpose

The `example` block models example utterances, example clauses, and interlinear-style teaching or analysis examples.

### Required fields

- `surface`: string
- `translation`: string

### Optional fields

- `morph`: string
- `gloss`: string
- `language`: reference to `language`, `dialect`, or `stage`
- `uses`: list of references
- `notes`: multi-line text or string
- `source`: object or string
- `sources`: list
- `certainty`: atom
- `tags`: list of atoms or strings

### Disallowed fields

- `family`
- `scripts`

### Reference targets

- `language` -> `language`, `dialect`, or `stage`
- `uses` -> `entry`, `morpheme`, `construction`, or `language`

### Minimal validation

- `surface` is required
- `translation` is required
- if either `morph` or `gloss` is present, the other should usually also be present; omission is a domain warning, not a schema error
- `uses`, if present, must contain only allowed reference targets

### Minimal example

```txt
example ex1 {
  surface: "Ka varu."
  translation: "I drink."
}
```

### Standard example

```txt
example ex2 {
  surface: "Ka tiral varu."
  morph: "Ka | tiral | varu"
  gloss: "1SG | water | drink"
  translation: "I drink water."
  uses: [entry:tiral, entry:varu]
}
```

## 5.5 `script`

### Purpose

The `script` block defines a writing system or orthographic standard.

### Required fields

- `type`: atom

### Optional fields

- `direction`: atom
- `notes`: multi-line text or string
- `status`: atom
- `certainty`: atom
- `source`: object or string
- `sources`: list

### Optional child blocks

- `grapheme <id>`
- `orthography`

`grapheme` child blocks may contain:

- `phoneme`: reference to `phoneme` or string
- `name`: string
- `notes`: string or multi-line text

`orthography` may contain scalar descriptive fields.

### Disallowed fields

- `pos`
- `translation`

### Reference targets

- `grapheme.*.phoneme` -> `phoneme`

### Minimal validation

- `type` is required
- `direction`, if present, should be an atom such as `ltr`, `rtl`, or `ttb`
- `grapheme` child blocks, if present, must have identifiers
- `phoneme` inside a `grapheme` block must be a `phoneme` reference or descriptive fallback string

### Minimal example

```txt
script tarenic {
  type: alphabet
}
```

### Standard example

```txt
script tarenic {
  type: alphabet
  direction: ltr

  grapheme a {
    phoneme: phoneme:a
  }

  grapheme sh {
    phoneme: phoneme:sh
  }
}
```

## 5.6 `grammar`

### Purpose

The `grammar` block describes categorical inventories and declarative grammatical strategies.

### Required content

At least one of:

- a `categories` section
- at least one named strategy section such as `possession`

### Optional fields

- `notes`: multi-line text or string
- `status`: atom
- `certainty`: atom
- `based_on`: reference to `grammar`, `language`, or `stage`

### Optional child blocks

- `categories`
- named section blocks representing strategies, such as `possession`, `alignment`, `negation`, `agreement`

The `categories` section may contain fields whose values are comma-separated lists in normal DSL list form.

### Disallowed fields

- `ipa`
- `translation`

### Reference targets

- `based_on` -> `grammar`, `language`, or `stage`

### Minimal validation

- a `grammar` block must contain either `categories` or at least one named strategy section
- `categories` must be represented as a section block
- scalar fields inside `categories` should normally be lists, not free prose; non-list values produce a domain warning

### Minimal example

```txt
grammar taren_grammar {
  categories {
    number: [singular, plural]
  }
}
```

### Standard example

```txt
grammar taren_grammar {
  categories {
    number: [singular, plural]
    tense: [past, nonpast]
    aspect: [imperfective, perfective]
    mood: [indicative, imperative]
  }

  possession {
    strategy: suffix
    marker: "-ren"
  }
}
```

## 6. Referentiable but Not Yet Fully Standardized Types

The following block types remain recognized and referentiable in `0.2.0`, but do not yet have full normative schemas in this version:

- `stage`
- `dialect`
- `register`
- `phoneme`
- `morpheme`
- `construction`
- `paradigm`
- `text`
- `etymology`
- `soundchange`
- `analysis`

Implementations may support project-specific schemas for these types, but such schemas are outside `0.2.0` conformance.

## 7. Validation Scenarios

### 7.1 Invalid `language`

Missing required field:

```txt
language taren {
  status: living
}
```

### 7.2 Invalid `entry`

Wrong field type:

```txt
entry varu {
  gloss: "to drink"
  ipa: true
}
```

### 7.3 Invalid `phonology`

Missing inventory:

```txt
phonology taren_core {
  stress: penultimate
}
```

### 7.4 Invalid `example`

Missing translation:

```txt
example ex1 {
  surface: "Ka varu."
}
```

### 7.5 Invalid `script`

Wrong reference target:

```txt
script tarenic {
  type: alphabet

  grapheme a {
    phoneme: entry:varu
  }
}
```

### 7.6 Invalid `grammar`

Unstructured categories:

```txt
grammar taren_grammar {
  categories: "number, tense, aspect"
}
```

## 8. Conformance

A `0.2.0` schema-aware implementation conforms if it:

- accepts the `0.1.1` core syntax baseline
- validates the six normative core schemas in this document
- distinguishes schema errors, reference errors, and domain warnings
- accepts syntactically valid non-standardized block types without falsely treating them as `0.2.0` schema violations unless a schema claim is made

A `0.2.0` document conforms if it:

- declares `dsl 0.2.0`
- uses valid core syntax
- uses the six standardized block types according to the schemas in this document whenever those block types appear

## 9. Full Example

```txt
dsl 0.2.0

language taren {
  name: "Taren"
  native_name: "Taren"
  family: "West Avaric"
  status: living
  scripts: [script:tarenic]
  regions: ["North Coast"]
}

script tarenic {
  type: alphabet
  direction: ltr

  grapheme a {
    phoneme: phoneme:a
  }

  orthography {
    long_vowels_marked: false
  }
}

phonology taren_core {
  vowels: /a e i o u/
  consonants: /p t k b d g m n s z l r/
  syllable: "(C)(C)V(C)"
  stress: penultimate
}

grammar taren_grammar {
  categories {
    number: [singular, plural]
    tense: [past, nonpast]
  }
}

entry varu {
  pos: verb
  gloss: "to drink"
  ipa: /va.ru/
}

example ex1 {
  surface: "Ka varu."
  morph: "Ka | varu"
  gloss: "1SG | drink"
  translation: "I drink."
  language: language:taren
  uses: [entry:varu]
}
```

## 10. Future Directions

Likely next steps after `0.2.0`:

- canonical AST design
- standardized schemas for `morpheme`, `construction`, `paradigm`, and `soundchange`
- formal short syntax
- reference parser fixtures and machine-readable schema tables
