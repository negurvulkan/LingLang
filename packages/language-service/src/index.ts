import type { Diagnostic, EntityBlock, TypedReference } from "@linglang/core";

export interface CompletionItem {
  label: string;
  kind: string;
  detail?: string;
}

export interface HoverInfo {
  contents: string[];
}

function notYet(message: string): never {
  throw new Error(message);
}

export function getCompletions(_source: string, _position: { line: number; column: number }): CompletionItem[] {
  return notYet("@linglang/language-service getCompletions is planned for Milestone K.");
}

export function getHover(_source: string, _position: { line: number; column: number }): HoverInfo | undefined {
  return notYet("@linglang/language-service getHover is planned for Milestone K.");
}

export function goToDefinition(_source: string, _position: { line: number; column: number }): TypedReference | undefined {
  return notYet("@linglang/language-service goToDefinition is planned for Milestone K.");
}

export function findReferences(_source: string, _position: { line: number; column: number }): TypedReference[] {
  return notYet("@linglang/language-service findReferences is planned for Milestone K.");
}

export function renameSymbol(_source: string, _position: { line: number; column: number }, _nextName: string): string {
  return notYet("@linglang/language-service renameSymbol is planned for Milestone K.");
}

export function getDocumentSymbols(_source: string): EntityBlock[] {
  return notYet("@linglang/language-service getDocumentSymbols is planned for Milestone K.");
}

export function streamDiagnostics(_source: string): AsyncIterable<Diagnostic[]> {
  return notYet("@linglang/language-service streamDiagnostics is planned for Milestone K.");
}
