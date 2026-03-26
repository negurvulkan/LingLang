import coreTables from "../../../schemas/1.0.0/core.schema-tables.json" with { type: "json" };
import advancedTables from "../../../schemas/1.0.0/advanced.schema-tables.json" with { type: "json" };
import conformanceTables from "../../../schemas/1.0.0/conformance.schema-tables.json" with { type: "json" };

export type SchemaLayer = "core" | "advanced" | "conformance";

export interface SchemaFieldTable {
  name: string;
  value_kinds: string[];
  required: boolean;
  repeatable: boolean;
  reference_targets: string[];
  controlled_values: string[];
  notes: string;
}

export interface SchemaReferenceField {
  name: string;
  reference_targets: string[];
}

export interface SchemaBlockTable {
  name: string;
  status: string;
  kind: string;
  since_version: string;
  stable_in: string | null;
  description: string;
  allowed_children: string[];
  required_fields: SchemaFieldTable[];
  optional_fields: SchemaFieldTable[];
  disallowed_fields: string[];
  reference_fields: SchemaReferenceField[];
  validation_rules: string[];
  examples_ref: string[];
  compatibility_note?: string;
}

export interface CoreSchemaTables {
  dsl_version: string;
  table_version: string;
  authority: string;
  layer: "core";
  generated_from: string[];
  shared_fields: SchemaFieldTable[];
  blocks: SchemaBlockTable[];
}

export interface AdvancedSchemaTables {
  dsl_version: string;
  table_version: string;
  authority: string;
  layer: "advanced";
  generated_from: string[];
  blocks: SchemaBlockTable[];
}

export interface ConformanceTables {
  dsl_version: string;
  table_version: string;
  authority: string;
  layer: "conformance";
  generated_from: string[];
  conformance: {
    ast_node_kinds: string[];
    short_syntax_targets: string[];
    value_kinds: string[];
    reference_model: {
      form: string;
      typed: boolean;
      requires_explicit_type: boolean;
    };
    canonical_rendering_rules: string[];
    roundtrip_expectations: string[];
    metadata_capabilities: Array<{
      name: string;
      required_for_core_conformance: boolean;
      allowed_values?: string[];
    }>;
    conformance_levels: Array<{
      name: string;
      description: string;
    }>;
    fixture_expectations: string[];
  };
}

export const coreSchemaTables = coreTables as CoreSchemaTables;
export const advancedSchemaTables = advancedTables as AdvancedSchemaTables;
export const conformanceSchemaTables = conformanceTables as ConformanceTables;

export function getSchemaTables(layer: "core"): CoreSchemaTables;
export function getSchemaTables(layer: "advanced"): AdvancedSchemaTables;
export function getSchemaTables(layer: "conformance"): ConformanceTables;
export function getSchemaTables(layer: SchemaLayer) {
  switch (layer) {
    case "core":
      return coreSchemaTables;
    case "advanced":
      return advancedSchemaTables;
    case "conformance":
      return conformanceSchemaTables;
  }
}

export function getAllSchemaBlocks(): SchemaBlockTable[] {
  return [...coreSchemaTables.blocks, ...advancedSchemaTables.blocks];
}

export function getSchemaBlock(name: string): SchemaBlockTable | undefined {
  return getAllSchemaBlocks().find((block) => block.name === name);
}
