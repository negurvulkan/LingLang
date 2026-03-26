# LingLang DSL Specification v0.1.1

Status: Draft

This document defines version `0.1.1` of the LingLang DSL core syntax. It specifies the textual format only. Linguistic schemas, rendering rules, and advanced validation profiles build on top of this core.

## 1. Purpose

The LingLang DSL is a human-readable, text-based language for describing languages, language stages, dialects, lexica, sound systems, grammatical systems, and annotated examples.

Version `0.1.1` defines:

- the document model
- lexical conventions
- the core block syntax
- core value types
- references
- uncertainty metadata
- validation levels
- a normative EBNF grammar for the surface syntax

Version `0.1.1` does not fully standardize:

- all domain-specific block types
- all linguistic category inventories
- rendering output formats
- inheritance merge semantics beyond the core rules in this document
- a formal short syntax
- a reference parser or canonical AST

## 2. Design Goals

The core syntax follows these goals:

- remain readable in raw text
- be directly parseable without ambiguous heuristics
- support both concise and structured authoring styles
- allow typed references between linguistic objects
- preserve incomplete, uncertain, or competing analyses
- remain extensible without breaking existing documents

## 3. Document Structure

A DSL document is a sequence of top-level statements.

Allowed top-level statements in `0.1.1`:

- a version declaration
- block declarations
- line comments
- blank lines

Example:

```txt
dsl 0.1.1

language taren {
  name: "Taren"
  status: living
}

entry varu {
  pos: verb
  gloss: "to drink"
}
```

## 4. Version Declaration

Every document should begin with a DSL version declaration.

Syntax:

```txt
dsl <semver>
```

Example:

```txt
dsl 0.1.1
```

Rules:

- The version declaration applies to the entire file.
- At most one version declaration may appear in a file.
- If omitted, parsers may reject the file or assume a configured default. Conforming `0.1.1` documents should declare the version explicitly.

## 5. Lexical Conventions

### 5.1 Whitespace

- Spaces, tabs, and line breaks separate tokens where necessary.
- Indentation is not semantically significant.
- Parsers should preserve source positions for diagnostics.

### 5.2 Comments

Line comments begin with `#` and continue to the end of the line.

Example:

```txt
# Core metadata
language taren {
  name: "Taren"
}
```

### 5.3 Identifiers

Identifiers name block instances, fields, and symbolic atoms.

Recommended identifier pattern:

```txt
[A-Za-z_][A-Za-z0-9_-]*
```

Notes:

- Hyphens are allowed after the first character.
- Domain-specific profiles may allow broader Unicode identifiers, but `0.1.1` core tooling should support the recommended ASCII-safe form.

Examples:

- `taren`
- `south_taren`
- `proto-taren`
- `semantic_field`

### 5.4 Strings

Quoted strings use double quotes.

Example:

```txt
name: "Taren"
```

Strings support escaped quotes and escaped backslashes.

Minimum required escapes in `0.1.1`:

- `\"`
- `\\`
- `\n`
- `\t`

### 5.5 Multi-line Text

Multi-line text uses triple double quotes.

Example:

```txt
notes """
The language shows a mixed analytic-suffixing profile.
Some analyses treat -ren as a clitic.
"""
```

Rules:

- The content begins after the opening delimiter and ends before the closing delimiter.
- Parsers should preserve internal line breaks exactly.

### 5.6 IPA Literals

IPA-like phonetic or phonological forms may be written as slash-delimited literals.

Example:

```txt
ipa: /va.ru/
```

Rules:

- The parser treats slash-delimited content as a distinct scalar literal type.
- Symbol inventory validation is optional at parse time and belongs primarily to semantic validation.

### 5.7 Boolean Literals

Boolean literals are:

- `true`
- `false`

### 5.8 Null Literal

The null literal is:

- `null`

## 6. Statement Model

The document consists of blocks. A block defines either:

- an entity with a stable identity, or
- a nested structural section within another block

### 6.1 Entity Blocks

Entity blocks have a block type and an identifier.

Syntax:

```txt
<type> <id> {
  ...
}
```

