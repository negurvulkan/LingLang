const SAMPLE_DOCUMENTS = {
  "core-general": `dsl 1.0.0

language taren {
  name: "Taren"
  native_name: "Taren"
  family: "Tarenic"
  scripts: [script:tarenic]
  dialects: [dialect:north_taren]
}

entry varu {
  pos: verb
  gloss: "to drink"
  ipa: /va.ru/
}

phonology taren_core {
  vowels: /a e i o u/
  consonants: /p t k m n r v/
}

grammar taren_grammar {
  categories {
    pos: [noun, verb]
  }

  possession {
    strategy: suffixal
  }
}

script tarenic {
  type: alphabet
  direction: ltr
}

example ex1 {
  surface: "Ka varu."
  translation: "I drink."
  language: language:taren
  uses: [entry:varu]
}

text tx1 {
  language: language:taren
  content: "Ka varu."

  segment s1 {
    surface: "Ka varu."
    translation: "I drink."
  }
}`,
  "core-morph": `dsl 1.0.0

morpheme -ren {
  type: suffix
  gloss: "POSS"
}

paradigm noun_singular {
  dimensions: [case, number]
}

construction possessive_suffix {
  pattern: "N + POSS"
  category: possession
}

stage proto_taren {
  name: "Proto-Taren"
}

soundchange proto_to_old {
  from_stage: stage:proto_taren
  to_stage: stage:old_taren

  rule sc1 {
    from: p
    to: f
    environment: V_V
  }
}

etymology varu_et {
  origin: language:proto_taren
  development: "Regular development into Old Taren."
}`,
  "advanced-corpus": `dsl 1.0.0

annotation_layer morph_layer {
  kind: morphology
  targets: [text:tx1]

  annotation ann1 {
    anchor: "s1"
    label: "1SG"
  }
}

corpus_view view1 {
  texts: [text:tx1]
  layers: [annotation_layer:morph_layer]
  focus: "Small demo corpus"
}`,
  "invalid-core": `dsl 1.0.0

language broken_language {
  family: "Unknown"
}

entry broken_entry {
  ipa: /ba.d/
}

phonology broken_phonology {
  stress: final
}

grammar broken_grammar {
  notes: "No categories or strategies."
}

script broken_script {
  direction: ltr
}

example broken_example {
  surface: "Ka varu."
}

text broken_text {
  segment s1 {
    surface: "A"
  }

  segment s1 {
    surface: "B"
  }
}`
};

const FALLBACK_SCHEMAS = {
  core: {
    shared_fields: [
      { name: "status", value_kinds: ["atom"], required: false, repeatable: false, reference_targets: [], controlled_values: ["draft", "living", "historical", "reconstructed", "deprecated"] },
      { name: "certainty", value_kinds: ["atom"], required: false, repeatable: false, reference_targets: [], controlled_values: ["low", "medium", "high"] },
      { name: "notes", value_kinds: ["string", "multiline"], required: false, repeatable: false, reference_targets: [], controlled_values: [] }
    ],
    blocks: [
      schemaBlock("language", "Language metadata block.", ["name"], ["scripts", "dialects", "stages", "registers", "default_dialect", "based_on"], [], ["name is required"]),
      schemaBlock("entry", "Lexical entry block.", [], ["gloss", "pos", "ipa", "derived_from", "register", "registers", "morphemes", "paradigm", "stage"], [], ["at least one of gloss or pos must exist"]),
      schemaBlock("phonology", "Phonology inventory block.", [], ["vowels", "consonants", "phonemes", "stage", "based_on"], [], ["at least one of vowels or consonants must exist"]),
      schemaBlock("grammar", "Grammar block with sections.", [], [], ["categories", "strategy_section"], ["grammar must contain either categories or at least one named strategy section"]),
      schemaBlock("script", "Script metadata block.", ["type"], ["direction"], ["grapheme", "orthography"], ["type is required"]),
      schemaBlock("example", "Example block.", ["surface", "translation"], ["language", "uses"], [], ["surface and translation are required"]),
      schemaBlock("text", "Text block.", [], ["content", "language"], ["segment", "translation_block"], ["text should contain content or at least one segment child block", "segment identifiers should be unique within a text block"]),
      schemaBlock("morpheme", "Morpheme block.", [], ["type", "gloss"], [], ["at least one of type or gloss must exist"]),
      schemaBlock("paradigm", "Paradigm block.", ["dimensions"], [], ["row"], ["dimensions is required"]),
      schemaBlock("construction", "Construction block.", [], ["pattern", "base", "category"], ["constraints"], ["at least one of pattern or base must exist"]),
      schemaBlock("soundchange", "Soundchange block.", ["from_stage", "to_stage"], [], ["rule"], ["from_stage and to_stage are required", "at least one rule child block is required"]),
      schemaBlock("etymology", "Etymology block.", [], ["origin", "development"], [], ["at least one of origin or development must exist"]),
      schemaBlock("stage", "Stage block.", ["name"], [], [], ["name is required"]),
      schemaBlock("dialect", "Dialect block.", ["name"], ["language"], [], ["name is required"]),
      schemaBlock("register", "Register block.", [], ["name", "label"], [], ["at least one of name or label must exist"]),
      schemaBlock("phoneme", "Phoneme block.", ["symbol"], ["phonology", "class"], [], ["symbol is required"]),
      schemaBlock("analysis", "Analysis block.", ["target"], ["interpretation", "claim"], [], ["target is required"]),
      schemaBlock("irregularity", "Irregularity block.", [], ["target", "exception_to", "blocked_by"], [], ["irregularity should identify a target or explicit relation to a regular expectation"]),
      schemaBlock("exception_case", "Exception case block.", [], ["target", "exception_to", "evidence"], [], ["exception_case should identify a target and an exception relation"]),
      schemaBlock("blocking_rule", "Blocking rule block.", [], ["target", "blocked_by", "applies_in"], [], ["blocking_rule should specify a blocked target or explicit blocker relation"]),
      schemaBlock("morph_irregularity", "Morph irregularity block.", [], ["target", "exception_to"], [], ["morph_irregularity should target entry or morpheme material"]),
      schemaBlock("paradigm_irregularity", "Paradigm irregularity block.", [], ["target", "exception_to"], [], ["paradigm_irregularity should target a paradigm"]),
      schemaBlock("soundchange_exception", "Soundchange exception block.", [], ["target", "exception_to"], [], ["soundchange_exception should point to a soundchange context"]),
      schemaBlock("construction_exception", "Construction exception block.", [], ["target", "exception_to", "register"], [], ["construction_exception should target a constructional pattern"]),
      schemaBlock("text_exception", "Text exception block.", [], ["target", "evidence"], [], ["text_exception should distinguish text-bound deviation from system-wide irregularity"])
    ]
  },
  advanced: {
    blocks: [
      schemaBlock("annotation_layer", "Annotation layer block.", ["kind"], ["targets"], ["annotation"], ["kind is required", "annotation anchors should resolve to explicit segment or target locations"]),
      schemaBlock("corpus_view", "Corpus view block.", [], ["texts", "layers"], [], ["at least one of texts or layers must exist"]),
      schemaBlock("sign_unit", "Sign unit block.", [], ["handshape", "movement", "location", "nonmanual_profile", "spatial_anchor"], [], ["at least one of handshape, movement, location, nonmanual_profile, or spatial_anchor should exist"]),
      schemaBlock("classifier_system", "Classifier system block.", ["kind"], ["used_in"], [], ["kind is required"]),
      schemaBlock("switch_reference", "Switch-reference block.", ["kind"], ["used_in"], [], ["kind is required"]),
      schemaBlock("polysynthesis_profile", "Polysynthesis profile block.", ["kind"], ["used_in"], [], ["kind is required"]),
      schemaBlock("template_morphology", "Template morphology block.", [], ["root_pattern", "template", "used_in"], [], ["at least one of root_pattern or template should exist"]),
      schemaBlock("prosody", "Prosody block.", [], ["kind", "pattern", "applies_to"], [], ["at least one of kind or pattern should exist"])
    ]
  }
};

