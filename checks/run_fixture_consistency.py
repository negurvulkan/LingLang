import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXTURE_ROOT = ROOT / "fixtures" / "1.0.0"
SCHEMA_ROOT = ROOT / "schemas" / "1.0.0"

MANIFESTS = {
    "core": FIXTURE_ROOT / "core" / "manifest.json",
    "advanced": FIXTURE_ROOT / "advanced" / "manifest.json",
    "conformance": FIXTURE_ROOT / "conformance" / "manifest.json",
}

ALLOWED_CATEGORIES = {
    "schema-valid",
    "schema-invalid",
    "reference-valid",
    "reference-invalid",
    "ast-shape",
    "short-syntax-valid",
    "short-syntax-invalid",
    "roundtrip-expectation",
    "metadata-capability",
    "doc-json-consistency",
}

CONFORMANCE_SUBJECTS = {
    "ast_node_kinds",
    "short_syntax_targets",
    "value_kinds",
    "reference_model",
    "canonical_rendering_rules",
    "roundtrip_expectations",
    "metadata_capabilities",
    "conformance_levels",
    "fixture_expectations",
}


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def err(errors, message):
    errors.append(message)


def resolve_relative(base: Path, rel: str) -> Path:
    return (base / rel).resolve()


def main():
    errors = []

    core_schema = load_json(SCHEMA_ROOT / "core.schema-tables.json")
    advanced_schema = load_json(SCHEMA_ROOT / "advanced.schema-tables.json")
    conformance_schema = load_json(SCHEMA_ROOT / "conformance.schema-tables.json")

    manifests = {name: load_json(path) for name, path in MANIFESTS.items()}

    expected_dsl_version = "1.0.0"
    expected_fixture_set_version = "1.0.0"

    seen_ids = set()
    covered_core_blocks = set()
    covered_advanced_blocks = set()

    core_block_names = {b["name"] for b in core_schema["blocks"]}
    advanced_block_names = {b["name"] for b in advanced_schema["blocks"]}

    for scope, manifest_path in MANIFESTS.items():
        manifest = manifests[scope]
        if manifest.get("dsl_version") != expected_dsl_version:
            err(errors, f"{manifest_path}: dsl_version must be {expected_dsl_version}")
        if manifest.get("fixture_set_version") != expected_fixture_set_version:
            err(errors, f"{manifest_path}: fixture_set_version must be {expected_fixture_set_version}")
        if manifest.get("scope") != scope:
            err(errors, f"{manifest_path}: scope must be {scope}")

        fixtures = manifest.get("fixtures", [])
        if not isinstance(fixtures, list):
            err(errors, f"{manifest_path}: fixtures must be a list")
            continue

        for fixture in fixtures:
            fixture_id = fixture.get("id")
            if not fixture_id:
                err(errors, f"{manifest_path}: fixture without id")
                continue
            if fixture_id in seen_ids:
                err(errors, f"duplicate fixture id: {fixture_id}")
            seen_ids.add(fixture_id)

            category = fixture.get("category")
            if category not in ALLOWED_CATEGORIES:
                err(errors, f"{fixture_id}: unknown category {category}")

            status = fixture.get("status")
            if scope == "core" and status != "core":
                err(errors, f"{fixture_id}: core manifest entries must use status=core")
            if scope == "advanced" and status != "advanced":
                err(errors, f"{fixture_id}: advanced manifest entries must use status=advanced")
            if scope == "conformance" and status != "conformance":
                err(errors, f"{fixture_id}: conformance manifest entries must use status=conformance")

            base = manifest_path.parent
            input_path = resolve_relative(base, fixture.get("input", ""))
            expected_path = resolve_relative(base, fixture.get("expected", ""))

            if not input_path.exists():
                err(errors, f"{fixture_id}: missing input file {input_path}")
            if not expected_path.exists():
                err(errors, f"{fixture_id}: missing expected file {expected_path}")
                continue

            expected = load_json(expected_path)

            blocks_covered = fixture.get("blocks_covered", [])
            expected_blocks = expected.get("expected_blocks", [])
            if blocks_covered and expected_blocks and sorted(blocks_covered) != sorted(expected_blocks):
                err(errors, f"{fixture_id}: manifest blocks_covered and expected_blocks differ")

            if scope == "core":
                for block in blocks_covered:
                    if block not in core_block_names:
                        err(errors, f"{fixture_id}: unknown core block {block}")
                    else:
                        covered_core_blocks.add(block)
                if expected.get("expected_status") not in {None, "core"}:
                    err(errors, f"{fixture_id}: expected_status must be core")

            if scope == "advanced":
                for block in blocks_covered:
                    if block not in advanced_block_names:
                        err(errors, f"{fixture_id}: unknown advanced block {block}")
                    else:
                        covered_advanced_blocks.add(block)
                if expected.get("expected_status") not in {None, "advanced"}:
                    err(errors, f"{fixture_id}: expected_status must be advanced")

            if scope == "conformance":
                subjects = expected.get("expected_conformance_subjects", [])
                for subject in subjects:
                    if subject not in CONFORMANCE_SUBJECTS:
                        err(errors, f"{fixture_id}: unknown conformance subject {subject}")

    missing_core = sorted(core_block_names - covered_core_blocks)
    missing_advanced = sorted(advanced_block_names - covered_advanced_blocks)

    if missing_core:
        err(errors, f"missing core fixture coverage for: {', '.join(missing_core)}")
    if missing_advanced:
        err(errors, f"missing advanced fixture coverage for: {', '.join(missing_advanced)}")

    if conformance_schema.get("dsl_version") != expected_dsl_version:
        err(errors, "conformance schema dsl_version mismatch")

    if errors:
        for message in errors:
            print(f"ERROR: {message}")
        return 1

    print("Fixture consistency checks passed.")
    print(f"Core blocks covered: {len(covered_core_blocks)}")
    print(f"Advanced blocks covered: {len(covered_advanced_blocks)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