Example:

```txt
entry varu {
  pos: verb
  gloss: "to drink"
}
```

### 6.2 Section Blocks

Section blocks are nested inside other blocks and usually do not have global identity.

Syntax:

```txt
<section_name> {
  ...
}
```

Example:

```txt
phonology taren_core {
  allophony {
    nasal_before_velar: "[n] -> [N] / _k,g"
  }
}
```

### 6.3 Repeated Child Blocks

A parent block may contain repeated named child blocks where the child itself has an identifier.

Syntax:

```txt
<type> <parent_id> {
  <child_type> <child_id> {
    ...
  }
}
```

Example:

```txt
script tarenic {
  grapheme sh {
    phoneme: phoneme:sh
  }
}
```

## 7. Fields

Fields are key-value pairs inside blocks.

Syntax:

```txt
<field_name>: <value>
```

Example:

```txt
status: living
```

Rules:

- Field order is not semantically significant unless a domain-specific schema says otherwise.
- Repeated fields are invalid unless explicitly allowed by the block schema.

## 8. Value Types

Version `0.1.1` defines the following core value types.

### 8.1 Symbolic Atom

A symbolic atom is an unquoted identifier-like value.

Examples:

- `living`
- `verb`
- `penultimate`

Atoms are used for controlled vocabularies, enums, tags, and concise values.

### 8.2 String

Examples:

- `"Taren"`
- `"to drink"`

### 8.3 Multi-line Text

Example:

```txt
notes """
Open question: whether final vowels reduce in unstressed speech.
"""
```

### 8.4 Number

Core numeric values may be integer or decimal.

Examples:

- `3`
- `2.5`

### 8.5 Boolean

Examples:

- `true`
- `false`

### 8.6 Null

Example:

- `null`

### 8.7 List

Lists use square brackets and comma-separated values.

Syntax:

```txt
[value1, value2, value3]
```

Example:

```txt
dialects: [dialect:north_taren, dialect:south_taren]
```

Empty lists are allowed:

```txt
exceptions: []
```

### 8.8 Inline IPA Literal

Example:

```txt
ipa: /ti.ra.lul.ta/
```

### 8.9 Object Literal

Object literals provide small inline structures.

Syntax:

```txt
{ key: value, other: value }
```

Example:

```txt
source: { kind: field_notes, year: 2026 }
```

Object literals should remain small. Large structured content should use nested blocks.

### 8.10 Reference

References point to other addressable entities.

Typed reference syntax:

```txt
<type>:<id>
```

Examples:

- `entry:varu`
- `morpheme:-ren`
- `dialect:south_taren`

Rules:

- Parsers should preserve the reference as a typed link object.
- Semantic validation resolves whether the target exists.

## 9. Core Block Syntax

General form:

```txt
<type> <id> {
  <field>: <value>
  <field>: <value>

  <section> {
    ...
  }
}
```

Example:

```txt
language taren {
  name: "Taren"
  native_name: "Taren"
  family: "West Avaric"
  status: living
  scripts: [script:tarenic]
}
```

## 10. Recommended Core Entity Types

Version `0.1.1` recognizes these names as recommended core entity types:

- `language`
- `stage`
- `dialect`
- `register`
- `phonology`
- `script`
- `phoneme`
- `morpheme`
- `entry`
- `grammar`
- `construction`
- `paradigm`
- `example`
- `text`
- `etymology`
- `soundchange`
- `analysis`

This list is normative only as a reserved vocabulary recommendation. Domain profiles may add more block types.

## 11. Metadata Conventions

The following field names are recommended as cross-cutting metadata fields:

- `name`
- `label`
- `status`
- `certainty`
- `notes`
- `tags`
- `source`
- `sources`
- `based_on`

Not every block type must support all of them, but implementations should treat them consistently where present.

## 12. Uncertainty and Analysis Status

The DSL must allow uncertain or competing descriptions.

Recommended cross-cutting fields:

- `certainty: low | medium | high`
- `status: attested | inferred | reconstructed | hypothetical | deprecated`

Example:

