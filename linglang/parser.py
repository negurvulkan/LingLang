from __future__ import annotations

from pathlib import Path

from . import ast
from .diagnostics import DiagnosticBag
from .lexer import Lexer, Token


class Parser:
    def __init__(self, source: str, source_path: Path):
        self.source = source
        self.source_path = source_path
        self.tokens = Lexer(source).tokenize()
        self.index = 0
        self.diagnostics = DiagnosticBag(source_path)

    def parse(self) -> ast.Document:
        version = self._parse_version()
        blocks: list[ast.EntityBlock] = []
        while not self._check("EOF"):
            block = self._parse_entity_block(top_level=True)
            if block is None:
                break
            blocks.append(block)
        return ast.Document(version=version, blocks=blocks)

    def _parse_version(self) -> ast.VersionDecl | None:
        if self._match("DSL"):
            version_token = self._expect_any(("VERSION", "NUMBER"), "syntax.expected_version")
            if version_token is None:
                return None
            return ast.VersionDecl(version_token.value, span=version_token.span)
        self.diagnostics.add("syntax.missing_version_decl", "error", "Document must start with a dsl version declaration.")
        return None

    def _parse_entity_block(self, *, top_level: bool = False) -> ast.EntityBlock | None:
        type_token = self._expect("IDENT", "syntax.expected_block_type")
        if type_token is None:
            return None
        if self._check("{"):
            self.diagnostics.add(
                "syntax.missing_block_id",
                "error",
                f"Entity block '{type_token.value}' requires an identifier.",
                span=type_token.span,
                block_type=type_token.value,
            )
            return None
        id_token = self._expect("IDENT", "syntax.missing_block_id")
        if id_token is None:
            return None
        self._expect("{", "syntax.expected_lbrace")
        fields, children = self._parse_block_body()
        end_token = self._expect("}", "syntax.expected_rbrace")
        span = ast.SourceSpan(
            type_token.span.line,
            type_token.span.column,
            (end_token or id_token).span.end_line,
            (end_token or id_token).span.end_column,
        )
        return ast.EntityBlock(type_token.value, id_token.value, fields, children, span=span)

    def _parse_section_block(self) -> ast.SectionBlock | None:
        type_token = self._expect("IDENT", "syntax.expected_block_type")
        if type_token is None:
            return None
        self._expect("{", "syntax.expected_lbrace")
        fields, children = self._parse_block_body()
        end_token = self._expect("}", "syntax.expected_rbrace")
        span = ast.SourceSpan(
            type_token.span.line,
            type_token.span.column,
            (end_token or type_token).span.end_line,
            (end_token or type_token).span.end_column,
        )
        return ast.SectionBlock(type_token.value, fields, children, span=span)

    def _parse_block_body(self) -> tuple[list[ast.Field], list[ast.Block]]:
        fields: list[ast.Field] = []
        children: list[ast.Block] = []
        while not self._check("}") and not self._check("EOF"):
            if self._check("IDENT") and self._lookahead(1).kind == ":":
                field = self._parse_field()
                if field is not None:
                    fields.append(field)
                continue
            if self._check("IDENT") and self._lookahead(1).kind == "{":
                block = self._parse_section_block()
                if block is not None:
                    children.append(block)
                continue
            if self._check("IDENT") and self._lookahead(1).kind == "IDENT" and self._lookahead(2).kind == "{":
                block = self._parse_entity_block()
                if block is not None:
                    children.append(block)
                continue
            token = self._peek()
            self.diagnostics.add(
                "syntax.unexpected_token",
                "error",
                f"Unexpected token {token.value!r} in block body.",
                span=token.span,
            )
            self._advance()
        return fields, children

    def _parse_field(self) -> ast.Field | None:
        name_token = self._expect("IDENT", "syntax.expected_field_name")
        if name_token is None:
            return None
        self._expect(":", "syntax.expected_colon")
        value = self._parse_value()
        if value is None:
            return None
        span = ast.SourceSpan(name_token.span.line, name_token.span.column, value.span.end_line, value.span.end_column) if value.span else name_token.span
        return ast.Field(name_token.value, value, span=span)

    def _parse_value(self):
        token = self._peek()
        if token.kind == "STRING":
            self._advance()
            return ast.ScalarValue(token.value, "string", span=token.span)
        if token.kind == "MULTILINE":
            self._advance()
            return ast.MultilineTextValue(token.value, span=token.span)
        if token.kind == "IPA":
            self._advance()
            return ast.IpaValue(token.value, span=token.span)
        if token.kind == "NUMBER":
            self._advance()
            value = float(token.value) if "." in token.value else int(token.value)
            return ast.ScalarValue(value, "number", span=token.span)
        if token.kind == "TRUE":
            self._advance()
            return ast.ScalarValue(True, "boolean", span=token.span)
        if token.kind == "FALSE":
            self._advance()
            return ast.ScalarValue(False, "boolean", span=token.span)
        if token.kind == "NULL":
            self._advance()
            return ast.ScalarValue(None, "null", span=token.span)
        if token.kind == "[":
            return self._parse_list()
        if token.kind == "{":
            return self._parse_object()
        if token.kind == "IDENT" and self._lookahead(1).kind == ":" and self._lookahead(2).kind == "IDENT":
            first = self._advance()
            self._advance()
            second = self._advance()
            span = ast.SourceSpan(first.span.line, first.span.column, second.span.end_line, second.span.end_column)
            return ast.ReferenceValue(first.value, second.value, span=span)
        if token.kind == "IDENT":
            self._advance()
            return ast.ScalarValue(token.value, "atom", span=token.span)
        self.diagnostics.add("syntax.unexpected_token", "error", f"Unexpected token {token.value!r} while parsing a value.", span=token.span)
        return None

    def _parse_list(self) -> ast.ListValue | None:
        start = self._expect("[", "syntax.expected_lbracket")
        items = []
        while not self._check("]") and not self._check("EOF"):
            item = self._parse_value()
            if item is None:
                break
            items.append(item)
            if self._check(","):
                self._advance()
                continue
            if not self._check("]"):
                self.diagnostics.add("syntax.expected_comma", "error", "List items must be separated by commas.", span=self._peek().span)
                break
        end = self._expect("]", "syntax.expected_rbracket")
        if start is None:
            return None
        end_span = end.span if end else start.span
        span = ast.SourceSpan(start.span.line, start.span.column, end_span.end_line, end_span.end_column)
        return ast.ListValue(items, span=span)

    def _parse_object(self) -> ast.ObjectValue | None:
        start = self._expect("{", "syntax.expected_lbrace")
        fields: list[ast.ObjectField] = []
        while not self._check("}") and not self._check("EOF"):
            name = self._expect("IDENT", "syntax.expected_field_name")
            self._expect(":", "syntax.expected_colon")
            value = self._parse_value()
            if name is None or value is None:
                break
            fields.append(ast.ObjectField(name.value, value, span=name.span))
            if self._check(","):
                self._advance()
                continue
            if not self._check("}"):
                self.diagnostics.add("syntax.expected_comma", "error", "Object fields must be separated by commas.", span=self._peek().span)
                break
        end = self._expect("}", "syntax.expected_rbrace")
        if start is None:
            return None
        end_span = end.span if end else start.span
        span = ast.SourceSpan(start.span.line, start.span.column, end_span.end_line, end_span.end_column)
        return ast.ObjectValue(fields, span=span)

    def _peek(self) -> Token:
        return self.tokens[self.index]

    def _lookahead(self, offset: int) -> Token:
        pos = min(self.index + offset, len(self.tokens) - 1)
        return self.tokens[pos]

    def _advance(self) -> Token:
        token = self.tokens[self.index]
        if self.index < len(self.tokens) - 1:
            self.index += 1
        return token

    def _check(self, kind: str) -> bool:
        return self._peek().kind == kind

    def _match(self, kind: str) -> bool:
        if self._check(kind):
            self._advance()
            return True
        return False

    def _expect(self, kind: str, code: str) -> Token | None:
        if self._check(kind):
            return self._advance()
        token = self._peek()
        self.diagnostics.add(code, "error", f"Expected {kind}, found {token.kind}.", span=token.span)
        return None

    def _expect_any(self, kinds: tuple[str, ...], code: str) -> Token | None:
        token = self._peek()
        if token.kind in kinds:
            return self._advance()
        self.diagnostics.add(code, "error", f"Expected one of {', '.join(kinds)}, found {token.kind}.", span=token.span)
        return None