function schemaBlock(name, description, requiredFields, optionalFields, allowedChildren, validationRules) {
  return {
    name,
    description,
    required_fields: requiredFields.map((field) => ({ name: field })),
    optional_fields: optionalFields.map((field) => ({ name: field })),
    allowed_children: allowedChildren,
    validation_rules: validationRules
  };
}

const state = {
  schemaMode: "loading",
  schemas: { core: null, advanced: null },
  source: SAMPLE_DOCUMENTS["core-general"],
  result: null
};

const elements = {
  sampleSelect: document.querySelector("#sampleSelect"),
  scopeSelect: document.querySelector("#scopeSelect"),
  validationModeSelect: document.querySelector("#validationModeSelect"),
  fileInput: document.querySelector("#fileInput"),
  validateButton: document.querySelector("#validateButton"),
  canonicalButton: document.querySelector("#canonicalButton"),
  resetButton: document.querySelector("#resetButton"),
  editor: document.querySelector("#editor"),
  editorStatus: document.querySelector("#editorStatus"),
  diagnosticsPanel: document.querySelector("#diagnosticsPanel"),
  astPanel: document.querySelector("#astPanel"),
  canonicalPanel: document.querySelector("#canonicalPanel"),
  blocksPanel: document.querySelector("#blocksPanel"),
  viewsPanel: document.querySelector("#viewsPanel"),
  schemaPanel: document.querySelector("#schemaPanel"),
  schemaBlockSelect: document.querySelector("#schemaBlockSelect"),
  schemaModeBadge: document.querySelector("#schemaModeBadge"),
  diagnosticBadge: document.querySelector("#diagnosticBadge"),
  scopeBadge: document.querySelector("#scopeBadge"),
  blockFilterInput: document.querySelector("#blockFilterInput"),
  referenceTargetInput: document.querySelector("#referenceTargetInput")
};

bootstrap();

async function bootstrap() {
  populateSampleSelect();
  bindEvents();
  await loadSchemas();
  elements.editor.value = state.source;
  populateSchemaSelect();
  runValidation();
}

function populateSampleSelect() {
  Object.keys(SAMPLE_DOCUMENTS).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    elements.sampleSelect.append(option);
  });
  elements.sampleSelect.value = "core-general";
}

function populateSchemaSelect() {
  const blocks = getSchemaBlocks();
  elements.schemaBlockSelect.innerHTML = "";
  blocks.forEach((block) => {
    const option = document.createElement("option");
    option.value = block.name;
    option.textContent = block.name;
    elements.schemaBlockSelect.append(option);
  });
  if (blocks[0]) elements.schemaBlockSelect.value = blocks[0].name;
  renderSchemaPanel();
}

function bindEvents() {
  elements.sampleSelect.addEventListener("change", () => {
    state.source = SAMPLE_DOCUMENTS[elements.sampleSelect.value];
    elements.editor.value = state.source;
    runValidation();
  });
  elements.scopeSelect.addEventListener("change", runValidation);
  elements.validationModeSelect.addEventListener("change", runValidation);
  elements.validateButton.addEventListener("click", runValidation);
  elements.canonicalButton.addEventListener("click", () => activateTab("canonical"));
  elements.resetButton.addEventListener("click", () => {
    elements.editor.value = SAMPLE_DOCUMENTS[elements.sampleSelect.value];
    runValidation();
  });
  elements.fileInput.addEventListener("change", handleFileLoad);
  elements.blockFilterInput.addEventListener("input", renderBlocksPanel);
  elements.referenceTargetInput.addEventListener("input", renderBlocksPanel);
  elements.schemaBlockSelect.addEventListener("change", renderSchemaPanel);
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });
}

async function loadSchemas() {
  try {
    const [core, advanced] = await Promise.all([
      fetch("../../schemas/1.0.0/core.schema-tables.json").then((response) => response.json()),
      fetch("../../schemas/1.0.0/advanced.schema-tables.json").then((response) => response.json())
    ]);
    state.schemas = { core, advanced };
    state.schemaMode = "live";
  } catch (_error) {
    state.schemas = FALLBACK_SCHEMAS;
    state.schemaMode = "fallback";
  }
  elements.schemaModeBadge.textContent = state.schemaMode;
}

async function handleFileLoad(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  elements.editor.value = await file.text();
  runValidation();
}

function getActiveSchemas() {
  if (elements.scopeSelect.value === "full_1_0") {
    return [...(state.schemas.core?.blocks ?? []), ...(state.schemas.advanced?.blocks ?? [])];
  }
  return state.schemas.core?.blocks ?? [];
}

