from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Optional

from .ast import Node, SourceSpan


@dataclass(slots=True)
class Diagnostic:
    code: str
    severity: str
    message: str
    path: str
    line: int
    column: int
    node_kind: Optional[str] = None
    block_type: Optional[str] = None
    field_name: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)


class DiagnosticBag:
    def __init__(self, source_path: Path):
        self.source_path = str(source_path)
        self.items: list[Diagnostic] = []

    def add(
        self,
        code: str,
        severity: str,
        message: str,
        *,
        span: SourceSpan | None = None,
        node: Node | None = None,
        block_type: str | None = None,
        field_name: str | None = None,
    ) -> None:
        line = 1
        column = 1
        if span is not None:
            line = span.line
            column = span.column
        elif node is not None and node.span is not None:
            line = node.span.line
            column = node.span.column
        self.items.append(
            Diagnostic(
                code=code,
                severity=severity,
                message=message,
                path=self.source_path,
                line=line,
                column=column,
                node_kind=node.node_kind if node else None,
                block_type=block_type,
                field_name=field_name,
            )
        )

    def has_severity(self, severity: str) -> bool:
        return any(item.severity == severity for item in self.items)

    def as_json_ready(self) -> list[dict]:
        return [item.to_dict() for item in self.items]
