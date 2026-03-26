import { conformanceSchemaTables } from "@linglang/schemas";

export type ConformanceLevel = "stable_core" | "full_1_0";
export type RuntimeOrigin = "long" | "short" | "generated";

export const AST_NODE_KINDS = [...conformanceSchemaTables.conformance.ast_node_kinds] as const;
export const SHORT_SYNTAX_TARGETS = [...conformanceSchemaTables.conformance.short_syntax_targets] as const;
export const VALUE_KINDS = [...conformanceSchemaTables.conformance.value_kinds] as const;

export function getConformanceLevels(): ConformanceLevel[] {
  return conformanceSchemaTables.conformance.conformance_levels.map(
    (item) => item.name as ConformanceLevel,
  );
}

export function isSupportedShortSyntaxTarget(target: string): boolean {
  return conformanceSchemaTables.conformance.short_syntax_targets.includes(target);
}

export function getCanonicalRenderingRules(): string[] {
  return [...conformanceSchemaTables.conformance.canonical_rendering_rules];
}

export function getRoundtripExpectations(): string[] {
  return [...conformanceSchemaTables.conformance.roundtrip_expectations];
}

export function getMetadataCapabilities() {
  return [...conformanceSchemaTables.conformance.metadata_capabilities];
}
