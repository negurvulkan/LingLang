from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .renderer import render_document
from .validator import validate_file


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="linglang")
    subparsers = parser.add_subparsers(dest="command", required=True)

    validate = subparsers.add_parser("validate", help="Validate a LingLang document.")
    validate.add_argument("path")
    validate.add_argument("--scope", choices=["core", "advanced", "full"], default="core")
    validate.add_argument("--format", choices=["text", "json"], default="text")
    validate.add_argument("--fail-on", choices=["warning", "error"], default="error")

    roundtrip = subparsers.add_parser("roundtrip", help="Render canonical long syntax from a LingLang document.")
    roundtrip.add_argument("path")
    roundtrip.add_argument("--scope", choices=["core", "advanced", "full"], default="full")

    return parser


def format_text(result) -> str:
    if not result.diagnostics:
        return "Validation passed with no diagnostics."
    lines = []
    for item in result.diagnostics:
        location = f"{item['path']}:{item['line']}:{item['column']}"
        lines.append(f"{item['severity'].upper()} {item['code']} {location} {item['message']}")
    return "\n".join(lines)


def exit_code(result, fail_on: str) -> int:
    if fail_on == "warning":
        return 1 if result.diagnostics else 0
    return 1 if any(item["severity"] == "error" for item in result.diagnostics) else 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    path = Path(args.path)

    if args.command == "validate":
        result = validate_file(path, scope=args.scope)
        if args.format == "json":
            print(json.dumps({"valid": result.is_valid, "diagnostics": result.diagnostics}, ensure_ascii=False, indent=2))
        else:
            print(format_text(result))
        return exit_code(result, args.fail_on)

    if args.command == "roundtrip":
        result = validate_file(path, scope=args.scope)
        if any(item["severity"] == "error" for item in result.diagnostics):
            print(json.dumps({"valid": False, "diagnostics": result.diagnostics}, ensure_ascii=False, indent=2))
            return 1
        print(render_document(result.document), end="")
        return 0

    parser.error("Unknown command")
    return 2


if __name__ == "__main__":
    sys.exit(main())
