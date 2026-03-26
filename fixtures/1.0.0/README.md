# LingLang Fixture Set `1.0.0`

This directory contains the first fixture-first conformance and consistency set for LingLang `1.0.x`.

The goal of this fixture set is not to provide a full parser harness. It provides a structured repository of:

- valid and invalid DSL examples
- expected assertion metadata in JSON
- coverage for stable-core and advanced block families
- machine-checkable consistency targets for the JSON schema tables

## Structure

- `core/`: stable-core fixtures
- `advanced/`: advanced but still normative fixtures
- `conformance/`: AST, short-syntax, metadata, and doc-vs-JSON consistency fixtures

Each fixture group contains:

- `manifest.json`
- `sources/` with `.linglang` inputs where applicable
- `expected/` with assertion-oriented JSON expectations

## Check Runner

The initial consistency runner lives at:

- [run_fixture_consistency.py](/H:/Projekte/LingLang/checks/run_fixture_consistency.py)

It validates:

- manifest structure
- file existence
- version consistency
- fixture ID uniqueness
- block coverage against the `1.0.0` schema tables
- conformance-subject coverage against `conformance.schema-tables.json`

It does not yet:

- parse LingLang source files
- perform full schema validation
- perform AST roundtrip execution

## Scope

This first set is intentionally:

- fixture-first
- assertion-oriented
- doc-and-JSON consistency focused

It prepares the ground for later parser, AST, and roundtrip harnesses without requiring them yet.
