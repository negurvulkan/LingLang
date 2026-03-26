# LingLang DSL Specification v0.8.0

Status: Draft

This document defines version `0.8.0` of the LingLang DSL. Version `0.8.0` keeps the syntax and schema layers introduced in `0.1.1` through `0.7.0` and adds a general framework for irregularity, exception handling, blocking, and structured deviation from regular linguistic expectations.

Version `0.8.0` standardizes:

- the earlier syntax and schema layers through `0.7.0`
- a general irregularity framework
- explicit exception modeling across morphology, paradigms, diachrony, constructions, and texts
- normative priority and conflict rules for regular patterns and exceptions
- structured distinction between systemic irregularity and evidence-level deviation

Version `0.8.0` does not yet standardize:

- automatic rule application
- a derivation engine
- parser implementation details
- import, namespace, or module systems
- generalized computational execution semantics

## 1. Layer Model

The LingLang DSL now has seven normative layers:

- **Core Syntax** from `0.1.1`
- **Core Schemas** from `0.2.0`
- **Extended Core Schemas** from `0.3.0`
- **Variation, Evidence, and Analysis Layer** from `0.4.0`
- **Model and Authoring Layer** from `0.5.0`
- **Advanced Linguistic Coverage Layer** from `0.7.0`
- **Irregularity and Exception Layer** from `0.8.0`

`0.8.0` adds no new surface syntax. It extends the object and schema model for irregularity and exceptional behavior.

## 2. Version Declaration

Conforming `0.8.0` documents should begin with:

```txt
dsl 0.8.0
```

## 3. Cross-Cutting Conventions

### 3.1 Validation Classes

Schema-aware tooling should distinguish:

- **Schema error**: required fields missing, invalid child blocks, wrong value types
- **Reference error**: invalid target type or unresolved reference
- **Domain warning**: structurally valid but incomplete, disputed, underspecified, or interpretively weak

### 3.2 Controlled Starter Values

`0.8.0` retains all earlier starter sets and adds the following controlled values for irregularity handling.

`irregularity.kind`:

- `suppletion`
- `stem_alternation`
- `defective`
- `lexicalized_exception`
- `analogical`
- `poetic`
- `archaism`
- `performance_error`
- `register_exception`
- `constructional_exception`

`exception_case.kind`:

- `form_exception`
- `cell_exception`
- `distribution_exception`
- `rule_exception`
- `usage_exception`

`blocking_rule.kind`:

- `derivational_block`
- `paradigmatic_block`
- `phonological_block`
- `constructional_block`

### 3.3 Priority Rules

`0.8.0` normatively defines the following precedence principles:

1. An explicitly linked exception overrides a more general rule that would otherwise apply.
2. A blocking rule prevents the generation or expectation of a regular outcome when both target the same domain.
3. Lexically bound irregularity takes precedence over productive regularity.
4. A specialized irregularity block refines the general irregularity object, but must not contradict its declared target and scope.
5. Evidence-level deviations in texts do not automatically imply system-level irregularity unless explicitly linked.

## 4. Existing Schemas Refined in `0.8.0`

## 4.1 `entry` Refinements

### New optional fields

- `irregularities`: list of `irregularity` or `morph_irregularity` references
- `blocked_by`: list of `blocking_rule` references

### Additional validation

- `irregularities`, if present, must contain only `irregularity` or `morph_irregularity` references
- `blocked_by`, if present, must contain only `blocking_rule` references

## 4.2 `morpheme` Refinements

### New optional fields

- `irregularities`: list of `irregularity` or `morph_irregularity` references

### Additional validation

- `irregularities`, if present, must contain only allowed irregularity references

## 4.3 `paradigm` Refinements

### New optional fields

- `irregularities`: list of `paradigm_irregularity` references

### Additional validation

- `irregularities`, if present, must contain only `paradigm_irregularity` references

## 4.4 `soundchange` Refinements

### New optional fields

- `exceptions`: list of `soundchange_exception` references

### Additional validation

- `exceptions`, if present, must contain only `soundchange_exception` references

## 4.5 `construction` Refinements

### New optional fields

- `exceptions`: list of `construction_exception` references

### Additional validation

- `exceptions`, if present, must contain only `construction_exception` references

## 4.6 `text` Refinements

### New optional fields

- `exceptions`: list of `text_exception` references

### Additional validation

- `exceptions`, if present, must contain only `text_exception` references

## 4.7 `analysis` Refinements

### New optional fields

- `irregularity_target`: reference to `irregularity` or a specialized irregularity block

### Additional validation

- `irregularity_target`, if present, must target an irregularity block

## 5. General Irregularity Core

