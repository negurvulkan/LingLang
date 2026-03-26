from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass(slots=True)
class SourceSpan:
    line: int
    column: int
    end_line: int
    end_column: int


@dataclass(slots=True)
class Node:
    node_kind: str
    span: Optional[SourceSpan] = None
    origin: str = "long"
    leading_comments: list[str] = field(default_factory=list)
    trailing_comments: list[str] = field(default_factory=list)


@dataclass(slots=True)
class ScalarValue(Node):
    value: Any = None
    value_kind: str = "atom"

    def __init__(self, value: Any, value_kind: str, span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="ScalarValue", span=span, origin=origin)
        self.value = value
        self.value_kind = value_kind


@dataclass(slots=True)
class IpaValue(Node):
    value: str = ""

    def __init__(self, value: str, span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="IpaValue", span=span, origin=origin)
        self.value = value


@dataclass(slots=True)
class MultilineTextValue(Node):
    value: str = ""

    def __init__(self, value: str, span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="MultilineTextValue", span=span, origin=origin)
        self.value = value


@dataclass(slots=True)
class ReferenceValue(Node):
    target_type: str = ""
    target_id: str = ""

    def __init__(self, target_type: str, target_id: str, span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="ReferenceValue", span=span, origin=origin)
        self.target_type = target_type
        self.target_id = target_id


@dataclass(slots=True)
class ListValue(Node):
    items: list[Node] = field(default_factory=list)

    def __init__(self, items: list[Node], span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="ListValue", span=span, origin=origin)
        self.items = items


@dataclass(slots=True)
class ObjectField:
    name: str
    value: Node
    span: Optional[SourceSpan] = None


@dataclass(slots=True)
class ObjectValue(Node):
    fields: list[ObjectField] = field(default_factory=list)

    def __init__(self, fields: list[ObjectField], span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="ObjectValue", span=span, origin=origin)
        self.fields = fields


@dataclass(slots=True)
class Field(Node):
    name: str = ""
    value: Node | None = None

    def __init__(self, name: str, value: Node, span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="Field", span=span, origin=origin)
        self.name = name
        self.value = value


@dataclass(slots=True)
class SectionBlock(Node):
    block_type: str = ""
    fields: list[Field] = field(default_factory=list)
    children: list["Block"] = field(default_factory=list)

    def __init__(self, block_type: str, fields: list[Field], children: list["Block"], span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="SectionBlock", span=span, origin=origin)
        self.block_type = block_type
        self.fields = fields
        self.children = children


@dataclass(slots=True)
class EntityBlock(Node):
    block_type: str = ""
    identifier: str = ""
    fields: list[Field] = field(default_factory=list)
    children: list["Block"] = field(default_factory=list)

    def __init__(self, block_type: str, identifier: str, fields: list[Field], children: list["Block"], span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="EntityBlock", span=span, origin=origin)
        self.block_type = block_type
        self.identifier = identifier
        self.fields = fields
        self.children = children


Block = EntityBlock | SectionBlock


@dataclass(slots=True)
class VersionDecl(Node):
    version: str = ""

    def __init__(self, version: str, span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="VersionDecl", span=span, origin=origin)
        self.version = version


@dataclass(slots=True)
class Document(Node):
    version: VersionDecl | None = None
    blocks: list[EntityBlock] = field(default_factory=list)

    def __init__(self, version: VersionDecl | None, blocks: list[EntityBlock], span: Optional[SourceSpan] = None, origin: str = "long"):
        Node.__init__(self, node_kind="Document", span=span, origin=origin)
        self.version = version
        self.blocks = blocks