function getSchemaBlocks() {
  return [...(state.schemas.core?.blocks ?? []), ...(state.schemas.advanced?.blocks ?? [])]
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getSharedFields() {
  return state.schemas.core?.shared_fields ?? FALLBACK_SCHEMAS.core.shared_fields ?? [];
}

function runValidation() {
  state.source = elements.editor.value;
  elements.scopeBadge.textContent = elements.scopeSelect.value;
  try {
    const parser = new Parser(state.source);
    const document = parser.parse();
    const diagnostics = [...parser.diagnostics];
    diagnostics.push(...validateDocument(
      document,
      getActiveSchemas(),
      elements.scopeSelect.value,
      elements.validationModeSelect.value
    ));
    const canonical = renderDocument(document);
    const resolved = resolveReferences(document);
    state.result = { document, diagnostics, canonical, resolved };
  } catch (error) {
    state.result = {
      document: null,
      diagnostics: [{
        code: "syntax.exception",
        severity: "error",
        message: error instanceof Error ? error.message : String(error),
        line: 1,
        column: 1
      }],
      canonical: "",
      resolved: { edges: [], incomingByTarget: new Map() }
    };
  }
  renderAll();
}

function renderAll() {
  const diagnostics = state.result?.diagnostics ?? [];
  const errorCount = diagnostics.filter((item) => item.severity === "error").length;
  const warningCount = diagnostics.filter((item) => item.severity === "warning").length;
  elements.diagnosticBadge.textContent = `${errorCount}E / ${warningCount}W`;
  elements.editorStatus.textContent = errorCount
    ? `${errorCount} Fehler, ${warningCount} Warnungen`
    : warningCount
      ? `0 Fehler, ${warningCount} Warnungen`
      : "Validiert ohne Diagnostics.";
  renderDiagnosticsPanel();
  elements.astPanel.textContent = JSON.stringify(state.result?.document, null, 2);
  elements.canonicalPanel.textContent = state.result?.canonical ?? "";
  renderBlocksPanel();
  renderViewsPanel();
  renderSchemaPanel();
}

function activateTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === name));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === name));
}

function renderDiagnosticsPanel() {
  const diagnostics = state.result?.diagnostics ?? [];
  if (!diagnostics.length) {
    elements.diagnosticsPanel.innerHTML = `<div class="empty">Keine Diagnostics. Das Dokument ist im aktuellen Scope sauber.</div>`;
    return;
  }
  elements.diagnosticsPanel.innerHTML = diagnostics.map((item) => `
    <article class="diagnostic ${item.severity}">
      <div class="diagnostic-header">
        <strong>${item.severity.toUpperCase()} · ${escapeHtml(item.code)}</strong>
        <span class="code-chip">${item.line ?? 1}:${item.column ?? 1}</span>
      </div>
      <p>${escapeHtml(item.message)}</p>
      ${item.blockType ? `<p class="muted">Block: <code>${escapeHtml(item.blockType)}</code>${item.fieldName ? ` · Feld: <code>${escapeHtml(item.fieldName)}</code>` : ""}</p>` : ""}
    </article>
  `).join("");
}

function renderBlocksPanel() {
  const document = state.result?.document;
  if (!document) {
    elements.blocksPanel.innerHTML = `<div class="empty">Noch kein AST vorhanden.</div>`;
    return;
  }
  const filterValue = elements.blockFilterInput.value.trim().toLowerCase();
  const targetValue = elements.referenceTargetInput.value.trim();
  const blocks = collectBlocks(document);
  const filteredBlocks = blocks.filter((block) => !filterValue || block.blockType.toLowerCase().includes(filterValue));
  const incomingEdges = targetValue ? (state.result?.resolved.incomingByTarget.get(targetValue) ?? []) : [];

  const blockCards = filteredBlocks.map((block) => {
    const fields = block.fields.map((field) => field.name).join(", ") || "keine";
    const children = block.children.map((child) => child.blockType).join(", ") || "keine";
    const outgoing = collectReferencesFromBlock(block).map((ref) => `${ref.targetType}:${ref.targetId}`).join(", ") || "keine";
    const idPart = block.nodeKind === "EntityBlock" ? ` <span class="code-chip">${escapeHtml(block.identifier)}</span>` : "";
    return `
      <article class="card">
        <div class="inline-heading">
          <strong>${escapeHtml(block.blockType)}</strong>${idPart}
        </div>
        <p class="muted">Felder: ${escapeHtml(fields)}</p>
        <p class="muted">Child blocks: ${escapeHtml(children)}</p>
        <p class="muted">Outgoing refs: ${escapeHtml(outgoing)}</p>
      </article>
    `;
  }).join("");

  const incomingMarkup = targetValue
    ? incomingEdges.length
      ? incomingEdges.map((edge) => `<div class="mini-card"><strong>${escapeHtml(edge.sourceBlockType)}:${escapeHtml(edge.sourceBlockId)}</strong><p class="muted">über Feld <code>${escapeHtml(edge.fieldName)}</code></p></div>`).join("")
      : `<div class="empty">Keine eingehenden Referenzen für <code>${escapeHtml(targetValue)}</code>.</div>`
    : `<div class="empty">Gib ein Referenzziel wie <code>entry:varu</code> ein, um eingehende Referenzen zu sehen.</div>`;

  elements.blocksPanel.innerHTML = `
    <div class="grid-two">
      <section>
        <h4>Blockliste</h4>
        <div class="list">${blockCards || `<div class="empty">Kein Block passt auf den aktuellen Filter.</div>`}</div>
      </section>
      <section>
        <h4>Incoming References</h4>
        <div class="list">${incomingMarkup}</div>
      </section>
    </div>
  `;
}

