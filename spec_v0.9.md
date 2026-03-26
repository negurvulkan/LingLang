# LingLang DSL Specification v0.9.0

Status: Draft

This document defines version `0.9.0` of the LingLang DSL. Version `0.9.0` keeps the syntax and schema layers introduced in `0.1.1` through `0.8.0` and serves as the final fachliche consolidation step before `1.0.0`.

Version `0.9.0` standardizes:

- the earlier syntax and schema layers through `0.8.0`
- deeper sign-language-oriented modeling inside `sign_unit`
- deeper structured prosodic modeling inside `prosody`
- stronger text anchoring and annotation linkage for `text` and `annotation_layer`
- more mature specialist schema behavior for `classifier_system`, `switch_reference`, `template_morphology`, and `polysynthesis_profile`
- a readiness statement for `1.0.0`

Version `0.9.0` does not yet standardize:

- parser implementation details
- import, module, and namespace systems
- machine-readable schema tables
- complete execution semantics for rules and derivations

## 1. Purpose of `0.9.0`

`0.9.0` is a consolidation release. It does not open new major linguistic domains. It deepens those areas that were already present but still clearly less mature than the broader core.

The target of `0.9.0` is to make `1.0.0` plausible as a stable general linguistic DSL core while still allowing advanced specialist areas to remain extensible.

## 2. Version Declaration

Conforming `0.9.0` documents should begin with:

```txt
dsl 0.9.0
```

## 3. Existing Schemas Refined in `0.9.0`

## 3.1 `sign_unit` Refinements

### New optional fields

- `nonmanual_profile`: string or object
- `simultaneous`: list of strings, atoms, or object literals
- `spatial_anchor`: string or object
- `modification`: string or object

### Refined interpretation

- `nonmanuals` from `0.7.0` remains valid as a simpler legacy-compatible field
- `nonmanual_profile` is the preferred structured form in `0.9.0`
- `simultaneous` expresses components that are produced at the same time
- `spatial_anchor` expresses discourse or referential placement in signing space
- `modification` expresses iconic, aspectual, or morphologically conditioned modulation

### Additional validation

- at least one of `handshape`, `movement`, `location`, `nonmanual_profile`, or `spatial_anchor` should be present
- `simultaneous`, if present, must not be empty
- `entry`, if present, must still target `entry`

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
  nonmanual_profile: "slight brow raise"
}
```

### Extended example

```txt
sign_unit greet_sign {
  entry: entry:greet
  handshape: "flat-B"
  movement: "outward arc"
  location: "neutral space"
  nonmanual_profile: "slight brow raise"
  simultaneous: ["mouth_gesture", "head_tilt"]
  spatial_anchor: { locus: "right", discourse_ref: "addressee" }
  modification: "iterated movement for habitual reading"
}
```

### Invalid examples

Missing all core sign structure:

```txt
sign_unit greet_sign {
  entry: entry:greet
}
```

Empty simultaneous structure:

```txt
sign_unit greet_sign {
  handshape: "flat-B"
  simultaneous: []
}
```

## 3.2 `prosody` Refinements

### New optional fields

- `domain`: atom or string
- `unit`: atom or string
- `association`: string or object
- `hierarchy`: list or object

### Refined interpretation

- `stress_rule`, `tone_pattern`, `intonation_pattern`, `phrasing`, `length_system`, and `metrical_structure` remain valid but are now treated as concrete realizations within a more structured prosodic schema
- `domain` describes the level at which the prosodic object operates
- `unit` describes the unit that carries or hosts the relevant pattern
- `association` describes linking between prosodic features and linguistic material
- `hierarchy` describes ordered prosodic levels or nesting

### Additional validation

- if `association` or `hierarchy` is used, `applies_to` should also be present
- `association` and `hierarchy` must not be empty placeholder values
- `applies_to`, if present, must still target `phonology`, `text`, `stage`, or `language`

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
  domain: word
  unit: syllable
  stress_rule: "penultimate"
  applies_to: [phonology:taren_core]
}
```

### Extended example

```txt
prosody old_taren_prosody {
  kind: tone
  domain: phrase
  unit: mora
  association: { tone_to: "final_mora", spreading: "rightward" }
  hierarchy: [syllable, foot, prosodic_word, phrase]
  tone_pattern: "High on final heavy syllables; low elsewhere."
  intonation_pattern: "Rising contour in polar questions."
  applies_to: [phonology:old_taren_core, text:tx1]
}
```

