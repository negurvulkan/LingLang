# LingLang DSL Specification v0.7.0

Status: Draft

This document defines version `0.7.0` of the LingLang DSL. Version `0.7.0` keeps the syntax and schema layers introduced in `0.1.1` through `0.5.0` and adds the remaining major linguistic coverage areas that were still only partial, implicit, or profile-like in earlier versions.

Version `0.7.0` standardizes:

- the `0.1.1` syntax baseline
- the schema layers introduced in `0.2.0`, `0.3.0`, and `0.4.0`
- the AST and short-syntax layer introduced in `0.5.0`
- deep semantic modeling
- deep pragmatics and sociolinguistic modeling
- prosody and non-segmental phonology as structured objects
- multi-layer text annotation and corpus-facing evidence structures
- directly standardized specialist areas including sign-language modeling, classifier systems, switch-reference, template morphology, and polysynthesis profiles

Version `0.7.0` does not yet standardize:

- a parser implementation
- import and module semantics
- namespace systems
- advanced override semantics
- a full corpus query language
- complete modality-specific subtheories for every specialist domain

## 1. Layer Model

The LingLang DSL now has six normative layers:

- **Core Syntax** from `0.1.1`
- **Core Schemas** from `0.2.0`
- **Extended Core Schemas** from `0.3.0`
- **Variation, Evidence, and Analysis Layer** from `0.4.0`
- **Model and Authoring Layer** from `0.5.0`
- **Advanced Linguistic Coverage Layer** from `0.7.0`

`0.7.0` does not replace earlier documents. It extends them with the remaining major domains of general linguistic description and several directly standardized specialist systems.

## 2. Version Declaration

Conforming `0.7.0` documents should begin with:

```txt
dsl 0.7.0
```

## 3. Cross-Cutting Conventions

### 3.1 Validation Classes

Schema-aware tooling should distinguish:

- **Schema error**: required content missing, wrong value type, invalid child block, disallowed field
- **Reference error**: unresolved reference or invalid reference target type
- **Domain warning**: structurally valid but incomplete, underspecified, contested, or theoretically partial

### 3.2 Cross-Cutting Metadata

The following metadata fields remain cross-cutting but only where explicitly allowed:

- `name`
- `label`
- `status`
- `certainty`
- `notes`
- `tags`
- `source`
- `sources`
- `based_on`

### 3.3 Additional Controlled Starter Values

`0.7.0` retains previous starter sets and adds the following controlled sets where applicable.

`semantic_role.kind`:

- `agent`
- `patient`
- `theme`
- `experiencer`
- `recipient`
- `instrument`
- `location`
- `source`
- `goal`

`pragmatic_profile.kind`:

- `politeness`
- `taboo`
- `ritual`
- `gendered_usage`
- `group_marker`
- `diglossic`
- `discourse_marker`

`prosody.kind`:

- `stress`
- `tone`
- `intonation`
- `phrasing`
- `length`
- `metrical`

`annotation_layer.kind`:

- `morphology`
- `gloss`
- `syntax`
- `semantics`
- `pragmatics`
- `prosody`
- `translation`

`classifier_system.kind`:

- `nominal`
- `verbal`
- `sortal`
- `mensural`

`switch_reference.kind`:

- `same_subject`
- `different_subject`

Implementations may permit additional atoms but should emit a domain warning when a non-standard value appears in a standardized field.

## 4. Existing Schemas Refined in `0.7.0`

This section records normative refinements on top of earlier layers.

## 4.1 `entry` Refinements

### New optional fields

- `senses`: list of `sense` references
- `semantic_roles`: list of `semantic_role` references
- `pragmatics`: list of `pragmatic_profile` references

### Additional validation

- `senses`, if present, must contain only `sense` references
- `semantic_roles`, if present, must contain only `semantic_role` references
- `pragmatics`, if present, must contain only `pragmatic_profile` references

## 4.2 `construction` Refinements

### New optional fields

- `discourse_function`: string or atom
- `semantic_roles`: list of `semantic_role` references
- `pragmatics`: list of `pragmatic_profile` references
- `switch_reference`: reference to `switch_reference`