function renderViewsPanel() {
  const document = state.result?.document;
  if (!document) {
    elements.viewsPanel.innerHTML = `<div class="empty">Noch keine abgeleiteten Ansichten verfügbar.</div>`;
    return;
  }
  const blocks = collectBlocks(document);
  const entries = blocks.filter((block) => block.blockType === "entry");
  const phonemes = blocks.filter((block) => block.blockType === "phoneme");
  const texts = blocks.filter((block) => block.blockType === "text");
  const blockCounts = blocks.reduce((map, block) => {
    map[block.blockType] = (map[block.blockType] ?? 0) + 1;
    return map;
  }, {});
  const referenceEdges = state.result?.resolved.edges ?? [];

  elements.viewsPanel.innerHTML = `
    <div class="grid-two">
      <article class="schema-card">
        <h4>Dokumentstatistik</h4>
        <div class="pill-row">
          ${Object.entries(blockCounts).map(([name, count]) => `<span class="pill"><strong>${escapeHtml(name)}</strong> ${count}</span>`).join("") || `<span class="muted">Keine Blöcke</span>`}
        </div>
      </article>
      <article class="schema-card">
        <h4>Wörterbuchansicht</h4>
        <div class="list">
          ${entries.map((entry) => `<div class="mini-card"><strong>${escapeHtml(entry.identifier)}</strong><p class="muted">${escapeHtml(getFieldScalar(entry, "gloss") || "ohne gloss")} · ${escapeHtml(getFieldScalar(entry, "pos") || "ohne pos")}</p></div>`).join("") || `<div class="empty">Keine entry-Blöcke vorhanden.</div>`}
        </div>
      </article>
      <article class="schema-card">
        <h4>Phoneminventar</h4>
        <p>${phonemes.length ? phonemes.map((item) => escapeHtml(getFieldScalar(item, "symbol") || item.identifier)).join(", ") : "Noch keine phoneme-Blöcke im Dokument."}</p>
      </article>
      <article class="schema-card">
        <h4>Text- und Segmentansicht</h4>
        <div class="list">
          ${texts.map((text) => {
            const segments = text.children.filter((child) => child.blockType === "segment");
            return `<div class="mini-card"><strong>${escapeHtml(text.identifier)}</strong><p class="muted">${escapeHtml(getFieldScalar(text, "content") || "ohne content")}</p><p class="muted">${segments.length} Segmente</p></div>`;
          }).join("") || `<div class="empty">Keine text-Blöcke vorhanden.</div>`}
        </div>
      </article>
      <article class="schema-card">
        <h4>Referenzgraph</h4>
        <div class="list">
          ${referenceEdges.map((edge) => `<div class="mini-card"><strong>${escapeHtml(edge.sourceBlockType)}:${escapeHtml(edge.sourceBlockId)}</strong><p class="muted">${escapeHtml(edge.fieldName)} -> ${escapeHtml(edge.target.type)}:${escapeHtml(edge.target.id)} (${escapeHtml(edge.status)})</p></div>`).join("") || `<div class="empty">Keine Referenzen im Dokument.</div>`}
        </div>
      </article>
      <article class="schema-card">
        <h4>Analyse-/Irregularity-Fokus</h4>
        <div class="list">
          ${blocks.filter((block) => block.blockType.includes("analysis") || block.blockType.includes("irregular") || block.blockType.includes("exception")).map((block) => `<div class="mini-card"><strong>${escapeHtml(block.blockType)}:${escapeHtml(block.identifier)}</strong><p class="muted">${escapeHtml(getFieldReference(block, "target") || getFieldReference(block, "exception_to") || "ohne Ziel")}</p></div>`).join("") || `<div class="empty">Keine analysis- oder irregularity-Blöcke vorhanden.</div>`}
        </div>
      </article>
    </div>
  `;
}

function renderSchemaPanel() {
  const selected = elements.schemaBlockSelect.value;
  const block = getSchemaBlocks().find((item) => item.name === selected);
  if (!block) {
    elements.schemaPanel.innerHTML = `<div class="empty">Kein Schema ausgewählt.</div>`;
    return;
  }
  const required = block.required_fields?.map((field) => field.name) ?? [];
  const optional = block.optional_fields?.map((field) => field.name) ?? [];
  const children = block.allowed_children ?? [];
  const rules = block.validation_rules ?? [];
  elements.schemaPanel.innerHTML = `
    <article class="schema-card">
      <div class="inline-heading">
        <strong>${escapeHtml(block.name)}</strong>
        <span class="code-chip">${escapeHtml(block.status || "schema")}</span>
      </div>
      <p>${escapeHtml(block.description || "Keine Beschreibung verfügbar.")}</p>
      <div class="pill-row">
        ${required.map((item) => `<span class="pill">required: ${escapeHtml(item)}</span>`).join("") || `<span class="pill">keine Pflichtfelder</span>`}
      </div>
      <div class="pill-row">
        ${optional.map((item) => `<span class="pill">optional: ${escapeHtml(item)}</span>`).join("") || `<span class="pill">keine Optionalfelder</span>`}
      </div>
      <div class="pill-row">
        ${children.map((item) => `<span class="pill">child: ${escapeHtml(item)}</span>`).join("") || `<span class="pill">keine Child-Blocks</span>`}
      </div>
      <div class="list">
        ${(rules.length ? rules : ["keine zusätzlichen Validierungsregeln"]).map((item) => `<div class="mini-card">${escapeHtml(item)}</div>`).join("")}
      </div>
    </article>
  `;
}

function collectBlocks(document) {
  const blocks = [];
  const visit = (block) => {
    blocks.push(block);
    block.children.forEach(visit);
  };
  document.blocks.forEach(visit);
  return blocks;
}

function collectReferencesFromBlock(block) {
  const refs = [];
  const visitValue = (value) => {
    if (!value) return;
    if (value.nodeKind === "ReferenceValue") refs.push(value);
    if (value.nodeKind === "ListValue") value.items.forEach(visitValue);
    if (value.nodeKind === "ObjectValue") value.fields.forEach((field) => visitValue(field.value));
  };
  block.fields.forEach((field) => visitValue(field.value));
  return refs;
}

function getField(block, fieldName) {
  return block.fields.find((field) => field.name === fieldName);
}

function getFieldScalar(block, fieldName) {
  const field = getField(block, fieldName);
  if (!field) return "";
  if (field.value.nodeKind === "ScalarValue") return String(field.value.value);
  if (field.value.nodeKind === "IpaValue") return `/${field.value.value}/`;
  if (field.value.nodeKind === "MultilineTextValue") return field.value.value;
  return "";
}

function getFieldReference(block, fieldName) {
  const field = getField(block, fieldName);
  return field?.value.nodeKind === "ReferenceValue" ? `${field.value.targetType}:${field.value.targetId}` : "";
}