## 5.1 `irregularity`

### Purpose

The `irregularity` block is the general umbrella object for any deviation from a regular rule, expected pattern, or productive structure.

### Required fields

- `kind`: atom
- `target`: reference

### Optional fields

- `exception_to`: reference
- `overrides`: reference
- `applies_in`: list of references
- `evidence`: list of references
- `status`: atom
- `certainty`: atom
- `notes`: string or multi-line text

### Reference targets

- `target` -> any addressable object
- `exception_to` -> any addressable rule-, pattern-, or schema-bearing object
- `overrides` -> any addressable rule-, pattern-, or schema-bearing object
- `applies_in` -> any addressable object
- `evidence` -> `text`, `analysis`, `example`, `entry`, `construction`

### Minimal validation

- `kind` is required
- `target` is required
- `kind`, if present, should use the controlled starter set

### Minimal example

```txt
irregularity irr_varu {
  kind: lexicalized_exception
  target: entry:varu
}
```

### Standard example

```txt
irregularity irr_varu {
  kind: lexicalized_exception
  target: entry:varu
  exception_to: construction:basic_clause
}
```

### Extended example

```txt
irregularity irr_varu {
  kind: analogical
  target: entry:varu
  exception_to: soundchange:proto_to_old
  evidence: [text:tx1, analysis:varu_main]
  certainty: medium
}
```

### Invalid examples

Missing `target`:

```txt
irregularity irr_varu {
  kind: lexicalized_exception
}
```

Missing `kind`:

```txt
irregularity irr_varu {
  target: entry:varu
}
```

## 5.2 `exception_case`

### Purpose

The `exception_case` block records a concrete documented deviation, often linked to a more general irregularity object.

### Required fields

- `kind`: atom
- `target`: reference

### Optional fields

- `irregularity`: reference to `irregularity`
- `expected`: string or multi-line text
- `actual`: string or multi-line text
- `applies_in`: list of references
- `evidence`: list of references
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `target` -> any addressable object
- `irregularity` -> `irregularity`
- `applies_in` -> any addressable object
- `evidence` -> `text`, `example`, `analysis`, `entry`, `construction`

### Minimal validation

- `kind` is required
- `target` is required
- `irregularity`, if present, must target `irregularity`

### Minimal example

```txt
exception_case exc_varu {
  kind: form_exception
  target: entry:varu
}
```

### Standard example

```txt
exception_case exc_varu {
  kind: form_exception
  target: entry:varu
  expected: "regular derived form"
  actual: "lexicalized special form"
}
```

### Extended example

```txt
exception_case exc_varu {
  kind: usage_exception
  target: construction:basic_clause
  irregularity: irregularity:irr_varu
  expected: "general SOV order"
  actual: "marked inversion in ritual context"
  evidence: [text:tx1]
}
```

### Invalid examples

Wrong `irregularity` target:

```txt
exception_case exc_varu {
  kind: form_exception
  target: entry:varu
  irregularity: entry:varu
}
```

Missing `kind`:

```txt
exception_case exc_varu {
  target: entry:varu
}
```

## 5.3 `blocking_rule`

### Purpose

The `blocking_rule` block models cases where a regular or expected derivation, form, or interpretation is prevented from surfacing.

### Required fields

- `kind`: atom
- `target`: reference

### Optional fields

- `blocked_form`: string or multi-line text
- `blocked_by`: reference
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `target` -> any addressable object
- `blocked_by` -> `irregularity`, `morph_irregularity`, `paradigm_irregularity`, `construction_exception`

### Minimal validation

- `kind` is required
- `target` is required
- `kind`, if present, should use the controlled starter set
- `blocked_by`, if present, must target an allowed irregularity block

### Minimal example

```txt
blocking_rule block_drink_nominal {
  kind: derivational_block
  target: entry:varu
}
```

### Standard example

```txt
blocking_rule block_drink_nominal {
  kind: derivational_block
  target: entry:varu
  blocked_form: "expected deverbal noun"
}
```

### Extended example

```txt
blocking_rule block_drink_nominal {
  kind: derivational_block
  target: entry:varu
  blocked_form: "expected deverbal noun"
  blocked_by: morph_irregularity:varu_suppletion
}
```

### Invalid examples

Missing `target`:

```txt
blocking_rule block_drink_nominal {
  kind: derivational_block
}
```

Wrong `blocked_by` target:

```txt
blocking_rule block_drink_nominal {
  kind: derivational_block
  target: entry:varu
  blocked_by: text:tx1
}
```

## 6. Specialized Irregularity Blocks

## 6.1 `morph_irregularity`

### Purpose