### Additional validation

- `semantic_roles`, if present, must contain only `semantic_role` references
- `pragmatics`, if present, must contain only `pragmatic_profile` references
- `switch_reference`, if present, must target `switch_reference`

## 4.3 `phonology` Refinements

### New optional fields

- `prosody`: reference to `prosody`

### Additional validation

- `prosody`, if present, must target `prosody`

## 4.4 `text` Refinements

### New optional fields

- `layers`: list of `annotation_layer` references
- `parallel_segments`: list of `text` references

### Additional validation

- `layers`, if present, must contain only `annotation_layer` references
- `parallel_segments`, if present, must contain only `text` references

## 4.5 `analysis` Refinements

### New optional fields

- `evidence`: list of references

### Additional validation

- `evidence`, if present, must contain only references

## 4.6 `grammar` Refinements

### New optional fields

- `classifier_systems`: list of `classifier_system` references
- `template_morphologies`: list of `template_morphology` references
- `polysynthesis_profiles`: list of `polysynthesis_profile` references

### Additional validation

- `classifier_systems`, if present, must contain only `classifier_system` references
- `template_morphologies`, if present, must contain only `template_morphology` references
- `polysynthesis_profiles`, if present, must contain only `polysynthesis_profile` references

## 5. New General Linguistic Schemas

## 5.1 `semantic_domain`

### Purpose

The `semantic_domain` block defines a semantic field, classificatory semantic space, or conceptual domain used by lexical or constructional meanings.

### Required fields

- `name`: string

### Optional fields

- `parent`: reference to `semantic_domain`
- `description`: string or multi-line text
- `tags`: list of atoms or strings
- `notes`: string or multi-line text
- `status`: atom
- `certainty`: atom

### Reference targets

- `parent` -> `semantic_domain`

### Minimal validation

- `name` is required
- `parent`, if present, must target `semantic_domain`

### Minimal example

```txt
semantic_domain motion {
  name: "Motion"
}
```

### Standard example

```txt
semantic_domain water {
  name: "Water"
  parent: semantic_domain:nature
}
```

### Extended example

```txt
semantic_domain ritual_speech {
  name: "Ritual Speech"
  description: "Semantic domain associated with liturgical and ceremonial expressions."
  parent: semantic_domain:social_practice
}
```

### Invalid examples

Missing `name`:

```txt
semantic_domain water {
  description: "Water-related meanings."
}
```

Wrong `parent` target:

```txt
semantic_domain water {
  name: "Water"
  parent: entry:varu
}
```

## 5.2 `sense`

### Purpose

The `sense` block defines a distinct meaning associated with a lexical entry.

### Required fields

At least one of:

- `gloss`: string
- `definition`: string or multi-line text

### Optional fields

- `entry`: reference to `entry`
- `gloss`: string
- `definition`: string or multi-line text
- `domains`: list of `semantic_domain` references
- `deixis`: atom or string
- `modality`: atom or string
- `evidentiality`: atom or string
- `change`: string or multi-line text
- `notes`: string or multi-line text
- `status`: atom
- `certainty`: atom

### Reference targets

- `entry` -> `entry`
- `domains` -> `semantic_domain`

### Minimal validation

- at least one of `gloss` or `definition` is required
- `entry`, if present, must target `entry`
- `domains`, if present, must contain only `semantic_domain` references

### Minimal example

```txt
sense varu_s1 {
  gloss: "to drink"
}
```

### Standard example

```txt
sense varu_s1 {
  entry: entry:varu
  gloss: "to drink"
  domains: [semantic_domain:consumption]
}
```

### Extended example

```txt
sense salun_s2 {
  entry: entry:salun
  gloss: "breath"
  definition: "A secondary animate or inner-life reading beside the primary wind sense."
  domains: [semantic_domain:body, semantic_domain:air]
  change: "Likely semantic extension from wind to breath."
  certainty: medium
}
```

### Invalid examples

Missing `gloss` and `definition`:

```txt
sense varu_s1 {
  entry: entry:varu
}
```