function validateDocument(document, schemaBlocks, scope, validationMode = "lenient") {
  const diagnostics = [];
  const schemaMap = new Map(schemaBlocks.map((block) => [block.name, block]));
  const sharedFields = new Map(getSharedFields().map((field) => [field.name, field]));
  const index = buildIndex(document);

  const validateBlock = (block, parentType = null) => {
    const schema = schemaMap.get(block.blockType);
    if (!schema) {
      if (parentType && childAllowed(parentType, block.blockType, schemaMap)) {
        block.children.forEach((child) => validateBlock(child, block.blockType));
        return;
      }
      if (parentType && schemaMap.get(parentType)) {
        diagnostics.push(diag(
          "schema.child_block_unknown",
          validationMode === "strict" ? "error" : "warning",
          validationMode === "strict"
            ? `Child block '${block.blockType}' ist innerhalb von '${parentType}' nicht normiert.`
            : `Child block '${block.blockType}' ist innerhalb von '${parentType}' nicht normiert und wird als nichtstandardisierte Erweiterung behandelt.`,
          block,
          parentType
        ));
        block.children.forEach((child) => validateBlock(child, block.blockType));
        return;
      }
      diagnostics.push(diag("schema.unknown_block_type", "error", `Block type '${block.blockType}' ist im Scope ${scope} nicht verfügbar.`, block));
      return;
    }

    if (parentType && !childAllowed(parentType, block.blockType, schemaMap)) {
      diagnostics.push(diag("schema.child_block_disallowed", "error", `Child block '${block.blockType}' ist in '${parentType}' nicht erlaubt.`, block));
    }

    const fieldCounts = new Map();
    const allowedFields = new Map([
      ...sharedFields,
      ...(schema.required_fields ?? []).map((field) => [field.name, field]),
      ...(schema.optional_fields ?? []).map((field) => [field.name, field])
    ]);

    block.fields.forEach((field) => {
      fieldCounts.set(field.name, (fieldCounts.get(field.name) ?? 0) + 1);
      const fieldSchema = allowedFields.get(field.name);
      if ((schema.disallowed_fields ?? []).includes(field.name)) {
        diagnostics.push(diag("schema.field_disallowed", "error", `Feld '${field.name}' ist in '${block.blockType}' nicht erlaubt.`, field, block.blockType, field.name));
        return;
      }
      if (!fieldSchema) {
        diagnostics.push(diag(
          "schema.field_unknown",
          validationMode === "strict" ? "error" : "warning",
          validationMode === "strict"
            ? `Feld '${field.name}' ist im Schema für '${block.blockType}' nicht beschrieben.`
            : `Feld '${field.name}' ist im Schema für '${block.blockType}' nicht beschrieben und wird als Erweiterung behandelt.`,
          field,
          block.blockType,
          field.name
        ));
      }
      if ((fieldCounts.get(field.name) ?? 0) > 1 && !fieldSchema?.repeatable) {
        diagnostics.push(diag("schema.field_duplicate", "error", `Feld '${field.name}' darf in '${block.blockType}' nicht mehrfach vorkommen.`, field, block.blockType, field.name));
      }
      if (fieldSchema) {
        const kinds = actualValueKinds(field.value);
        if (fieldSchema.value_kinds?.length && !kinds.some((kind) => fieldSchema.value_kinds.includes(kind))) {
          diagnostics.push(diag("schema.value_kind_mismatch", "error", `Feld '${field.name}' erwartet ${fieldSchema.value_kinds.join(", ")}, erhalten: ${kinds.join(", ")}.`, field, block.blockType, field.name));
        }
        const controlled = fieldSchema.controlled_values ?? [];
        if (controlled.length && field.value.nodeKind === "ScalarValue" && field.value.valueKind === "atom" && !controlled.includes(field.value.value)) {
          diagnostics.push(diag("schema.controlled_value_invalid", "error", `Feld '${field.name}' erwartet einen kontrollierten Wert.`, field, block.blockType, field.name));
        }
        extractReferences(field.value).forEach((ref) => {
          const targets = fieldSchema.reference_targets ?? [];
          if (targets.length && !targets.includes("*") && !targets.includes(ref.targetType)) {
            diagnostics.push(diag("reference.invalid_target_type", "error", `Referenzziel '${ref.targetType}' ist für Feld '${field.name}' in '${block.blockType}' nicht erlaubt.`, field, block.blockType, field.name));
          } else if (!index.get(ref.targetType)?.has(ref.targetId)) {
            diagnostics.push(diag(
              "reference.unresolved",
              validationMode === "strict" ? "error" : "warning",
              `Referenz '${ref.targetType}:${ref.targetId}' konnte im Dokument nicht aufgelöst werden.`,
              ref,
              block.blockType,
              field.name
            ));
          }
        });
      }
    });

    (schema.required_fields ?? []).forEach((field) => {
      if (!fieldCounts.has(field.name)) {
        diagnostics.push(diag("schema.required_missing", "error", `Pflichtfeld '${field.name}' fehlt in '${block.blockType}'.`, block, block.blockType, field.name));
      }
    });

    applyRuleChecks(block, diagnostics);

    if (block.blockType === "text") {
      const ids = new Set();
      block.children.filter((child) => child.blockType === "segment" && child.nodeKind === "EntityBlock").forEach((segment) => {
        if (ids.has(segment.identifier)) {
          diagnostics.push(diag("schema.child_duplicate_id", "error", `Segment-Identifier '${segment.identifier}' muss innerhalb von text eindeutig sein.`, segment, block.blockType));
        }
        ids.add(segment.identifier);
      });
    }

    block.children.forEach((child) => validateBlock(child, block.blockType));
  };

  document.blocks.forEach((block) => validateBlock(block));
  return diagnostics;
}

function applyRuleChecks(block, diagnostics) {
  const hasField = (...names) => names.some((name) => Boolean(getField(block, name)));
  if (block.blockType === "entry" && !hasField("gloss", "pos")) diagnostics.push(diag("schema.required_missing", "error", "Entry braucht mindestens gloss oder pos.", block, block.blockType, "gloss_or_pos"));
  if (block.blockType === "phonology" && !hasField("vowels", "consonants")) diagnostics.push(diag("schema.required_missing", "error", "Phonology braucht mindestens vowels oder consonants.", block, block.blockType, "vowels_or_consonants"));
  if (block.blockType === "grammar" && !block.children.length) diagnostics.push(diag("schema.required_missing", "error", "Grammar braucht categories oder mindestens eine Strategiesektion.", block, block.blockType, "categories_or_strategy"));
  if (block.blockType === "text" && !hasField("content") && !block.children.some((child) => child.blockType === "segment")) diagnostics.push(diag("schema.required_missing", "error", "Text braucht content oder mindestens ein segment child block.", block, block.blockType, "content_or_segment"));
  if (block.blockType === "morpheme" && !hasField("type", "gloss")) diagnostics.push(diag("schema.required_missing", "error", "Morpheme braucht mindestens type oder gloss.", block, block.blockType, "type_or_gloss"));
  if (block.blockType === "construction" && !hasField("pattern", "base")) diagnostics.push(diag("schema.required_missing", "error", "Construction braucht pattern oder base.", block, block.blockType, "pattern_or_base"));
  if (block.blockType === "etymology" && !hasField("origin", "development")) diagnostics.push(diag("schema.required_missing", "error", "Etymology braucht origin oder development.", block, block.blockType, "origin_or_development"));
  if (block.blockType === "register" && !hasField("name", "label")) diagnostics.push(diag("schema.required_missing", "error", "Register braucht name oder label.", block, block.blockType, "name_or_label"));
  if (block.blockType === "example") ["surface", "translation"].forEach((fieldName) => { if (!hasField(fieldName)) diagnostics.push(diag("schema.required_missing", "error", `Example braucht ${fieldName}.`, block, block.blockType, fieldName)); });
  if (block.blockType === "soundchange") {
    ["from_stage", "to_stage"].forEach((fieldName) => { if (!hasField(fieldName)) diagnostics.push(diag("schema.required_missing", "error", `Soundchange braucht ${fieldName}.`, block, block.blockType, fieldName)); });
    if (!block.children.some((child) => child.blockType === "rule")) diagnostics.push(diag("schema.required_missing", "error", "Soundchange braucht mindestens ein rule child block.", block, block.blockType, "rule"));
  }
  if (["irregularity", "exception_case", "blocking_rule", "morph_irregularity", "paradigm_irregularity", "soundchange_exception", "construction_exception", "text_exception"].includes(block.blockType) && !hasField("target", "exception_to", "blocked_by")) diagnostics.push(diag("schema.required_missing", "error", "Irregularity-Block braucht target oder explizite Ausnahmebeziehung.", block, block.blockType, "underspecified_irregularity_relations"));
  if (block.blockType === "annotation_layer") {
    if (!hasField("kind")) diagnostics.push(diag("schema.required_missing", "error", "Annotation layer braucht kind.", block, block.blockType, "kind"));
    block.children.filter((child) => child.blockType === "annotation").forEach((child) => {
      if (!child.fields.some((field) => ["anchor", "span"].includes(field.name))) diagnostics.push(diag("schema.required_missing", "error", "Annotation braucht anchor oder span.", child, child.blockType, "anchor_or_span"));
    });
  }
  if (block.blockType === "corpus_view" && !hasField("texts", "layers")) diagnostics.push(diag("schema.required_missing", "error", "Corpus view braucht texts oder layers.", block, block.blockType, "texts_or_layers"));
  if (block.blockType === "sign_unit" && !hasField("handshape", "movement", "location", "nonmanual_profile", "spatial_anchor")) diagnostics.push(diag("schema.required_missing", "error", "Sign unit braucht eine Kernstruktur.", block, block.blockType, "core_sign_structure"));
  if (block.blockType === "template_morphology" && !hasField("root_pattern", "template")) diagnostics.push(diag("schema.required_missing", "error", "Template morphology braucht root_pattern oder template.", block, block.blockType, "root_pattern_or_template"));
}