### Invalid examples

Structured hierarchy without target:

```txt
prosody old_taren_prosody {
  hierarchy: [syllable, foot]
}
```

Wrong `applies_to` target:

```txt
prosody taren_stress {
  kind: stress
  applies_to: [entry:varu]
}
```

## 3.3 `text` Refinements

### New optional fields

- `alignment_notes`: string or multi-line text

### Refined interpretation

- segment identifiers are the primary anchor layer for structured evidence
- `parallel_segments` should be used only where parallel units are meaningfully alignable
- `translation_block` remains valid and may coexist with segment-level translation

### Additional validation

- if `parallel_segments` is used, tooling should warn when no segmentation exists
- segment IDs should be unique within a `text` block

### Minimal example

```txt
text tx1 {
  content: "Ka varu."
}
```

### Standard example

```txt
text tx1 {
  language: language:taren

  segment s1 {
    surface: "Ka varu."
    translation: "I drink."
  }
}
```

### Extended example

```txt
text tx1 {
  language: language:taren
  alignment_notes: "Segment order matches translation alignment one-to-one."

  segment s1 {
    surface: "Ka varu."
    morph: "Ka | varu"
    gloss: "1SG | drink"
    translation: "I drink."
  }

  segment s2 {
    surface: "Ka tiral varu."
    morph: "Ka | tiral | varu"
    gloss: "1SG | water | drink"
    translation: "I drink water."
  }
}
```

### Invalid examples

Duplicate segment anchor is invalid by semantic validation:

```txt
text tx1 {
  segment s1 {
    surface: "Ka varu."
  }

  segment s1 {
    surface: "Ka tiral varu."
  }
}
```

Parallel segments without segmentation basis:

```txt
text tx1 {
  content: "Ka varu."
  parallel_segments: [text:tx2]
}
```

## 3.4 `annotation_layer` Refinements

### New optional fields

- `applies_to`: list of `text`, `segment`, `example`, or `analysis` references when representable as text anchors or textual targets

### Refined child-block fields

Each `annotation` block may additionally contain:

- `anchor`: string
- `span`: string or object

### Refined interpretation

- `anchor` is the preferred lightweight way to target a segment identifier such as `s1`
- `span` is the preferred way to describe subsegmental or multi-token scope when a simple anchor is not enough
- `targets` remains valid, but `applies_to` is preferred when the annotation layer has a stable anchoring domain

### Additional validation

