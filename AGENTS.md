# AGENTS

This file defines repository conventions for future coding agents and contributors.

## Scope

These instructions apply to the entire repository unless a more specific `AGENTS.md` is added in a subdirectory.

## Project Intent

LingLang is a specification-first project for a general linguistic DSL. The primary artifacts are specification documents, examples, schemas, and later parser-related assets. Changes should favor clarity, internal consistency, and long-term extensibility over premature implementation detail.

## Working Rules

- treat the specification as the primary source of truth
- prefer small, reviewable edits over large speculative rewrites
- preserve human readability in all examples
- keep syntax additions minimal until they are justified by multiple use cases
- separate syntax decisions from domain-schema decisions whenever possible
- do not silently rename DSL constructs without updating examples and changelog entries

## Versioning Policy

Use Semantic Versioning for the DSL and repository milestones.

- increment `PATCH` for wording fixes, examples, and clarifications
- increment `MINOR` for backward-compatible additions to the DSL
- increment `MAJOR` for breaking syntax, semantics, or conformance changes

When a spec file is revised, update:

- the relevant spec version string if needed
- [Changelog.md](/H:/Projekte/LingLang/Changelog.md)
- any affected examples in the repository

## Spec Authoring Conventions

- use Markdown for prose specifications
- keep normative language explicit with terms like "must", "should", and "may" where appropriate
- distinguish clearly between normative and non-normative examples
- prefer ASCII in identifiers unless Unicode is part of the example being discussed
- examples should be internally consistent and parseable under the version they claim to target

## File Conventions

- core specifications should use filenames like `spec_v0.1.md`
- repository overview belongs in [README.md](/H:/Projekte/LingLang/README.md)
- project history belongs in [Changelog.md](/H:/Projekte/LingLang/Changelog.md)

## Change Discipline

For any non-trivial future change:

- state whether the change is editorial, additive, or breaking
- update the changelog in the same edit set
- keep examples synchronized with the spec
- avoid adding implementation-specific assumptions unless the repository explicitly introduces a reference parser