function resolveReferences(document) {
  const index = buildIndex(document);
  const edges = [];
  const incomingByTarget = new Map();
  collectBlocks(document).forEach((block) => {
    block.fields.forEach((field) => {
      extractReferences(field.value).forEach((ref) => {
        const targetKey = `${ref.targetType}:${ref.targetId}`;
        const edge = {
          sourceBlockType: block.blockType,
          sourceBlockId: block.nodeKind === "EntityBlock" ? block.identifier : block.blockType,
          fieldName: field.name,
          target: { type: ref.targetType, id: ref.targetId },
          status: index.get(ref.targetType)?.has(ref.targetId) ? "resolved" : "unresolved"
        };
        edges.push(edge);
        if (!incomingByTarget.has(targetKey)) incomingByTarget.set(targetKey, []);
        incomingByTarget.get(targetKey).push(edge);
      });
    });
  });
  return { edges, incomingByTarget };
}

function buildIndex(document) {
  const index = new Map();
  collectBlocks(document).forEach((block) => {
    if (block.nodeKind !== "EntityBlock") return;
    if (!index.has(block.blockType)) index.set(block.blockType, new Map());
    index.get(block.blockType).set(block.identifier, block);
  });
  return index;
}

function childAllowed(parentType, childType, schemaMap) {
  const schema = schemaMap.get(parentType);
  if (!schema) return false;
  const allowed = schema.allowed_children ?? [];
  return allowed.includes(childType) || (allowed.includes("strategy_section") && childType !== "categories");
}

function actualValueKinds(value) {
  if (!value) return ["unknown"];
  if (value.nodeKind === "ReferenceValue") return ["reference"];
  if (value.nodeKind === "IpaValue") return ["ipa"];
  if (value.nodeKind === "MultilineTextValue") return ["multiline", "string"];
  if (value.nodeKind === "ObjectValue") return ["object"];
  if (value.nodeKind === "ListValue") return value.items.every((item) => item.nodeKind === "ReferenceValue") ? ["reference_list", "list"] : ["list"];
  if (value.nodeKind === "ScalarValue") return [value.valueKind];
  return ["unknown"];
}

function extractReferences(value) {
  if (!value) return [];
  if (value.nodeKind === "ReferenceValue") return [value];
  if (value.nodeKind === "ListValue") return value.items.flatMap(extractReferences);
  if (value.nodeKind === "ObjectValue") return value.fields.flatMap((field) => extractReferences(field.value));
  return [];
}

function diag(code, severity, message, node, blockType = undefined, fieldName = undefined) {
  return { code, severity, message, line: node?.span?.line ?? 1, column: node?.span?.column ?? 1, blockType, fieldName };
}

class Parser {
  constructor(source) {
    this.source = source;
    this.tokens = new Lexer(source).tokenize();
    this.index = 0;
    this.diagnostics = [];
  }

  parse() {
    const version = this.parseVersion();
    const blocks = [];
    while (!this.check("EOF")) {
      const block = this.parseEntityBlock();
      if (!block) break;
      blocks.push(block);
    }
    return { nodeKind: "Document", version, blocks, span: version?.span };
  }

  parseVersion() {
    if (this.match("DSL")) {
      const token = this.expectAny(["VERSION", "NUMBER"], "syntax.expected_version");
      return token ? { nodeKind: "VersionDecl", version: token.value, span: token.span } : null;
    }
    this.diagnostics.push({ code: "syntax.missing_version_decl", severity: "error", message: "Dokument muss mit `dsl <version>` beginnen.", line: 1, column: 1 });
    return null;
  }

  parseEntityBlock() {
    const typeToken = this.expect("IDENT", "syntax.expected_block_type");
    if (!typeToken) return null;
    if (this.check("{")) {
      this.diagnostics.push({ code: "syntax.missing_block_id", severity: "error", message: `Entity block '${typeToken.value}' braucht einen Identifier.`, line: typeToken.span.line, column: typeToken.span.column });
      return null;
    }
    const idToken = this.expect("IDENT", "syntax.missing_block_id");
    if (!idToken) return null;
    this.expect("{", "syntax.expected_lbrace");
    const { fields, children } = this.parseBlockBody();
    const endToken = this.expect("}", "syntax.expected_rbrace");
    return {
      nodeKind: "EntityBlock",
      blockType: typeToken.value,
      identifier: idToken.value,
      fields,
      children,
      span: mergeSpans(typeToken.span, endToken?.span ?? idToken.span)
    };
  }

