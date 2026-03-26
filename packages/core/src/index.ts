import type { ConformanceLevel, RuntimeOrigin } from "@linglang/conformance";

export interface SourceSpan {
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
}

export interface NodeMetadata {
  sourceSpan?: SourceSpan;
  leadingComments?: string[];
  trailingComments?: string[];
  origin?: RuntimeOrigin;
}

export interface BaseNode extends NodeMetadata {
  nodeKind: string;
}

export interface VersionDecl extends BaseNode {
  nodeKind: "VersionDecl";
  version: string;
}

export interface ScalarValue extends BaseNode {
  nodeKind: "ScalarValue";
  valueKind: "string" | "atom" | "number" | "boolean" | "null";
  value: string | number | boolean | null;
}

export interface ReferenceValue extends BaseNode {
  nodeKind: "ReferenceValue";
  targetType: string;
  targetId: string;
}

export interface IpaValue extends BaseNode {
  nodeKind: "IpaValue";
  value: string;
}

export interface MultilineTextValue extends BaseNode {
  nodeKind: "MultilineTextValue";
  value: string;
}

export interface ListValue extends BaseNode {
  nodeKind: "ListValue";
  items: ValueNode[];
}

export interface ObjectField {
  name: string;
  value: ValueNode;
}

export interface ObjectValue extends BaseNode {
  nodeKind: "ObjectValue";
  fields: ObjectField[];
}

export type ValueNode =
  | ScalarValue
  | ReferenceValue
  | IpaValue
  | MultilineTextValue
  | ListValue
  | ObjectValue;

export interface Field extends BaseNode {
  nodeKind: "Field";
  name: string;
  value: ValueNode;
}

export interface SectionBlock extends BaseNode {
  nodeKind: "SectionBlock";
  blockType: string;
  fields: Field[];
  children: BlockNode[];
}

export interface EntityBlock extends BaseNode {
  nodeKind: "EntityBlock";
  blockType: string;
  identifier: string;
  fields: Field[];
  children: BlockNode[];
}

export type BlockNode = EntityBlock | SectionBlock;

export interface Document extends BaseNode {
  nodeKind: "Document";
  version: VersionDecl | null;
  blocks: EntityBlock[];
}

export type DiagnosticSeverity = "error" | "warning" | "info" | "note";

export interface Diagnostic {
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  path?: string;
  line?: number;
  column?: number;
  nodeKind?: string;
  blockType?: string;
  fieldName?: string;
}

export type ResolutionStatus = "resolved" | "unresolved" | "invalid_target_type";

export interface TypedReference {
  type: string;
  id: string;
}

export interface ReferenceEdge {
  sourceBlockType: string;
  sourceBlockId: string;
  fieldName: string;
  target: TypedReference;
  status: ResolutionStatus;
}

export interface ResolvedReference extends TypedReference {
  status: ResolutionStatus;
  targetBlock?: EntityBlock;
}

export interface ResolvedDocument {
  document: Document;
  scope: ConformanceLevel;
  references: ReferenceEdge[];
}

export interface ParseOptions {
  path?: string;
}

export interface ValidationOptions {
  scope?: ConformanceLevel;
}

export interface ValidationResult {
  document: Document;
  diagnostics: Diagnostic[];
}

export interface RoundtripResult extends ValidationResult {
  output: string;
}

function notYet(message: string): never {
  throw new Error(message);
}

export function parseLong(_source: string, _options: ParseOptions = {}): Document {
  return notYet("@linglang/core parseLong is planned for Milestone E.");
}

export function parseFile(_path: string, _options: ParseOptions = {}): Document {
  return notYet("@linglang/core parseFile is planned for Milestone E.");
}

export function validateDocument(
  _document: Document,
  _options: ValidationOptions = {},
): Diagnostic[] {
  return notYet("@linglang/core validateDocument is planned for Milestone E.");
}

export function validateSource(
  _source: string,
  _options: ValidationOptions = {},
): ValidationResult {
  return notYet("@linglang/core validateSource is planned for Milestone E.");
}

export function resolveReferences(
  _document: Document,
  _options: ValidationOptions = {},
): ResolvedDocument {
  return notYet("@linglang/core resolveReferences is planned for Milestone E.");
}

export function renderCanonical(_document: Document): string {
  return notYet("@linglang/core renderCanonical is planned for Milestone E.");
}

export function roundtripLong(
  _source: string,
  _options: ValidationOptions = {},
): RoundtripResult {
  return notYet("@linglang/core roundtripLong is planned for Milestone E.");
}
