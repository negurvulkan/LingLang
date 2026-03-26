import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURE_ROOT = ROOT / "fixtures" / "1.0.0"
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from linglang.validator import validate_file

MANIFESTS = {
    "core": FIXTURE_ROOT / "core" / "manifest.json",
    "advanced": FIXTURE_ROOT / "advanced" / "manifest.json",
}

SKIPPED_CATEGORIES = {"short-syntax-valid", "short-syntax-invalid"}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def expected_codes(expected: dict, key: str) -> set[str]:
    return set(expected.get(key, []))


def main() -> int:
    errors: list[str] = []

    for scope_name, manifest_path in MANIFESTS.items():
        manifest = load_json(manifest_path)
        for fixture in manifest["fixtures"]:
            if fixture["category"] in SKIPPED_CATEGORIES:
                continue
            input_path = manifest_path.parent / fixture["input"]
            expected_path = manifest_path.parent / fixture["expected"]
            expected = load_json(expected_path)

            scope = "core" if scope_name == "core" else "full"
            result = validate_file(input_path, scope=scope)
            diagnostics = result.diagnostics
            actual_error_codes = {item["code"] for item in diagnostics if item["severity"] == "error"}
            actual_warning_codes = {item["code"] for item in diagnostics if item["severity"] == "warning"}
            actual_required_missing = {
                f"{item['block_type']}.{item['field_name']}" if item.get("block_type") and item.get("field_name") else item.get("field_name")
                for item in diagnostics
                if item["code"] == "schema.required_missing"
            }
            actual_required_missing.discard(None)
            actual_required_field_names = {
                item.get("field_name")
                for item in diagnostics
                if item["code"] == "schema.required_missing" and item.get("field_name")
            }

            expected_valid = expected.get("expected_valid")
            if expected_valid is not None and expected_valid != result.is_valid:
                errors.append(f"{fixture['id']}: expected_valid={expected_valid}, got {result.is_valid}")

            expected_missing = set(expected.get("expected_required_missing", []))
            if expected_missing and not expected_missing.issubset(actual_required_missing) and not expected_missing.issubset(actual_required_field_names):
                errors.append(
                    f"{fixture['id']}: missing required-missing assertions. expected subset {sorted(expected_missing)}, actual {sorted(actual_required_missing)}"
                )

            for key, actual in (
                ("expected_error_codes", actual_error_codes),
                ("expected_warning_codes", actual_warning_codes),
            ):
                wanted = expected_codes(expected, key)
                if wanted and not wanted.issubset(actual):
                    errors.append(f"{fixture['id']}: expected {key} subset {sorted(wanted)}, actual {sorted(actual)}")

    if errors:
        for message in errors:
            print(f"ERROR: {message}")
        return 1

    print("Validator fixture checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