  parseSectionBlock() {
    const typeToken = this.expect("IDENT", "syntax.expected_block_type");
    if (!typeToken) return null;
    this.expect("{", "syntax.expected_lbrace");
    const { fields, children } = this.parseBlockBody();
    const endToken = this.expect("}", "syntax.expected_rbrace");
    return {
      nodeKind: "SectionBlock",
      blockType: typeToken.value,
      fields,
      children,
      span: mergeSpans(typeToken.span, endToken?.span ?? typeToken.span)
    };
  }

  parseBlockBody() {
    const fields = [];
    const children = [];
    while (!this.check("}") && !this.check("EOF")) {
      if (this.check("IDENT") && this.lookahead(1).kind === ":") {
        const field = this.parseField();
        if (field) fields.push(field);
        continue;
      }
      if (this.check("IDENT") && this.lookahead(1).kind === "{") {
        const block = this.parseSectionBlock();
        if (block) children.push(block);
        continue;
      }
      if (this.check("IDENT") && this.lookahead(1).kind === "IDENT" && this.lookahead(2).kind === "{") {
        const block = this.parseEntityBlock();
        if (block) children.push(block);
        continue;
      }
      const token = this.peek();
      this.diagnostics.push({ code: "syntax.unexpected_token", severity: "error", message: `Unerwartetes Token '${token.value}'.`, line: token.span.line, column: token.span.column });
      this.advance();
    }
    return { fields, children };
  }

  parseField() {
    const nameToken = this.expect("IDENT", "syntax.expected_field_name");
    if (!nameToken) return null;
    this.expect(":", "syntax.expected_colon");
    const value = this.parseValue();
    if (!value) return null;
    return { nodeKind: "Field", name: nameToken.value, value, span: mergeSpans(nameToken.span, value.span) };
  }

  parseValue() {
    const token = this.peek();
    if (token.kind === "STRING") {
      this.advance();
      return { nodeKind: "ScalarValue", valueKind: "string", value: token.value, span: token.span };
    }
    if (token.kind === "MULTILINE") {
      this.advance();
      return { nodeKind: "MultilineTextValue", value: token.value, span: token.span };
    }
    if (token.kind === "IPA") {
      this.advance();
      return { nodeKind: "IpaValue", value: token.value, span: token.span };
    }
    if (token.kind === "NUMBER") {
      this.advance();
      return { nodeKind: "ScalarValue", valueKind: "number", value: Number(token.value), span: token.span };
    }
    if (token.kind === "TRUE" || token.kind === "FALSE") {
      this.advance();
      return { nodeKind: "ScalarValue", valueKind: "boolean", value: token.kind === "TRUE", span: token.span };
    }
    if (token.kind === "NULL") {
      this.advance();
      return { nodeKind: "ScalarValue", valueKind: "null", value: null, span: token.span };
    }
    if (token.kind === "[") return this.parseList();
    if (token.kind === "{") return this.parseObject();
    if (token.kind === "IDENT" && this.lookahead(1).kind === ":" && this.lookahead(2).kind === "IDENT") {
      const first = this.advance();
      this.advance();
      const second = this.advance();
      return { nodeKind: "ReferenceValue", targetType: first.value, targetId: second.value, span: mergeSpans(first.span, second.span) };
    }
    if (token.kind === "IDENT") {
      this.advance();
      return { nodeKind: "ScalarValue", valueKind: "atom", value: token.value, span: token.span };
    }
    this.diagnostics.push({ code: "syntax.unexpected_token", severity: "error", message: `Unerwarteter Werttoken '${token.value}'.`, line: token.span.line, column: token.span.column });
    return null;
  }

  parseList() {
    const start = this.expect("[", "syntax.expected_lbracket");
    const items = [];
    while (!this.check("]") && !this.check("EOF")) {
      const value = this.parseValue();
      if (!value) break;
      items.push(value);
      if (this.check(",")) {
        this.advance();
      } else if (!this.check("]")) {
        const token = this.peek();
        this.diagnostics.push({ code: "syntax.expected_comma", severity: "error", message: "Listeneinträge müssen durch Kommata getrennt sein.", line: token.span.line, column: token.span.column });
        break;
      }
    }
    const end = this.expect("]", "syntax.expected_rbracket");
    return { nodeKind: "ListValue", items, span: mergeSpans(start?.span, end?.span ?? start?.span) };
  }

  parseObject() {
    const start = this.expect("{", "syntax.expected_lbrace");
    const fields = [];
    while (!this.check("}") && !this.check("EOF")) {
      const name = this.expect("IDENT", "syntax.expected_field_name");
      this.expect(":", "syntax.expected_colon");
      const value = this.parseValue();
      if (!name || !value) break;
      fields.push({ name: name.value, value });
      if (this.check(",")) {
        this.advance();
      } else if (!this.check("}")) {
        const token = this.peek();
        this.diagnostics.push({ code: "syntax.expected_comma", severity: "error", message: "Objektfelder müssen durch Kommata getrennt sein.", line: token.span.line, column: token.span.column });
        break;
      }
    }
    const end = this.expect("}", "syntax.expected_rbrace");
    return { nodeKind: "ObjectValue", fields, span: mergeSpans(start?.span, end?.span ?? start?.span) };
  }

  peek() { return this.tokens[this.index]; }
  lookahead(offset) { return this.tokens[Math.min(this.index + offset, this.tokens.length - 1)]; }
  advance() { const token = this.tokens[this.index]; if (this.index < this.tokens.length - 1) this.index += 1; return token; }
  check(kind) { return this.peek().kind === kind; }
  match(kind) { if (this.check(kind)) { this.advance(); return true; } return false; }

  expect(kind, code) {
    if (this.check(kind)) return this.advance();
    const token = this.peek();
    this.diagnostics.push({ code, severity: "error", message: `Erwartet: ${kind}, gefunden: ${token.kind}.`, line: token.span.line, column: token.span.column });
    return null;
  }

  expectAny(kinds, code) {
    if (kinds.includes(this.peek().kind)) return this.advance();
    const token = this.peek();
    this.diagnostics.push({ code, severity: "error", message: `Erwartet: ${kinds.join(" oder ")}, gefunden: ${token.kind}.`, line: token.span.line, column: token.span.column });
    return null;
  }
}

class Lexer {
  constructor(source) {
    this.source = source;
    this.length = source.length;
    this.index = 0;
    this.line = 1;
    this.column = 1;
  }

