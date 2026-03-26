from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_ROOT = ROOT / "schemas" / "1.0.0"


@dataclass(slots=True)
class FieldSchema:
    name: str
    value_kinds: list[str]
    required: bool
    repeatable: bool
    reference_targets: list[str]
    controlled_values: list[str]
    notes: str


@dataclass(slots=True)
class BlockSchema:
    name: str
    status: str
    kind: str
    since_version: str
    stable_in: str | None
    description: str
    allowed_children: list[str]
    required_fields: dict[str, FieldSchema]
    optional_fields: dict[str, FieldSchema]
    disallowed_fields: list[str]
    reference_fields: dict[str, list[str]]
    validation_rules: list[str]
    examples_ref: list[str]
    compatibility_note: str | None = None

    @property
    def all_fields(self) -> dict[str, FieldSchema]:
        merged = dict(self.optional_fields)
        merged.update(self.required_fields)
        return merged


@dataclass(slots=True)
class SchemaBundle:
    layer: str
    blocks: dict[str, BlockSchema]
    shared_fields: dict[str, FieldSchema]


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _field_from_json(raw: dict) -> FieldSchema:
    return FieldSchema(
        name=raw["name"],
        value_kinds=list(raw.get("value_kinds", [])),
        required=bool(raw.get("required", False)),
        repeatable=bool(raw.get("repeatable", False)),
        reference_targets=list(raw.get("reference_targets", [])),
        controlled_values=list(raw.get("controlled_values", [])),
        notes=raw.get("notes", ""),
    )


def load_bundle(layer: str) -> SchemaBundle:
    if layer not in {"core", "advanced"}:
        raise ValueError(f"Unsupported schema layer: {layer}")
    path = SCHEMA_ROOT / f"{layer}.schema-tables.json"
    data = _load_json(path)
    shared_fields = {
        item["name"]: _field_from_json(item)
        for item in data.get("shared_fields", [])
    }
    blocks: dict[str, BlockSchema] = {}
    for raw in data["blocks"]:
        required_fields = {item["name"]: _field_from_json(item) for item in raw.get("required_fields", [])}
        optional_fields = {item["name"]: _field_from_json(item) for item in raw.get("optional_fields", [])}
        blocks[raw["name"]] = BlockSchema(
            name=raw["name"],
            status=raw["status"],
            kind=raw["kind"],
            since_version=raw["since_version"],
            stable_in=raw.get("stable_in"),
            description=raw.get("description", ""),
            allowed_children=list(raw.get("allowed_children", [])),
            required_fields=required_fields,
            optional_fields=optional_fields,
            disallowed_fields=list(raw.get("disallowed_fields", [])),
            reference_fields={item["name"]: list(item.get("reference_targets", [])) for item in raw.get("reference_fields", [])},
            validation_rules=list(raw.get("validation_rules", [])),
            examples_ref=list(raw.get("examples_ref", [])),
            compatibility_note=raw.get("compatibility_note"),
        )
    return SchemaBundle(layer=layer, blocks=blocks, shared_fields=shared_fields)


def load_conformance() -> dict:
    return _load_json(SCHEMA_ROOT / "conformance.schema-tables.json")