Wrong `domains` target:

```txt
sense varu_s1 {
  gloss: "to drink"
  domains: [entry:varu]
}
```

## 5.3 `semantic_role`

### Purpose

The `semantic_role` block models role relations used by constructions, entries, and argument structure descriptions.

### Required fields

- `kind`: atom

### Optional fields

- `label`: string
- `description`: string or multi-line text
- `used_in`: list of `entry`, `construction`, or `analysis` references
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `used_in` -> `entry`, `construction`, or `analysis`

### Minimal validation

- `kind` is required
- `kind`, if present, should use the controlled starter set
- `used_in`, if present, must contain only allowed references

### Minimal example

```txt
semantic_role agent_role {
  kind: agent
}
```

### Standard example

```txt
semantic_role patient_role {
  kind: patient
  description: "Affected undergoer argument."
}
```

### Extended example

```txt
semantic_role experiencer_role {
  kind: experiencer
  used_in: [entry:salun, construction:basic_clause]
  certainty: medium
}
```

### Invalid examples

Missing `kind`:

```txt
semantic_role patient_role {
  label: "patient"
}
```

Wrong `used_in` target:

```txt
semantic_role patient_role {
  kind: patient
  used_in: [phoneme:n]
}
```

## 5.4 `pragmatic_profile`

### Purpose

The `pragmatic_profile` block models usage conditions, social meanings, discourse effects, and sociolinguistic constraints.

### Required fields

- `kind`: atom

### Optional fields

- `label`: string
- `description`: string or multi-line text
- `used_by`: list of `register`, `dialect`, `entry`, `construction`, or `text` references
- `politeness`: atom or string
- `taboo_level`: atom or string
- `ritual_context`: string or multi-line text
- `group_index`: string or multi-line text
- `diglossia_role`: atom or string
- `notes`: string or multi-line text
- `status`: atom
- `certainty`: atom

### Reference targets

- `used_by` -> `register`, `dialect`, `entry`, `construction`, or `text`

### Minimal validation

- `kind` is required
- `kind`, if present, should use the controlled starter set
- `used_by`, if present, must contain only allowed reference types

### Minimal example

```txt
pragmatic_profile formal_politeness {
  kind: politeness
}
```

### Standard example

```txt
pragmatic_profile ritual_register_profile {
  kind: ritual
  description: "Restricted to ceremonial and liturgical use."
}
```

### Extended example

```txt
pragmatic_profile taboo_register_profile {
  kind: taboo
  taboo_level: high
  used_by: [register:formal_taren, text:tx1]
  notes: "Use avoided in public and honorific contexts."
}
```

### Invalid examples

Missing `kind`:

```txt
pragmatic_profile taboo_register_profile {
  taboo_level: high
}
```

Wrong `used_by` target:

```txt
pragmatic_profile taboo_register_profile {
  kind: taboo
  used_by: [phoneme:n]
}
```

## 5.5 `prosody`

### Purpose

The `prosody` block models structured non-segmental phonology such as stress, tone, intonation, phrasing, length, and metrical organization.

### Required fields

At least one of:

- `kind`: atom
- `pattern`: string

### Optional fields

- `kind`: atom
- `pattern`: string
- `stress_rule`: string
- `tone_pattern`: string
- `intonation_pattern`: string
- `phrasing`: string
- `length_system`: string
- `metrical_structure`: string
- `applies_to`: list of `phonology`, `text`, `stage`, or `language` references
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `applies_to` -> `phonology`, `text`, `stage`, or `language`

### Minimal validation

- at least one of `kind` or `pattern` is required
- `kind`, if present, should use the controlled starter set
- `applies_to`, if present, must contain only allowed reference types

### Minimal example

```txt
prosody taren_stress {
  kind: stress
}
```

### Standard example

```txt
prosody taren_stress {
  kind: stress
  stress_rule: "penultimate"
  applies_to: [phonology:taren_core]
}
```

### Extended example