The `morph_irregularity` block models suppletion, stem alternation, defection, irregular allomorphy, and blocked derivation in lexical or morphological structure.

### Required fields

- `kind`: atom
- `target`: reference to `entry` or `morpheme`

### Optional fields

- `suppletive_with`: reference to `entry` or `morpheme`
- `irregular_form`: string
- `expected_form`: string
- `blocked_derivation`: string
- `applies_in`: list of `paradigm`, `register`, or `construction` references
- `notes`: string or multi-line text
- `certainty`: atom

### Reference targets

- `target` -> `entry` or `morpheme`
- `suppletive_with` -> `entry` or `morpheme`
- `applies_in` -> `paradigm`, `register`, or `construction`

### Minimal validation

- `kind` is required
- `target` is required

### Minimal example

```txt
morph_irregularity varu_suppletion {
  kind: suppletion
  target: entry:varu
}
```

### Standard example

```txt
morph_irregularity varu_stem_change {
  kind: stem_alternation
  target: entry:varu
  expected_form: "varu"
  irregular_form: "veru"
}
```

### Extended example

```txt
morph_irregularity varu_suppletion {
  kind: suppletion
  target: entry:varu
  suppletive_with: entry:drink_alt
  applies_in: [paradigm:pronoun_case]
}
```

### Invalid examples

Wrong `target` type:

```txt
morph_irregularity varu_suppletion {
  kind: suppletion
  target: phoneme:n
}
```

Missing `kind`:

```txt
morph_irregularity varu_suppletion {
  target: entry:varu
}
```

## 6.2 `paradigm_irregularity`

### Purpose

The `paradigm_irregularity` block models exceptional paradigm cells, missing forms, defective paradigms, and irregular stem realizations.

### Required fields

- `kind`: atom
- `target`: reference to `paradigm`

### Optional fields

- `row`: string or reference
- `cell`: string
- `expected_form`: string
- `actual_form`: string
- `notes`: string or multi-line text
- `certainty`: atom

### Minimal validation

- `kind` is required
- `target` must target `paradigm`

### Minimal example

```txt
paradigm_irregularity pronoun_gap {
  kind: defective
  target: paradigm:pronoun_case
}
```

### Standard example

```txt
paradigm_irregularity pronoun_gap {
  kind: defective
  target: paradigm:pronoun_case
  row: "first_singular"
  cell: "genitive"
}
```

### Extended example

```txt
paradigm_irregularity pronoun_override {
  kind: stem_alternation
  target: paradigm:pronoun_case
  row: "first_singular"
  cell: "genitive"
  expected_form: "ka-ren"
  actual_form: "ken"
}
```

### Invalid examples

Wrong `target` type:

```txt
paradigm_irregularity pronoun_gap {
  kind: defective
  target: entry:varu
}
```

Missing `target`:

```txt
paradigm_irregularity pronoun_gap {
  kind: defective
}
```

## 6.3 `soundchange_exception`

### Purpose

The `soundchange_exception` block models lexical, analogical, or contact-induced exceptions to regular sound change.

### Required fields

- `target`: reference to `soundchange`

### Optional fields

- `rule`: string or reference
- `affected`: list of `entry`, `morpheme`, or `stage` references
- `expected_outcome`: string
- `actual_outcome`: string
- `reason`: string or multi-line text
- `notes`: string or multi-line text
- `certainty`: atom

### Minimal validation

- `target` must target `soundchange`
- `affected`, if present, must contain only `entry`, `morpheme`, or `stage` references

### Minimal example

```txt
soundchange_exception sc_exc_1 {
  target: soundchange:proto_to_old
}
```

### Standard example

```txt
soundchange_exception sc_exc_1 {
  target: soundchange:proto_to_old
  affected: [entry:varu]
  expected_outcome: "f"
  actual_outcome: "p"
}
```

### Extended example

```txt
soundchange_exception sc_exc_1 {
  target: soundchange:proto_to_old
  rule: "sc1"
  affected: [entry:varu]
  expected_outcome: "f"
  actual_outcome: "p"
  reason: "Analogical restoration in ritual lexicon."
}
```

### Invalid examples

Wrong `target`:

```txt
soundchange_exception sc_exc_1 {
  target: entry:varu
}
```

Wrong `affected` target:

```txt
soundchange_exception sc_exc_1 {
  target: soundchange:proto_to_old
  affected: [phoneme:n]
}
```

## 6.4 `construction_exception`

### Purpose

The `construction_exception` block models exceptional realizations of a construction, including register-bound, discourse-bound, or lexically restricted deviations.

### Required fields

- `target`: reference to `construction`

### Optional fields

