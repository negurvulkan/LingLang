import type { BlockNode, Document, EntityBlock, Field, ResolvedDocument, TypedReference } from "@linglang/core";

export interface BlockFilterSpec {
  type?: string;
  identifier?: string;
  fieldName?: string;
  fieldValue?: unknown;
  references?: TypedReference;
  childType?: string;
}

function notYet(message: string): never {
  throw new Error(message);
}

export function findBlocksByType(_document: ResolvedDocument | Document, _type: string): EntityBlock[] {
  return notYet("@linglang/query findBlocksByType is planned for Milestone F.");
}

export function findBlock(_document: ResolvedDocument | Document, _type: string, _id: string): EntityBlock | undefined {
  return notYet("@linglang/query findBlock is planned for Milestone F.");
}

export function filterBlocks(
  _document: ResolvedDocument | Document,
  _filter: BlockFilterSpec | ((block: EntityBlock) => boolean),
): EntityBlock[] {
  return notYet("@linglang/query filterBlocks is planned for Milestone F.");
}

export function getField(_block: BlockNode, _fieldName: string): Field | undefined {
  return notYet("@linglang/query getField is planned for Milestone F.");
}

export function getFieldValues(_block: BlockNode, _fieldName: string): unknown[] {
  return notYet("@linglang/query getFieldValues is planned for Milestone F.");
}

export function resolveOutgoingReferences(_document: ResolvedDocument, _block: EntityBlock) {
  return notYet("@linglang/query resolveOutgoingReferences is planned for Milestone F.");
}

export function findIncomingReferences(_document: ResolvedDocument, _target: TypedReference | string) {
  return notYet("@linglang/query findIncomingReferences is planned for Milestone F.");
}

export function findBlocksReferencing(_document: ResolvedDocument, _target: TypedReference | string): EntityBlock[] {
  return notYet("@linglang/query findBlocksReferencing is planned for Milestone F.");
}

export function findChildren(_block: BlockNode, _options: { type?: string } = {}): BlockNode[] {
  return notYet("@linglang/query findChildren is planned for Milestone F.");
}

export function findSections(_block: BlockNode, _sectionType: string): BlockNode[] {
  return notYet("@linglang/query findSections is planned for Milestone F.");
}

export function walk(_input: ResolvedDocument | Document | BlockNode, _visitor: (node: unknown) => void): void {
  notYet("@linglang/query walk is planned for Milestone F.");
}

export function findEntriesByPos(_document: ResolvedDocument | Document, _pos: string): EntityBlock[] {
  return notYet("@linglang/query findEntriesByPos is planned for Milestone F.");
}

export function findBlocksForStage(_document: ResolvedDocument | Document, _stageRef: TypedReference | string): EntityBlock[] {
  return notYet("@linglang/query findBlocksForStage is planned for Milestone F.");
}

export function findReferers(_document: ResolvedDocument, _target: TypedReference | string): EntityBlock[] {
  return notYet("@linglang/query findReferers is planned for Milestone F.");
}

export function findCompetingAnalyses(_document: ResolvedDocument, _target: TypedReference | string) {
  return notYet("@linglang/query findCompetingAnalyses is planned for Milestone F.");
}