```txt
prosody old_taren_prosody {
  kind: tone
  tone_pattern: "High on final heavy syllables; low elsewhere."
  intonation_pattern: "Rising contour in polar questions."
  applies_to: [phonology:old_taren_core, stage:old_taren]
}
```

### Invalid examples

Missing `kind` and `pattern`:

```txt
prosody taren_stress {
  notes: "Prosodic notes."
}
```

Wrong `applies_to` target:

```txt
prosody taren_stress {
  kind: stress
  applies_to: [entry:varu]
}
```

## 5.6 `annotation_layer`

### Purpose

The `annotation_layer` block defines a structured annotation perspective attached to texts or text segments.

### Required fields

- `kind`: atom

### Optional fields

- `label`: string
- `description`: string or multi-line text
- `targets`: list of `text`, `example`, or `analysis` references
- `schema_notes`: string or multi-line text
- `notes`: string or multi-line text
- `certainty`: atom

### Optional child blocks

- `annotation <id>`

Each `annotation` block may contain:

- `target_segment`: string or reference
- `value`: string or multi-line text
- `analysis`: reference to `analysis`

### Reference targets

- `targets` -> `text`, `example`, or `analysis`
- `annotation.*.analysis` -> `analysis`

### Minimal validation

- `kind` is required
- `kind`, if present, should use the controlled starter set
- `targets`, if present, must contain only allowed reference types

### Minimal example

```txt
annotation_layer gloss_layer {
  kind: gloss
}
```

### Standard example

```txt
annotation_layer syntax_layer {
  kind: syntax
  targets: [text:tx1]
}
```

### Extended example

```txt
annotation_layer semantics_layer {
  kind: semantics
  targets: [text:tx1, analysis:varu_main]

  annotation ann1 {
    target_segment: "s1"
    value: "Predicate of ingestion."
    analysis: analysis:varu_main
  }
}
```

### Invalid examples

Missing `kind`:

```txt
annotation_layer semantics_layer {
  label: "semantics"
}
```

Wrong `targets` target:

```txt
annotation_layer semantics_layer {
  kind: semantics
  targets: [phoneme:n]
}
```

## 5.7 `corpus_view`

### Purpose

The `corpus_view` block defines a grouped perspective over a set of texts, annotations, or evidence slices without becoming a full query language.

### Required fields

At least one of:

- `texts`: list of `text` references
- `layers`: list of `annotation_layer` references

### Optional fields

- `label`: string
- `texts`: list of `text` references
- `layers`: list of `annotation_layer` references
- `focus`: string or multi-line text
- `notes`: string or multi-line text
- `tags`: list of atoms or strings

### Reference targets

- `texts` -> `text`
- `layers` -> `annotation_layer`

### Minimal validation

- at least one of `texts` or `layers` is required
- `texts`, if present, must contain only `text` references
- `layers`, if present, must contain only `annotation_layer` references

### Minimal example

```txt
corpus_view ritual_texts {
  texts: [text:tx1]
}
```

### Standard example

```txt
corpus_view semantics_focus {
  texts: [text:tx1, text:tx2]
  layers: [annotation_layer:semantics_layer]
}
```

### Extended example

```txt
corpus_view politeness_texts {
  label: "Politeness-marked texts"
  texts: [text:tx1, text:tx2]
  layers: [annotation_layer:pragmatics_layer]
  focus: "Texts with honorific and ritual usage patterns."
}
```

### Invalid examples

Missing `texts` and `layers`:

```txt
corpus_view ritual_texts {
  label: "ritual"
}
```

Wrong `layers` target:

```txt
corpus_view semantics_focus {
  layers: [analysis:varu_main]
}
```

## 6. Specialist Schemas

## 6.1 `sign_unit`

### Purpose

The `sign_unit` block models a sign-language lexical or sublexical unit.

### Required fields

At least one of:

- `handshape`: string
- `movement`: string
- `location`: string

### Optional fields

- `entry`: reference to `entry`
- `handshape`: string
- `movement`: string
- `location`: string
- `orientation`: string
- `nonmanuals`: list of strings
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `entry` -> `entry`

### Minimal validation