  tokenize() {
    const tokens = [];
    while (!this.atEnd()) {
      const ch = this.peek();
      if (/\s/.test(ch)) { this.consumeWhitespace(); continue; }
      if (ch === "#") { this.consumeComment(); continue; }
      if (ch === '"') { tokens.push(this.stringOrMultiline()); continue; }
      if (ch === "/") { tokens.push(this.ipa()); continue; }
      if ("{}[]:,".includes(ch)) { tokens.push(this.symbol()); continue; }
      if (/\d/.test(ch) || (ch === "-" && /\d/.test(this.peekNext()))) { tokens.push(this.numberOrVersion()); continue; }
      if (isIdentifierStart(ch)) { tokens.push(this.identifier()); continue; }
      throw new Error(`Unexpected character '${ch}' at ${this.line}:${this.column}`);
    }
    tokens.push({ kind: "EOF", value: "", span: span(this.line, this.column, this.line, this.column) });
    return tokens;
  }

  atEnd() { return this.index >= this.length; }
  peek() { return this.source[this.index]; }
  peekNext() { return this.source[this.index + 1] ?? "\0"; }
  advance() {
    const ch = this.source[this.index];
    this.index += 1;
    if (ch === "\n") { this.line += 1; this.column = 1; } else { this.column += 1; }
    return ch;
  }
  consumeWhitespace() { while (!this.atEnd() && /\s/.test(this.peek())) this.advance(); }
  consumeComment() { while (!this.atEnd() && this.peek() !== "\n") this.advance(); }
  symbol() { const startLine = this.line; const startColumn = this.column; const value = this.advance(); return { kind: value, value, span: span(startLine, startColumn, this.line, this.column) }; }

  stringOrMultiline() {
    const startLine = this.line;
    const startColumn = this.column;
    if (this.source.slice(this.index, this.index + 3) === '"""') {
      this.advance(); this.advance(); this.advance();
      let content = "";
      while (!this.atEnd() && this.source.slice(this.index, this.index + 3) !== '"""') content += this.advance();
      if (this.atEnd()) throw new Error(`Unterminated multiline string at ${startLine}:${startColumn}`);
      this.advance(); this.advance(); this.advance();
      return { kind: "MULTILINE", value: content, span: span(startLine, startColumn, this.line, this.column) };
    }
    this.advance();
    let content = "";
    while (!this.atEnd()) {
      const ch = this.advance();
      if (ch === '"') return { kind: "STRING", value: content, span: span(startLine, startColumn, this.line, this.column) };
      if (ch === "\\" && !this.atEnd()) {
        const next = this.advance();
        const escapes = { n: "\n", t: "\t", '"': '"', "\\": "\\" };
        content += escapes[next] ?? next;
      } else {
        content += ch;
      }
    }
    throw new Error(`Unterminated string at ${startLine}:${startColumn}`);
  }

  ipa() {
    const startLine = this.line;
    const startColumn = this.column;
    this.advance();
    let content = "";
    while (!this.atEnd()) {
      const ch = this.advance();
      if (ch === "/") return { kind: "IPA", value: content, span: span(startLine, startColumn, this.line, this.column) };
      content += ch;
    }
    throw new Error(`Unterminated IPA literal at ${startLine}:${startColumn}`);
  }

  numberOrVersion() {
    const startLine = this.line;
    const startColumn = this.column;
    let content = "";
    let dotCount = 0;
    if (this.peek() === "-") content += this.advance();
    while (!this.atEnd() && /\d/.test(this.peek())) content += this.advance();
    while (!this.atEnd() && this.peek() === "." && /\d/.test(this.peekNext())) {
      content += this.advance();
      dotCount += 1;
      while (!this.atEnd() && /\d/.test(this.peek())) content += this.advance();
    }
    return { kind: dotCount >= 2 ? "VERSION" : "NUMBER", value: content, span: span(startLine, startColumn, this.line, this.column) };
  }

  identifier() {
    const startLine = this.line;
    const startColumn = this.column;
    let value = this.advance();
    while (!this.atEnd() && isIdentifierPart(this.peek())) value += this.advance();
    const keywords = { dsl: "DSL", true: "TRUE", false: "FALSE", null: "NULL" };
    return { kind: keywords[value] ?? "IDENT", value, span: span(startLine, startColumn, this.line, this.column) };
  }
}

function isIdentifierStart(ch) {
  return /[\p{L}_-]/u.test(ch);
}

function isIdentifierPart(ch) {
  return /[\p{L}\p{M}\p{N}_-]/u.test(ch);
}

function renderDocument(document) {
  const lines = [];
  if (document.version) {
    lines.push(`dsl ${document.version.version}`);
    lines.push("");
  }
  document.blocks.forEach((block, index) => {
    if (index) lines.push("");
    lines.push(...renderEntityBlock(block, 0));
  });
  return lines.join("\n");
}

function renderEntityBlock(block, indent) {
  const prefix = " ".repeat(indent);
  const lines = [`${prefix}${block.blockType} ${block.identifier} {`];
  lines.push(...renderBlockBody(block.fields, block.children, indent + 2));
  lines.push(`${prefix}}`);
  return lines;
}

function renderSectionBlock(block, indent) {
  const prefix = " ".repeat(indent);
  const lines = [`${prefix}${block.blockType} {`];
  lines.push(...renderBlockBody(block.fields, block.children, indent + 2));
  lines.push(`${prefix}}`);
  return lines;
}

function renderBlockBody(fields, children, indent) {
  const prefix = " ".repeat(indent);
  const lines = [];
  fields.forEach((field) => lines.push(`${prefix}${field.name}: ${renderValue(field.value)}`));
  if (fields.length && children.length) lines.push("");
  children.forEach((child, index) => {
    if (index) lines.push("");
    lines.push(...(child.nodeKind === "EntityBlock" ? renderEntityBlock(child, indent) : renderSectionBlock(child, indent)));
  });
  return lines;
}

function renderValue(value) {
  if (value.nodeKind === "ScalarValue") {
    if (value.valueKind === "string") return `"${String(value.value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    if (value.valueKind === "boolean") return value.value ? "true" : "false";
    if (value.valueKind === "null") return "null";
    return String(value.value);
  }
  if (value.nodeKind === "ReferenceValue") return `${value.targetType}:${value.targetId}`;
  if (value.nodeKind === "IpaValue") return `/${value.value}/`;
  if (value.nodeKind === "MultilineTextValue") return `"""${value.value}"""`;
  if (value.nodeKind === "ListValue") return `[${value.items.map(renderValue).join(", ")}]`;
  if (value.nodeKind === "ObjectValue") return `{ ${value.fields.map((field) => `${field.name}: ${renderValue(field.value)}`).join(", ")} }`;
  return "";
}

function mergeSpans(startSpan, endSpan) {
  return span(startSpan?.line ?? 1, startSpan?.column ?? 1, endSpan?.endLine ?? endSpan?.line ?? 1, endSpan?.endColumn ?? endSpan?.column ?? 1);
}

function span(line, column, endLine, endColumn) {
  return { line, column, endLine, endColumn };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