- each `annotation` should contain at least one of `target_segment`, `anchor`, or `span`
- `applies_to`, if present, must contain only allowed targets

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
  applies_to: [text:tx1]

  annotation ann1 {
    anchor: "s1"
    value: "finite_clause"
  }
}
```

### Extended example

```txt
annotation_layer semantics_layer {
  kind: semantics
  applies_to: [text:tx1]

  annotation ann1 {
    anchor: "s1"
    span: { from: 1, to: 2 }
    value: "predicate of ingestion"
    analysis: analysis:varu_main
  }
}
```

### Invalid examples

Annotation without any anchor:

```txt
annotation_layer semantics_layer {
  kind: semantics

  annotation ann1 {
    value: "predicate"
  }
}
```

Wrong `applies_to` target:

```txt
annotation_layer semantics_layer {
  kind: semantics
  applies_to: [phoneme:n]
}
```

## 4. Specialist Schemas Refined in `0.9.0`

## 4.1 `classifier_system` Refinements

### New optional fields

- `selection_rules`: string or multi-line text
- `default_classifier`: string or atom

### Additional validation

- if `default_classifier` is present, it should be a member of `inventory`
- `used_in`, if present, should continue to target only `grammar`, `entry`, or `construction`

### Extended example

```txt
classifier_system taren_nominal_classifiers {
  kind: nominal
  inventory: [flat, long, animate]
  default_classifier: animate
  selection_rules: "Animate for humans, flat for plates and leaves, long for rods and rivers."
  used_in: [grammar:taren_grammar, construction:count_phrase]
}
```

## 4.2 `switch_reference` Refinements

### New optional fields

- `linked_texts`: list of `text` references
- `linked_constructions`: list of `construction` references

### Additional validation

- `linked_texts`, if present, must contain only `text` references
- `linked_constructions`, if present, must contain only `construction` references

### Extended example

```txt
switch_reference sr_diff_subject {
  kind: different_subject
  marker: "-ti"
  linked_texts: [text:tx1]
  linked_constructions: [construction:clause_chain]
  conditions: "Used when the following clause has a non-coreferential subject."
}
```

## 4.3 `template_morphology` Refinements

### New optional fields

- `melody`: string
- `domain`: string or atom

### Additional validation

- if both `root_pattern` and `melody` are present, `template` should usually also be present; omission is a domain warning

### Extended example

```txt
template_morphology tm_basic {
  root_pattern: "K-T-B"
  template: "CaCaC"
  melody: "a-a"
  domain: verb
  used_in: [grammar:taren_grammar, entry:katab]
}
```

## 4.4 `polysynthesis_profile` Refinements

### New optional fields

- `feature_groups`: object
- `integration_points`: list of `grammar`, `construction`, or `text` references

### Additional validation

- `integration_points`, if present, must contain only `grammar`, `construction`, or `text` references

### Extended example

```txt
polysynthesis_profile poly_core {
  description: "High argument indexing and noun incorporation."
  features: [incorporation, agreement, valency_packaging]
  feature_groups: { indexing: "high", incorporation: "productive" }
  integration_points: [grammar:taren_grammar, construction:verb_complex]
}
```

## 5. Readiness for `1.0.0`

### 5.1 Stable Core for `1.0.0`

The following areas are considered stable enough to serve as the general LingLang DSL core:

- core syntax and document model
- typed references and block architecture
- metadata and uncertainty framework
- language, lexicon, script, phonology, grammar, example, text
- morphology, paradigms, constructions, diachrony, variation, analysis
- semantic, pragmatic, and prosodic baseline modeling
- irregularity and exception framework

### 5.2 Advanced but Extensible Areas

The following areas are considered part of the advanced coverage of the DSL and may continue to evolve after `1.0.0` without undermining the stability of the core:

- sign-language-specific structural depth
- highly specialized prosodic theories
- corpus-facing alignment and annotation sophistication
- classifier systems, switch-reference, template morphology, polysynthesis profiles

### 5.3 Interpretation of `1.0.0`

`1.0.0` should mean:

- the general LingLang DSL core is stable and publishable
- major block families and cross-domain relations are in place
- future work will mainly concern refinement, profiles, tooling, and advanced specialist extensions rather than missing foundational linguistic coverage

## 6. Combined Example

```txt
dsl 0.9.0

sign_unit greet_sign {
  entry: entry:greet
  handshape: "flat-B"
  movement: "outward arc"
  nonmanual_profile: "slight brow raise"
  simultaneous: ["mouth_gesture", "head_tilt"]
  spatial_anchor: { locus: "right" }
}

prosody old_taren_prosody {
  kind: stress
  domain: word
  unit: syllable
  hierarchy: [syllable, foot, prosodic_word]
  association: { stress_to: "penultimate" }
  applies_to: [phonology:old_taren_core]
}

text tx1 {
  language: language:taren
  alignment_notes: "Segment alignment is literal."

  segment s1 {
    surface: "Ka varu."
    translation: "I drink."
  }
}

annotation_layer semantics_layer {
  kind: semantics
  applies_to: [text:tx1]

  annotation ann1 {
    anchor: "s1"
    span: { from: 1, to: 2 }
    value: "predicate of ingestion"
    analysis: analysis:varu_main
  }
}

classifier_system taren_nominal_classifiers {
  kind: nominal
  inventory: [flat, long, animate]
  default_classifier: animate
}

switch_reference sr_diff_subject {
  kind: different_subject
  marker: "-ti"
  linked_texts: [text:tx1]
}

template_morphology tm_basic {
  root_pattern: "K-T-B"
  template: "CaCaC"
  melody: "a-a"
}

polysynthesis_profile poly_core {
  features: [incorporation]
  integration_points: [grammar:taren_grammar]
}
```

## 7. Conformance

A `0.9.0` schema-aware implementation conforms if it:

- accepts the earlier syntax and schema layers through `0.8.0`
- validates the refined specialist and anchoring rules defined here
- distinguishes schema errors, reference errors, and domain warnings

A `0.9.0` document conforms if it:

- declares `dsl 0.9.0`
- uses valid syntax under the earlier syntax baseline
- uses the refined `0.9.0` rules for the blocks covered in this document where they appear

## 8. Future Directions

Likely next steps after `0.9.0`:

- `1.0.0` core stabilization
- parser fixtures and machine-readable schema tables
- modules, namespaces, and override semantics