```txt
entry salun {
  gloss: "wind; possibly breath"
  ipa: /sa.lun/
  certainty: medium
}
```

Competing analyses should be modeled as separate entities rather than overwritten prose.

Example:

```txt
analysis ren_as_suffix {
  target: morpheme:-ren
  interpretation: suffix
}

analysis ren_as_clitic {
  target: morpheme:-ren
  interpretation: clitic
}
```

## 13. Inheritance and Overrides

Version `0.1.1` allows inheritance by reference through `based_on`.

Example:

```txt
dialect south_taren {
  based_on: language:taren
}
```

Override semantics in the core version are intentionally minimal:

- scalar fields replace inherited scalar fields
- list fields replace inherited list fields unless a profile defines merge behavior
- nested blocks replace blocks of the same type and identifier unless a profile defines merge behavior

Profiles that require more complex inheritance must define explicit merge semantics.

## 14. Short Form and Long Form

Version `0.1.1` standardizes the long form. A short form may exist as syntactic sugar, but only if it can be translated losslessly into the long form AST.

Non-normative example:

```txt
tiralulta %noun ?sea-water $/ti.ra.lul.ta/ =tiral+ulta
```

Equivalent long-form target:

```txt
entry tiralulta {
  pos: noun
  gloss: "sea-water"
  ipa: /ti.ra.lul.ta/
  derived_from: [entry:tiral, entry:ulta]
}
```

Short forms are not required for `0.1.1` parser compliance.

## 15. Validation Levels

Conforming tooling should support at least four diagnostic levels:

- `error`
- `warning`
- `info`
- `note`

Suggested interpretation:

- `error`: invalid syntax, invalid types, unresolved required references
- `warning`: suspicious but still processable content
- `info`: incomplete but acceptable modeling state
- `note`: intentional uncertainty, interpretation choice, or author annotation

## 16. Syntax Grammar (EBNF)

This section is normative. It defines the canonical surface syntax for version `0.1.1`.

The EBNF below distinguishes lexical and syntactic rules. Whitespace and comments may appear between tokens unless a rule states otherwise.

```ebnf
document            = spacing, version_decl, spacing, top_level_item*, EOF ;

top_level_item      = block, spacing ;

version_decl        = "dsl", wsp, semver, line_end ;
semver              = integer, ".", integer, ".", integer ;

block               = entity_block | section_block ;
entity_block        = identifier, wsp, block_id, spacing, "{", spacing, block_item*, "}" ;
section_block       = identifier, spacing, "{", spacing, block_item*, "}" ;

block_item          = field
                    | block
                    | line_comment
                    | blank_line ;

field               = identifier, spacing, ":", spacing, value, spacing ;

value               = reference
                    | ipa_literal
                    | multiline_text
                    | string
                    | number
                    | boolean
                    | null
                    | list
                    | object
                    | atom ;

list                = "[", spacing, [ value, spacing, { ",", spacing, value, spacing } ], "]" ;
object              = "{", spacing, [ object_field, spacing, { ",", spacing, object_field, spacing } ], "}" ;
object_field        = identifier, spacing, ":", spacing, value ;

reference           = identifier, ":", block_id ;
atom                = identifier ;
boolean             = "true" | "false" ;
null                = "null" ;

string              = "\"", { string_char }, "\"" ;
string_char         = escaped_char | non_quote_char ;
escaped_char        = "\\\"" | "\\\\" | "\\n" | "\\t" ;

multiline_text      = "\"\"\"", multiline_body, "\"\"\"" ;
multiline_body      = { multiline_char } ;

ipa_literal         = "/", { ipa_char }, "/" ;

number              = integer, [ ".", integer ] ;
integer             = digit, { digit } ;

identifier          = identifier_start, { identifier_continue } ;
identifier_start    = "A".."Z" | "a".."z" | "_" ;
identifier_continue = identifier_start | digit | "-" ;

block_id            = block_id_char, { block_id_char } ;
block_id_char       = identifier_start | digit | "-" ;

spacing             = { wsp | line_end | line_comment } ;
wsp                 = " " | "\t" ;
line_end            = "\r\n" | "\n" ;
blank_line          = line_end ;
line_comment        = "#", { not_line_end }, line_end ;

digit               = "0".."9" ;
non_quote_char      = ? any character except " or \ or line_end ? ;
multiline_char      = ? any character sequence not containing the closing delimiter """ ? ;
ipa_char            = ? any character except / or line_end ? ;
not_line_end        = ? any character except line_end ? ;
EOF                 = ? end of input ? ;
```