- at least one of `handshape`, `movement`, or `location` is required
- `entry`, if present, must target `entry`

### Minimal example

```txt
sign_unit greet_sign {
  handshape: "flat-B"
}
```

### Standard example

```txt
sign_unit greet_sign {
  handshape: "flat-B"
  movement: "outward arc"
  location: "neutral space"
}
```

### Extended example

```txt
sign_unit greet_sign {
  entry: entry:greet
  handshape: "flat-B"
  movement: "outward arc"
  location: "neutral space"
  orientation: "palm outward"
  nonmanuals: ["slight brow raise"]
}
```

### Invalid examples

Missing all core form fields:

```txt
sign_unit greet_sign {
  entry: entry:greet
}
```

Wrong `entry` target:

```txt
sign_unit greet_sign {
  handshape: "flat-B"
  entry: phoneme:n
}
```

## 6.2 `classifier_system`

### Purpose

The `classifier_system` block models classifier inventories and their distributional behavior.

### Required fields

- `kind`: atom

### Optional fields

- `inventory`: list of strings or atoms
- `used_in`: list of `grammar`, `entry`, or `construction` references
- `conditions`: string or multi-line text
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `used_in` -> `grammar`, `entry`, or `construction`

### Minimal validation

- `kind` is required
- `kind`, if present, should use the controlled starter set
- `used_in`, if present, must contain only allowed reference types

### Minimal example

```txt
classifier_system taren_nominal_classifiers {
  kind: nominal
}
```

### Standard example

```txt
classifier_system taren_nominal_classifiers {
  kind: nominal
  inventory: [flat, long, animate]
}
```

### Extended example

```txt
classifier_system taren_nominal_classifiers {
  kind: nominal
  inventory: [flat, long, animate]
  used_in: [grammar:taren_grammar, construction:count_phrase]
  conditions: "Animate classifier required for humans and personified referents."
}
```

### Invalid examples

Missing `kind`:

```txt
classifier_system taren_nominal_classifiers {
  inventory: [flat, long]
}
```

Wrong `used_in` target:

```txt
classifier_system taren_nominal_classifiers {
  kind: nominal
  used_in: [phoneme:n]
}
```

## 6.3 `switch_reference`

### Purpose

The `switch_reference` block models same-subject and different-subject tracking systems across clause chains.

### Required fields

- `kind`: atom

### Optional fields

- `marker`: string or atom
- `used_in`: list of `construction`, `grammar`, or `text` references
- `conditions`: string or multi-line text
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `used_in` -> `construction`, `grammar`, or `text`

### Minimal validation

- `kind` is required
- `kind`, if present, should use the controlled starter set
- `used_in`, if present, must contain only allowed reference types

### Minimal example

```txt
switch_reference sr_same_subject {
  kind: same_subject
}
```

### Standard example

```txt
switch_reference sr_same_subject {
  kind: same_subject
  marker: "-sa"
}
```

### Extended example

```txt
switch_reference sr_diff_subject {
  kind: different_subject
  marker: "-ti"
  used_in: [construction:clause_chain, grammar:taren_grammar]
  conditions: "Used when the following clause has a non-coreferential subject."
}
```

### Invalid examples

Missing `kind`:

```txt
switch_reference sr_same_subject {
  marker: "-sa"
}
```

Wrong `used_in` target:

```txt
switch_reference sr_same_subject {
  kind: same_subject
  used_in: [entry:varu]
}
```

## 6.4 `template_morphology`

### Purpose

The `template_morphology` block models root-and-pattern or other non-concatenative template systems.

### Required fields

At least one of:

- `root_pattern`: string
- `template`: string

### Optional fields

- `root_pattern`: string
- `template`: string
- `used_in`: list of `entry`, `morpheme`, or `grammar` references
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `used_in` -> `entry`, `morpheme`, or `grammar`

### Minimal validation

- at least one of `root_pattern` or `template` is required
- `used_in`, if present, must contain only allowed reference types

### Minimal example

```txt
template_morphology tm_basic {
  template: "CVCVC"
}
```

### Standard example

