from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from . import ast
from .diagnostics import DiagnosticBag
from .parser import Parser
from .schema_loader import BlockSchema, SchemaBundle, load_bundle


@dataclass(slots=True)
class ValidationResult:
    document: ast.Document
    diagnostics: list[dict]

    @property
    def is_valid(self) -> bool:
        return not any(item["severity"] == "error" for item in self.diagnostics)


class Validator:
    def __init__(self, scope: str = "core"):
        if scope not in {"core", "advanced", "full"}:
            raise ValueError(f"Unsupported scope: {scope}")
        self.scope = scope
        self.core_bundle = load_bundle("core")
        self.advanced_bundle = load_bundle("advanced")

    def validate_path(self, path: Path) -> ValidationResult:
        source = path.read_text(encoding="utf-8-sig")
        parser = Parser(source, path)
        document = parser.parse()
        bag = parser.diagnostics
        self._validate_document(document, bag)
        return ValidationResult(document=document, diagnostics=bag.as_json_ready())

    def _active_blocks(self) -> dict[str, BlockSchema]:
        if self.scope == "core":
            return dict(self.core_bundle.blocks)
        if self.scope == "advanced":
            return dict(self.advanced_bundle.blocks)
        merged = dict(self.core_bundle.blocks)
        merged.update(self.advanced_bundle.blocks)
        return merged

    def _validate_document(self, document: ast.Document, bag: DiagnosticBag) -> None:
        blocks = self._active_blocks()
        index = self._build_index(document)
        for block in document.blocks:
            self._validate_block(block, blocks, index, bag, parent_type=None)

    def _build_index(self, document: ast.Document) -> dict[str, dict[str, ast.EntityBlock]]:
        index: dict[str, dict[str, ast.EntityBlock]] = {}

        def add_block(block: ast.Block) -> None:
            if isinstance(block, ast.EntityBlock):
                index.setdefault(block.block_type, {})[block.identifier] = block
            for child in block.children:
                add_block(child)

        for block in document.blocks:
            add_block(block)
        return index

    def _validate_block(
        self,
        block: ast.Block,
        schema_map: dict[str, BlockSchema],
        index: dict[str, dict[str, ast.EntityBlock]],
        bag: DiagnosticBag,
        *,
        parent_type: str | None,
    ) -> None:
        block_schema = schema_map.get(block.block_type)
        if block_schema is None:
            if parent_type is not None and self._child_allowed(parent_type, block.block_type, schema_map):
                for child in block.children:
                    self._validate_block(child, schema_map, index, bag, parent_type=block.block_type)
                return
            bag.add(
                "schema.unknown_block_type" if self.scope == "full" else "schema.block_out_of_scope",
                "error",
                f"Block type '{block.block_type}' is not available in scope '{self.scope}'.",
                node=block,
                block_type=block.block_type,
            )
            return

        if parent_type is not None and not self._child_allowed(parent_type, block.block_type, schema_map):
            bag.add(
                "schema.child_block_disallowed",
                "error",
                f"Child block '{block.block_type}' is not allowed inside '{parent_type}'.",
                node=block,
                block_type=parent_type,
            )

        self._validate_fields(block, block_schema, schema_map, index, bag)
        self._validate_children(block, block_schema, schema_map, index, bag)
        self._apply_rule_checks(block, block_schema, index, bag)

    def _child_allowed(self, parent_type: str, child_type: str, schema_map: dict[str, BlockSchema]) -> bool:
        parent_schema = schema_map.get(parent_type)
        if parent_schema is None:
            return False
        allowed = set(parent_schema.allowed_children)
        if child_type in allowed:
            return True
        if "strategy_section" in allowed and child_type not in {"categories"}:
            return True
        return False

    def _validate_fields(
        self,
        block: ast.Block,
        block_schema: BlockSchema,
        schema_map: dict[str, BlockSchema],
        index: dict[str, dict[str, ast.EntityBlock]],
        bag: DiagnosticBag,
    ) -> None:
        all_fields = block_schema.all_fields
        field_counts: dict[str, int] = {}
        for field in block.fields:
            field_counts[field.name] = field_counts.get(field.name, 0) + 1
            field_schema = all_fields.get(field.name)
            if field.name in block_schema.disallowed_fields:
                bag.add("schema.field_disallowed", "error", f"Field '{field.name}' is not allowed in '{block.block_type}'.", node=field, block_type=block.block_type, field_name=field.name)
                continue
            if field_schema is None:
                bag.add("schema.field_unknown", "error", f"Unknown field '{field.name}' in '{block.block_type}'.", node=field, block_type=block.block_type, field_name=field.name)
                continue
            if field_counts[field.name] > 1 and not field_schema.repeatable:
                bag.add("schema.field_duplicate", "error", f"Field '{field.name}' may not repeat in '{block.block_type}'.", node=field, block_type=block.block_type, field_name=field.name)
            self._validate_value_kind(field, field_schema, bag, block.block_type)
            self._validate_controlled_values(field, field_schema, bag, block.block_type)
            self._validate_references(field, field_schema, index, bag, block.block_type)

        for name, field_schema in block_schema.required_fields.items():
            if name not in field_counts:
                bag.add("schema.required_missing", "error", f"Required field '{name}' is missing in '{block.block_type}'.", node=block, block_type=block.block_type, field_name=name)

    def _validate_children(
        self,
        block: ast.Block,
        block_schema: BlockSchema,
        schema_map: dict[str, BlockSchema],
        index: dict[str, dict[str, ast.EntityBlock]],
        bag: DiagnosticBag,
    ) -> None:
        if isinstance(block, ast.EntityBlock):
            seen_entity_ids: dict[tuple[str, str], int] = {}
            for child in block.children:
                if isinstance(child, ast.EntityBlock):
                    key = (child.block_type, child.identifier)
                    seen_entity_ids[key] = seen_entity_ids.get(key, 0) + 1
                    if block.block_type == "text" and child.block_type == "segment" and seen_entity_ids[key] > 1:
                        bag.add("schema.child_duplicate_id", "error", f"Segment identifier '{child.identifier}' must be unique within text '{block.identifier}'.", node=child, block_type=block.block_type)
                self._validate_block(child, schema_map, index, bag, parent_type=block.block_type)
        else:
            for child in block.children:
                self._validate_block(child, schema_map, index, bag, parent_type=block.block_type)

    def _validate_value_kind(self, field: ast.Field, field_schema, bag: DiagnosticBag, block_type: str) -> None:
        actual_kinds = self._actual_value_kinds(field.value)
        if not set(actual_kinds).intersection(field_schema.value_kinds):
            bag.add(
                "schema.value_kind_mismatch",
                "error",
                f"Field '{field.name}' in '{block_type}' expects {field_schema.value_kinds}, got {actual_kinds}.",
                node=field,
                block_type=block_type,
                field_name=field.name,
            )

    def _validate_controlled_values(self, field: ast.Field, field_schema, bag: DiagnosticBag, block_type: str) -> None:
        if not field_schema.controlled_values:
            return
        if isinstance(field.value, ast.ScalarValue) and field.value.value_kind == "atom":
            if field.value.value not in field_schema.controlled_values:
                bag.add("schema.controlled_value_invalid", "error", f"Field '{field.name}' in '{block_type}' must use one of {field_schema.controlled_values}.", node=field, block_type=block_type, field_name=field.name)

    def _validate_references(
        self,
        field: ast.Field,
        field_schema,
        index: dict[str, dict[str, ast.EntityBlock]],
        bag: DiagnosticBag,
        block_type: str,
    ) -> None:
        refs = self._extract_references(field.value)
        if not refs:
            return
        for ref in refs:
            if field_schema.reference_targets and "*" not in field_schema.reference_targets and ref.target_type not in field_schema.reference_targets:
                bag.add(
                    "reference.invalid_target_type",
                    "error",
                    f"Reference field '{field.name}' in '{block_type}' does not allow target type '{ref.target_type}'.",
                    node=field,
                    block_type=block_type,
                    field_name=field.name,
                )
                continue
            if ref.target_type not in index or ref.target_id not in index.get(ref.target_type, {}):
                bag.add(
                    "reference.unresolved",
                    "warning",
                    f"Reference '{ref.target_type}:{ref.target_id}' in '{block_type}' could not be resolved in the current document.",
                    node=ref,
                    block_type=block_type,
                    field_name=field.name,
                )

    def _extract_references(self, value: ast.Node) -> list[ast.ReferenceValue]:
        if isinstance(value, ast.ReferenceValue):
            return [value]
        if isinstance(value, ast.ListValue):
            refs: list[ast.ReferenceValue] = []
            for item in value.items:
                refs.extend(self._extract_references(item))
            return refs
        return []

    def _actual_value_kinds(self, value: ast.Node) -> list[str]:
        if isinstance(value, ast.ReferenceValue):
            return ["reference"]
        if isinstance(value, ast.IpaValue):
            return ["ipa"]
        if isinstance(value, ast.MultilineTextValue):
            return ["multiline", "string"]
        if isinstance(value, ast.ObjectValue):
            return ["object"]
        if isinstance(value, ast.ListValue):
            if value.items and all(isinstance(item, ast.ReferenceValue) for item in value.items):
                return ["reference_list", "list"]
            return ["list"]
        if isinstance(value, ast.ScalarValue):
            return [value.value_kind]
        return ["unknown"]

    def _field_map(self, block: ast.Block) -> dict[str, list[ast.Field]]:
        result: dict[str, list[ast.Field]] = {}
        for field in block.fields:
            result.setdefault(field.name, []).append(field)
        return result

    def _has_child(self, block: ast.Block, child_type: str) -> bool:
        return any(child.block_type == child_type for child in block.children)

    def _apply_rule_checks(
        self,
        block: ast.Block,
        block_schema: BlockSchema,
        index: dict[str, dict[str, ast.EntityBlock]],
        bag: DiagnosticBag,
    ) -> None:
        fields = self._field_map(block)

        def present(*names: str) -> bool:
            return any(name in fields for name in names)

        if block.block_type in {"entry"} and not present("gloss", "pos"):
            bag.add("schema.required_missing", "error", "Entry requires at least one of gloss or pos.", node=block, block_type=block.block_type, field_name="gloss_or_pos")
        if block.block_type in {"phonology"} and not present("vowels", "consonants"):
            bag.add("schema.required_missing", "error", "Phonology requires at least one of vowels or consonants.", node=block, block_type=block.block_type, field_name="vowels_or_consonants")
        if block.block_type == "example":
            for required in ("surface", "translation"):
                if required not in fields:
                    bag.add("schema.required_missing", "error", f"Example requires field '{required}'.", node=block, block_type=block.block_type, field_name=required)
        if block.block_type == "grammar":
            if not self._has_child(block, "categories") and not any(child.block_type != "categories" for child in block.children):
                bag.add("schema.required_missing", "error", "Grammar requires categories or at least one named strategy section.", node=block, block_type=block.block_type, field_name="categories_or_strategy")
        if block.block_type == "text" and not present("content") and not self._has_child(block, "segment"):
            bag.add("schema.required_missing", "error", "Text requires content or at least one segment child block.", node=block, block_type=block.block_type, field_name="content_or_segment")
        if block.block_type == "morpheme" and not present("type", "gloss"):
            bag.add("schema.required_missing", "error", "Morpheme requires at least one of type or gloss.", node=block, block_type=block.block_type, field_name="type_or_gloss")
        if block.block_type == "construction" and not present("pattern", "base"):
            bag.add("schema.required_missing", "error", "Construction requires at least one of pattern or base.", node=block, block_type=block.block_type, field_name="pattern_or_base")
        if block.block_type == "etymology" and not present("origin", "development"):
            bag.add("schema.required_missing", "error", "Etymology requires at least one of origin or development.", node=block, block_type=block.block_type, field_name="origin_or_development")
        if block.block_type == "register" and not present("name", "label"):
            bag.add("schema.required_missing", "error", "Register requires at least one of name or label.", node=block, block_type=block.block_type, field_name="name_or_label")
        if block.block_type == "soundchange":
            for required in ("from_stage", "to_stage"):
                if required not in fields:
                    bag.add("schema.required_missing", "error", f"Soundchange requires field '{required}'.", node=block, block_type=block.block_type, field_name=required)
            if not self._has_child(block, "rule"):
                bag.add("schema.required_missing", "error", "Soundchange requires at least one rule child block.", node=block, block_type=block.block_type, field_name="rule")
        if block.block_type == "annotation_layer":
            if "kind" not in fields:
                bag.add("schema.required_missing", "error", "Annotation layer requires kind.", node=block, block_type=block.block_type, field_name="kind")
            for child in block.children:
                if child.block_type == "annotation":
                    child_fields = self._field_map(child)
                    if "anchor" not in child_fields and "span" not in child_fields:
                        bag.add("schema.required_missing", "error", "Annotation child blocks require anchor or span.", node=child, block_type=child.block_type, field_name="anchor_or_span")
        if block.block_type == "corpus_view" and not present("texts", "layers"):
            bag.add("schema.required_missing", "error", "Corpus view requires texts or layers.", node=block, block_type=block.block_type, field_name="texts_or_layers")
        if block.block_type == "sign_unit" and not present("handshape", "movement", "location", "nonmanual_profile", "spatial_anchor"):
            bag.add("schema.required_missing", "error", "Sign unit requires core sign structure.", node=block, block_type=block.block_type, field_name="core_sign_structure")
        if block.block_type == "template_morphology" and not present("root_pattern", "template"):
            bag.add("schema.required_missing", "error", "Template morphology requires root_pattern or template.", node=block, block_type=block.block_type, field_name="root_pattern_or_template")
        if block.block_type == "sense" and not present("gloss", "definition"):
            bag.add("schema.required_missing", "error", "Sense requires gloss or definition.", node=block, block_type=block.block_type, field_name="gloss_or_definition")
        if block.block_type == "prosody":
            if not present("kind", "pattern"):
                bag.add("schema.required_missing", "error", "Prosody requires kind or pattern.", node=block, block_type=block.block_type, field_name="kind_or_pattern")
            if present("association", "hierarchy") and "applies_to" not in fields:
                bag.add("schema.required_missing", "error", "Prosody association or hierarchy requires applies_to.", node=block, block_type=block.block_type, field_name="applies_to")

        if block.block_type in {"irregularity", "exception_case", "blocking_rule", "morph_irregularity", "paradigm_irregularity", "soundchange_exception", "construction_exception", "text_exception"}:
            if not present("target", "exception_to", "blocked_by"):
                bag.add("schema.required_missing", "error", "Irregularity-style blocks require target or explicit exception relation.", node=block, block_type=block.block_type, field_name="underspecified_irregularity_relations")


def validate_file(path: Path, scope: str = "core") -> ValidationResult:
    return Validator(scope=scope).validate_path(path)