### 16.1 Grammar Notes

- Top-level content is limited to the version declaration, blocks, comments, and blank lines.
- Field names are always `identifier` tokens.
- Entity blocks require an identifier after the block type. Section blocks do not.
- `reference` and `atom` may look similar at the semantic level; syntactically a typed reference is recognized by the `identifier ":" block_id` pattern.
- Object literals are inline only and may recursively contain any normal `value`.
- Lists are comma-separated. Whitespace alone does not separate list items.
- Whitespace is flexible between tokens, but never inside tokens such as identifiers, references, numbers, or delimiters.
- IPA literals are accepted syntactically as slash-delimited tokens. Validation of allowed IPA characters belongs to semantic validation, not parsing.
- Short syntax is intentionally outside the normative grammar in `0.1.1`.

### 16.2 Minimal Parse Examples

Version declaration:

```txt
dsl 0.1.1
```

Entity block:

```txt
entry varu {
  gloss: "to drink"
}
```

Section block:

```txt
phonology taren_core {
  allophony {
    t_before_i: "[t] -> [ts] / _i"
  }
}
```

List and reference:

```txt
language taren {
  dialects: [dialect:north_taren, dialect:south_taren]
}
```

Object literal:

```txt
entry varu {
  source: { kind: field_notes, year: 2026 }
}
```

Multiline text:

```txt
entry salun {
  notes """
Open question: whether the secondary sense is inherited.
"""
}
```

### 16.3 Negative Syntax Examples

Missing closing brace:

```txt
entry varu {
  gloss: "to drink"
```

Field without colon:

```txt
entry varu {
  gloss "to drink"
}
```

List without commas:

```txt
language taren {
  dialects: [dialect:north_taren dialect:south_taren]
}
```

Entity block without identifier:

```txt
entry {
  gloss: "to drink"
}
```

Invalid version declaration:

```txt
dsl 0.1
```

## 17. Conformance

A parser conforms to version `0.1.1` if it can:

- read the version declaration
- parse blocks, fields, lists, strings, multi-line text, atoms, booleans, nulls, numbers, references, and slash-delimited IPA literals
- preserve block type, identifier, field structure, and source positions
- distinguish parse errors from semantic validation findings

A document conforms to version `0.1.1` if it:

- declares `dsl 0.1.1`
- uses valid core syntax
- does not rely on undefined syntax extensions

## 18. Example Document

```txt
dsl 0.1.1

language taren {
  name: "Taren"
  native_name: "Taren"
  family: "West Avaric"
  status: living
  scripts: [script:tarenic]
  dialects: [dialect:north_taren, dialect:south_taren]
}

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

morpheme -ren {
  type: suffix
  function: possessive
  gloss: POSS
}

entry varu {
  pos: verb
  gloss: "to drink"
  ipa: /va.ru/
  valency: transitive
}

example ex1 {
  surface: "Ka tiral varu."
  morph: "Ka | tiral | varu"
  gloss: "1SG | water | drink"
  translation: "I drink water."
}
```

## 19. Future Extension Points

Future versions may standardize:

- formal short syntax
- import/include mechanisms
- namespaces and multi-file modules
- richer inheritance and patch semantics
- standardized linguistic profiles
- gloss category registries
- structured sound change rule syntax
- corpus annotation layers

## 20. SemVer Policy

The LingLang DSL uses Semantic Versioning.

- Patch releases clarify wording, fix examples, and resolve editorial inconsistencies without changing syntax or meaning.
- Minor releases add backward-compatible syntax or semantics.
- Major releases introduce breaking syntax or interpretation changes.