```txt
template_morphology tm_basic {
  root_pattern: "K-T-B"
  template: "CaCaC"
}
```

### Extended example

```txt
template_morphology tm_basic {
  root_pattern: "K-T-B"
  template: "CaCaC"
  used_in: [grammar:taren_grammar, entry:katab]
  notes: "Root consonants interdigitate with vocalic melody."
}
```

### Invalid examples

Missing `root_pattern` and `template`:

```txt
template_morphology tm_basic {
  notes: "templatic morphology"
}
```

Wrong `used_in` target:

```txt
template_morphology tm_basic {
  template: "CVCVC"
  used_in: [phoneme:n]
}
```

## 6.5 `polysynthesis_profile`

### Purpose

The `polysynthesis_profile` block models highly synthetic or polysynthetic morphological packaging strategies.

### Required fields

At least one of:

- `description`: string or multi-line text
- `features`: list of strings or atoms

### Optional fields

- `description`: string or multi-line text
- `features`: list of strings or atoms
- `used_in`: list of `grammar`, `construction`, or `entry` references
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `used_in` -> `grammar`, `construction`, or `entry`

### Minimal validation

- at least one of `description` or `features` is required
- `used_in`, if present, must contain only allowed reference types

### Minimal example

```txt
polysynthesis_profile poly_core {
  features: [incorporation]
}
```

### Standard example

```txt
polysynthesis_profile poly_core {
  description: "High argument indexing and noun incorporation."
  features: [incorporation, agreement, valency_packaging]
}
```

### Extended example

```txt
polysynthesis_profile poly_core {
  description: "High argument indexing and noun incorporation."
  features: [incorporation, agreement, valency_packaging]
  used_in: [grammar:taren_grammar, construction:verb_complex]
}
```

### Invalid examples

Missing `description` and `features`:

```txt
polysynthesis_profile poly_core {
  notes: "polysynthetic behavior"
}
```

Wrong `used_in` target:

```txt
polysynthesis_profile poly_core {
  features: [incorporation]
  used_in: [phoneme:n]
}
```

## 7. Combined Example

```txt
dsl 0.7.0

semantic_domain consumption {
  name: "Consumption"
}

sense varu_s1 {
  entry: entry:varu
  gloss: "to drink"
  domains: [semantic_domain:consumption]
}

semantic_role agent_role {
  kind: agent
}

pragmatic_profile ritual_profile {
  kind: ritual
  description: "Restricted to ceremonial recitation."
  used_by: [register:formal_taren, text:tx1]
}

prosody old_taren_prosody {
  kind: stress
  stress_rule: "penultimate"
  applies_to: [phonology:old_taren_core]
}

annotation_layer semantics_layer {
  kind: semantics
  targets: [text:tx1]
}

corpus_view ritual_texts {
  texts: [text:tx1]
  layers: [annotation_layer:semantics_layer]
}

classifier_system taren_nominal_classifiers {
  kind: nominal
  inventory: [flat, long, animate]
}

switch_reference sr_same_subject {
  kind: same_subject
  marker: "-sa"
}

template_morphology tm_basic {
  root_pattern: "K-T-B"
  template: "CaCaC"
}

polysynthesis_profile poly_core {
  features: [incorporation]
}

sign_unit greet_sign {
  handshape: "flat-B"
  movement: "outward arc"
  location: "neutral space"
}
```

## 8. Conformance

A `0.7.0` schema-aware implementation conforms if it:

- accepts the earlier syntax and schema layers through `0.5.0`
- validates the new advanced linguistic schemas defined here
- applies refined field and reference rules to existing blocks where this document extends them
- distinguishes schema errors, reference errors, and domain warnings

A `0.7.0` document conforms if it:

- declares `dsl 0.7.0`
- uses valid syntax under the earlier syntax baseline
- uses standardized block types according to the rules defined in `0.7.0` where those block types appear

## 9. Future Directions

Likely next steps after `0.7.0`:

- technical consolidation toward parser fixtures and machine-readable schema tables
- import, module, and namespace semantics
- more detailed modality-specific and theoretical extensions
