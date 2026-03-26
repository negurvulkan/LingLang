import type { ResolvedDocument, TypedReference } from "@linglang/core";

export interface DictionaryEntryView {
  id: string;
  headword?: string;
  gloss?: string;
  pos?: string;
}

export interface PhonemeInventoryView {
  phonologyId?: string;
  phonemes: string[];
}

export interface ParadigmTableView {
  paradigmId: string;
  dimensions: string[];
  rows: Array<Record<string, string>>;
}

export interface TextView {
  textId: string;
  content?: string;
  segments: Array<{
    id: string;
    surface?: string;
    translation?: string;
  }>;
}

export interface AnalysisView {
  target?: string;
  analyses: Array<Record<string, unknown>>;
}

export interface ReferenceGraphView {
  nodes: Array<{ id: string; type: string }>;
  edges: Array<{ from: string; to: string; field: string }>;
}

function notYet(message: string): never {
  throw new Error(message);
}

export function buildDictionaryView(_document: ResolvedDocument, _options: Record<string, unknown> = {}): DictionaryEntryView[] {
  return notYet("@linglang/views buildDictionaryView is planned for Milestone G.");
}

export function buildPhonemeInventory(_document: ResolvedDocument, _options: Record<string, unknown> = {}): PhonemeInventoryView {
  return notYet("@linglang/views buildPhonemeInventory is planned for Milestone G.");
}

export function buildParadigmTable(
  _document: ResolvedDocument,
  _paradigmRef: TypedReference | string,
  _options: Record<string, unknown> = {},
): ParadigmTableView {
  return notYet("@linglang/views buildParadigmTable is planned for Milestone G.");
}

export function buildTextView(
  _document: ResolvedDocument,
  _textRef: TypedReference | string,
  _options: Record<string, unknown> = {},
): TextView {
  return notYet("@linglang/views buildTextView is planned for Milestone G.");
}

export function buildAnalysisView(
  _document: ResolvedDocument,
  _target?: TypedReference | string,
  _options: Record<string, unknown> = {},
): AnalysisView {
  return notYet("@linglang/views buildAnalysisView is planned for Milestone G.");
}

export function buildReferenceGraph(_document: ResolvedDocument, _options: Record<string, unknown> = {}): ReferenceGraphView {
  return notYet("@linglang/views buildReferenceGraph is planned for Milestone G.");
}
