from __future__ import annotations

from dataclasses import dataclass

from .ast import SourceSpan


KEYWORDS = {"dsl", "true", "false", "null"}
SYMBOLS = {"{", "}", "[", "]", ":", ","}


@dataclass(slots=True)
class Token:
    kind: str
    value: str
    span: SourceSpan


class Lexer:
    def __init__(self, source: str):
        self.source = source
        self.length = len(source)
        self.index = 0
        self.line = 1
        self.column = 1

    def tokenize(self) -> list[Token]:
        tokens: list[Token] = []
        while not self._at_end():
            ch = self._peek()
            if ch in " \t\r\n":
                self._consume_whitespace()
                continue
            if ch == "#":
                self._consume_comment()
                continue
            if ch == '"':
                tokens.append(self._string_or_multiline())
                continue
            if ch == "/":
                tokens.append(self._ipa())
                continue
            if ch in SYMBOLS:
                tokens.append(self._symbol())
                continue
            if ch.isdigit() or (ch == "-" and self._peek_next().isdigit()):
                tokens.append(self._number_or_version())
                continue
            if self._is_ident_start(ch):
                tokens.append(self._identifier())
                continue
            span = SourceSpan(self.line, self.column, self.line, self.column)
            raise SyntaxError(f"Unexpected character {ch!r} at {span.line}:{span.column}")
        eof_span = SourceSpan(self.line, self.column, self.line, self.column)
        tokens.append(Token("EOF", "", eof_span))
        return tokens

    def _at_end(self) -> bool:
        return self.index >= self.length

    def _peek(self) -> str:
        return self.source[self.index]

    def _peek_next(self) -> str:
        if self.index + 1 >= self.length:
            return "\0"
        return self.source[self.index + 1]

    def _advance(self) -> str:
        ch = self.source[self.index]
        self.index += 1
        if ch == "\n":
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        return ch

    def _consume_whitespace(self) -> None:
        while not self._at_end() and self._peek() in " \t\r\n":
            self._advance()

    def _consume_comment(self) -> None:
        while not self._at_end() and self._peek() != "\n":
            self._advance()

    def _symbol(self) -> Token:
        start_line = self.line
        start_column = self.column
        value = self._advance()
        span = SourceSpan(start_line, start_column, self.line, self.column)
        return Token(value, value, span)

    def _string_or_multiline(self) -> Token:
        start_line = self.line
        start_column = self.column
        if self.source[self.index : self.index + 3] == '"""':
            self._advance()
            self._advance()
            self._advance()
            content: list[str] = []
            while not self._at_end() and self.source[self.index : self.index + 3] != '"""':
                content.append(self._advance())
            if self._at_end():
                raise SyntaxError(f"Unterminated multiline string at {start_line}:{start_column}")
            self._advance()
            self._advance()
            self._advance()
            span = SourceSpan(start_line, start_column, self.line, self.column)
            return Token("MULTILINE", "".join(content), span)

        self._advance()
        content: list[str] = []
        while not self._at_end():
            ch = self._advance()
            if ch == '"':
                span = SourceSpan(start_line, start_column, self.line, self.column)
                return Token("STRING", "".join(content), span)
            if ch == "\\" and not self._at_end():
                next_char = self._advance()
                escapes = {"n": "\n", "t": "\t", '"': '"', "\\": "\\"}
                content.append(escapes.get(next_char, next_char))
            else:
                content.append(ch)
        raise SyntaxError(f"Unterminated string at {start_line}:{start_column}")

    def _ipa(self) -> Token:
        start_line = self.line
        start_column = self.column
        self._advance()
        content: list[str] = []
        while not self._at_end():
            ch = self._advance()
            if ch == "/":
                span = SourceSpan(start_line, start_column, self.line, self.column)
                return Token("IPA", "".join(content), span)
            content.append(ch)
        raise SyntaxError(f"Unterminated IPA literal at {start_line}:{start_column}")

    def _number_or_version(self) -> Token:
        start_line = self.line
        start_column = self.column
        content: list[str] = []
        if self._peek() == "-":
            content.append(self._advance())
        while not self._at_end() and self._peek().isdigit():
            content.append(self._advance())
        dot_count = 0
        if not self._at_end() and self._peek() == "." and self._peek_next().isdigit():
            content.append(self._advance())
            dot_count += 1
            while not self._at_end() and self._peek().isdigit():
                content.append(self._advance())
            while not self._at_end() and self._peek() == "." and self._peek_next().isdigit():
                content.append(self._advance())
                dot_count += 1
                while not self._at_end() and self._peek().isdigit():
                    content.append(self._advance())
        span = SourceSpan(start_line, start_column, self.line, self.column)
        kind = "VERSION" if dot_count >= 2 else "NUMBER"
        return Token(kind, "".join(content), span)

    def _identifier(self) -> Token:
        start_line = self.line
        start_column = self.column
        content: list[str] = [self._advance()]
        while not self._at_end() and self._is_ident_part(self._peek()):
            content.append(self._advance())
        value = "".join(content)
        span = SourceSpan(start_line, start_column, self.line, self.column)
        if value in KEYWORDS:
            return Token(value.upper(), value, span)
        return Token("IDENT", value, span)

    @staticmethod
    def _is_ident_start(ch: str) -> bool:
        return ch.isalpha() or ch in {"_", "-"}

    @staticmethod
    def _is_ident_part(ch: str) -> bool:
        return ch.isalnum() or ch in {"_", "-"}