- `entry`: reference to `entry`
- `register`: reference to `register`
- `expected_pattern`: string
- `actual_pattern`: string
- `notes`: string or multi-line text
- `certainty`: atom

### Minimal validation

- `target` must target `construction`
- `entry`, if present, must target `entry`
- `register`, if present, must target `register`

### Minimal example

```txt
construction_exception ce_basic {
  target: construction:basic_clause
}
```

### Standard example

```txt
construction_exception ce_basic {
  target: construction:basic_clause
  register: register:formal_taren
  expected_pattern: "SOV"
  actual_pattern: "OSV"
}
```

### Extended example

```txt
construction_exception ce_basic {
  target: construction:basic_clause
  entry: entry:varu
  register: register:formal_taren
  expected_pattern: "SOV"
  actual_pattern: "OSV"
  notes: "Occurs only in elevated discourse."
}
```

### Invalid examples

Wrong `target`:

```txt
construction_exception ce_basic {
  target: entry:varu
}
```

Wrong `register`:

```txt
construction_exception ce_basic {
  target: construction:basic_clause
  register: phoneme:n
}
```

## 6.5 `text_exception`

### Purpose

The `text_exception` block models deviations found in actual attestations without requiring them to be elevated to a system-level irregularity.

### Required fields

- `target`: reference to `text`
- `kind`: atom

### Optional fields

- `segment`: string
- `expected`: string
- `attested`: string
- `linked_entry`: reference to `entry`
- `linked_construction`: reference to `construction`
- `notes`: string or multi-line text
- `certainty`: atom

### Minimal validation

- `target` must target `text`
- `kind` is required
- `linked_entry`, if present, must target `entry`
- `linked_construction`, if present, must target `construction`

### Minimal example

```txt
text_exception tx_exc_1 {
  target: text:tx1
  kind: poetic
}
```

### Standard example

```txt
text_exception tx_exc_1 {
  target: text:tx1
  kind: archaism
  segment: "s1"
  expected: "modern form"
  attested: "archaic form"
}
```

### Extended example

```txt
text_exception tx_exc_1 {
  target: text:tx1
  kind: performance_error
  segment: "s1"
  expected: "Ka varu."
  attested: "Ka vulav."
  linked_entry: entry:varu
}
```

### Invalid examples

Missing `kind`:

```txt
text_exception tx_exc_1 {
  target: text:tx1
}
```

Wrong `linked_entry`:

```txt
text_exception tx_exc_1 {
  target: text:tx1
  kind: poetic
  linked_entry: phoneme:n
}
```

## 7. Combined Example

```txt
dsl 0.8.0

irregularity irr_varu {
  kind: lexicalized_exception
  target: entry:varu
  evidence: [text:tx1, analysis:varu_main]
}

exception_case exc_varu {
  kind: form_exception
  target: entry:varu
  irregularity: irregularity:irr_varu
  expected: "regular derived form"
  actual: "lexicalized special form"
}

blocking_rule block_varu_nominal {
  kind: derivational_block
  target: entry:varu
  blocked_by: irregularity:irr_varu
}

morph_irregularity varu_stem_change {
  kind: stem_alternation
  target: entry:varu
  expected_form: "varu"
  irregular_form: "veru"
}

paradigm_irregularity pronoun_gap {
  kind: defective
  target: paradigm:pronoun_case
  row: "first_singular"
  cell: "genitive"
}

soundchange_exception sc_exc_1 {
  target: soundchange:proto_to_old
  affected: [entry:varu]
  expected_outcome: "f"
  actual_outcome: "p"
}

construction_exception ce_basic {
  target: construction:basic_clause
  register: register:formal_taren
  expected_pattern: "SOV"
  actual_pattern: "OSV"
}

text_exception tx_exc_1 {
  target: text:tx1
  kind: poetic
  segment: "s1"
  expected: "Ka varu."
  attested: "Ka vulav."
  linked_entry: entry:varu
}
```

## 8. Conformance

A `0.8.0` schema-aware implementation conforms if it:

- accepts the earlier syntax and schema layers through `0.7.0`
- validates the irregularity and exception layer defined here
- applies the priority rules in this document when multiple rules and exceptions target the same domain
- distinguishes schema errors, reference errors, and domain warnings

A `0.8.0` document conforms if it:

- declares `dsl 0.8.0`
- uses valid syntax under the earlier syntax baseline
- uses standardized irregularity blocks according to the rules defined here

## 9. Future Directions

Likely next steps after `0.8.0`:

- technical consolidation
- machine-readable schema tables and fixtures
- import, namespace, and override semantics
- eventual execution-oriented rule models
