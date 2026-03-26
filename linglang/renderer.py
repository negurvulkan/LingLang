from __future__ import annotations

from . import ast


def render_document(document: ast.Document) -> str:
    lines: list[str] = []
    if document.version is not None:
        lines.append(f"dsl {document.version.version}")
        lines.append("")
    for index, block in enumerate(document.blocks):
        if index:
            lines.append("")
        lines.extend(_render_entity_block(block, 0))
    return "\n".join(lines) + "\n"


def _render_entity_block(block: ast.EntityBlock, indent: int) -> list[str]:
    prefix = " " * indent
    lines = [f"{prefix}{block.block_type} {block.identifier} {{"]
    lines.extend(_render_body(block.fields, block.children, indent + 2))
    lines.append(f"{prefix}}}")
    return lines


def _render_section_block(block: ast.SectionBlock, indent: int) -> list[str]:
    prefix = " " * indent
    lines = [f"{prefix}{block.block_type} {{"]
    lines.extend(_render_body(block.fields, block.children, indent + 2))
    lines.append(f"{prefix}}}")
    return lines


def _render_body(fields: list[ast.Field], children: list[ast.Block], indent: int) -> list[str]:
    lines: list[str] = []
    prefix = " " * indent
    for field in fields:
        lines.append(f"{prefix}{field.name}: {_render_value(field.value)}")
    if fields and children:
        lines.append("")
    for idx, child in enumerate(children):
        if idx:
            lines.append("")
        if isinstance(child, ast.EntityBlock):
            lines.extend(_render_entity_block(child, indent))
        else:
            lines.extend(_render_section_block(child, indent))
    return lines


def _render_value(value: ast.Node) -> str:
    if isinstance(value, ast.ReferenceValue):
        return f"{value.target_type}:{value.target_id}"
    if isinstance(value, ast.IpaValue):
        return f"/{value.value}/"
    if isinstance(value, ast.MultilineTextValue):
        return f'"""{value.value}"""'
    if isinstance(value, ast.ListValue):
        return "[" + ", ".join(_render_value(item) for item in value.items) + "]"
    if isinstance(value, ast.ObjectValue):
        parts = [f"{field.name}: {_render_value(field.value)}" for field in value.fields]
        return "{ " + ", ".join(parts) + " }"
    if isinstance(value, ast.ScalarValue):
        if value.value_kind == "string":
            return '"' + str(value.value).replace("\\", "\\\\").replace('"', '\\"') + '"'
        if value.value_kind == "boolean":
            return "true" if value.value else "false"
        if value.value_kind == "null":
            return "null"
        return str(value.value)
    raise TypeError(f"Unsupported value node: {type(value)!r}")
