const { z } = require("zod");
const { KEY_PATTERN } = require("./keys.cjs");

const contentKey = z.string().regex(KEY_PATTERN, "must be a stable dotted content key");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase slug");
const sha256 = z.string().regex(/^[0-9a-f]{64}$/, "must be a lowercase SHA-256 digest");
const positive = z.number().int().positive();
const nonnegative = z.number().int().nonnegative();

const markdown = z.string().min(1).superRefine((value, context) => {
  if (/<\/?[a-z][^>]*>/i.test(value)) {
    context.addIssue({ code: "custom", message: "raw HTML is not allowed in authored Markdown" });
  }
  if (/\]\(\s*(?:javascript|data):/i.test(value)) {
    context.addIssue({ code: "custom", message: "unsafe Markdown link protocol" });
  }
});

const sourceLink = z.object({
  key: contentKey,
  purpose: z.enum(["IDENTITY", "PROCEDURE", "CONTROL", "SYSTEM", "MEDIA", "OTHER"]),
  locator: z.string().min(1).optional(),
  notes: z.string().min(1).optional(),
}).strict();

const verification = z.object({
  status: z.enum(["PENDING", "VERIFIED", "REJECTED", "STALE"]),
  revision: positive,
  content_hash: sha256,
  implementation: contentKey.optional(),
  addon_version: z.string().min(1).optional(),
  simulator_version: z.string().min(1).optional(),
  verified_at: z.iso.datetime({ offset: true }).optional(),
  verified_by: z.string().min(1).optional(),
  method: z.string().min(1).optional(),
  notes: z.string().min(1).optional(),
  limitations: z.string().min(1).optional(),
}).strict().superRefine((value, context) => {
  if (value.status === "VERIFIED") {
    for (const field of ["verified_at", "verified_by", "method"]) {
      if (!value[field]) context.addIssue({ code: "custom", path: [field], message: "required for VERIFIED" });
    }
  }
});

const lifecycleShape = {
  key: contentKey,
  status: z.enum(["DRAFT", "REVIEW", "VERIFIED", "PUBLISHED", "ARCHIVED"]),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/).default("en"),
  revision: positive,
  audience: z.enum(["PUBLIC", "AUTHENTICATED"]).default("AUTHENTICATED"),
  access_class: z.enum(["FREE", "PRO", "PACK"]).default("FREE"),
  required_entitlement_key: z.string().min(1).optional(),
  sources: z.array(sourceLink).default([]),
  verifications: z.array(verification).default([]),
};

const entity = (kind, shape) => z.object({ kind: z.literal(kind), ...lifecycleShape, ...shape }).strict();

const step = entity("PROCEDURE_STEP", {
  sequence: positive,
  step_type: z.enum(["ACTION", "VERIFY", "WAIT", "INFORMATION", "MULTI_ACTION"]),
  title: z.string().min(1),
  action_text: markdown.optional(),
  location_hint: z.string().min(1).optional(),
  expected_result: markdown.optional(),
  explanation: markdown.optional(),
  tip: markdown.optional(),
  warning: markdown.optional(),
  is_optional: z.boolean().default(false),
  wait_hint: z.string().min(1).optional(),
  controls: z.array(z.object({
    key: contentKey,
    role: z.enum(["ACTION_TARGET", "CONTEXT", "VERIFY_TARGET"]),
    sequence: positive,
    preferred_hotspot: contentKey.optional(),
  }).strict()).default([]),
  visuals: z.array(z.object({
    role: z.enum(["PRIMARY", "ORIENTATION", "SECONDARY"]),
    sort_order: nonnegative.default(0),
    cockpit_view: contentKey.optional(),
    media: contentKey.optional(),
    hotspot: contentKey.optional(),
  }).strict().refine((value) => value.cockpit_view || value.media, {
    message: "a procedure-step visual requires cockpit_view or media",
  }).refine((value) => !value.hotspot || value.cockpit_view, {
    message: "a hotspot visual requires cockpit_view",
  })).default([]),
});

const schemas = {
  AIRCRAFT: entity("AIRCRAFT", {
    manufacturer: z.string().min(1), family: z.string().min(1), variant: z.string().min(1),
    display_name: z.string().min(1), slug,
  }),
  SIMULATOR: entity("SIMULATOR", {
    name: z.string().min(1), product_family: z.string().min(1).optional(),
    display_name: z.string().min(1), slug, support_status: z.enum(["PLANNED", "SUPPORTED", "DEPRECATED"]).default("PLANNED"),
  }),
  ADDON_PRODUCT: entity("ADDON_PRODUCT", {
    developer_name: z.string().min(1), product_name: z.string().min(1), slug,
    support_status: z.enum(["PLANNED", "SUPPORTED", "DEPRECATED"]).default("PLANNED"),
  }),
  AIRCRAFT_IMPLEMENTATION: entity("AIRCRAFT_IMPLEMENTATION", {
    aircraft: contentKey, simulator: contentKey, addon_product: contentKey, slug,
    display_name: z.string().min(1), support_status: z.enum(["PLANNED", "SUPPORTED", "DEPRECATED"]).default("PLANNED"),
  }),
  JOURNEY: entity("JOURNEY", {
    implementation: contentKey, slug, title: z.string().min(1), description: markdown.optional(),
    difficulty: z.string().min(1).optional(), estimated_scope: z.string().min(1).optional(), sort_order: nonnegative.default(0),
    sections: z.array(z.object({ procedure: contentKey, sequence: positive, title_override: z.string().min(1).optional(), is_required: z.boolean().default(true), notes: z.string().min(1).optional() }).strict()).default([]),
  }),
  PROCEDURE: entity("PROCEDURE", {
    implementation: contentKey, slug, title: z.string().min(1), short_description: markdown.optional(), sort_order: nonnegative.default(0),
    steps: z.array(step).default([]),
  }),
  MEDIA_ASSET: entity("MEDIA_ASSET", {
    implementation: contentKey.optional(), asset_type: z.enum(["COCKPIT_VIEW", "CONTROL_DETAIL", "SYSTEM_DIAGRAM", "PROCEDURE", "OTHER"]),
    storage_key: z.string().regex(/^[a-z0-9][a-z0-9._/-]*$/), mime_type: z.string().regex(/^[-\w.]+\/[-\w.+]+$/),
    width: positive, height: positive, original_filename: z.string().min(1).optional(), accessible_description: z.string().min(1), checksum: sha256,
    capture_context: z.string().min(1).optional(), captured_addon_version: z.string().min(1).optional(), captured_simulator_version: z.string().min(1).optional(),
    rights_status: z.enum(["PENDING", "APPROVED", "RESTRICTED", "REJECTED"]).default("PENDING"),
    verification_status: z.enum(["PENDING", "VERIFIED", "REJECTED", "STALE"]).default("PENDING"), is_original_capture: z.boolean().default(false),
  }),
  COCKPIT_AREA: entity("COCKPIT_AREA", {
    implementation: contentKey, parent_area: contentKey.optional(), area_type: z.enum(["COCKPIT", "REGION", "PANEL", "AREA"]), slug,
    title: z.string().min(1), sort_order: nonnegative.default(0),
  }),
  AIRCRAFT_SYSTEM: entity("AIRCRAFT_SYSTEM", {
    implementation: contentKey, slug, title: z.string().min(1), short_description: markdown.optional(), sort_order: nonnegative.default(0),
  }),
  SYSTEM_COMPONENT: entity("SYSTEM_COMPONENT", {
    implementation: contentKey, system: contentKey, slug, title: z.string().min(1), component_type: z.string().min(1).optional(),
    what_it_does: markdown.optional(), why_it_matters: markdown.optional(), sort_order: nonnegative.default(0),
    controls: z.array(z.object({ key: contentKey, relation_type: z.string().min(1), sort_order: nonnegative.default(0) }).strict()).default([]),
    concepts: z.array(z.object({ key: contentKey, relation_type: z.string().min(1), sort_order: nonnegative.default(0) }).strict()).default([]),
  }),
  CONCEPT: entity("CONCEPT", {
    implementation: contentKey.optional(), slug, title: z.string().min(1), short_definition: markdown, why_it_matters: markdown.optional(),
  }),
  CONTROL: entity("CONTROL", {
    implementation: contentKey, cockpit_area: contentKey, aircraft_system: contentKey.optional(), slug,
    canonical_name: z.string().min(1), control_type: z.enum(["SWITCH", "BUTTON", "KNOB", "SELECTOR", "LEVER", "GAUGE", "DISPLAY", "INDICATOR", "OTHER"]),
    what_it_does: markdown.optional(), when_used: markdown.optional(),
  }),
  COCKPIT_VIEW: entity("COCKPIT_VIEW", {
    implementation: contentKey, cockpit_area: contentKey, media: contentKey, view_role: z.enum(["PRIMARY", "ORIENTATION", "DETAIL", "ALTERNATE"]),
    title: z.string().min(1), sort_order: nonnegative.default(0), is_primary: z.boolean().default(false),
  }),
  HOTSPOT: entity("HOTSPOT", {
    implementation: contentKey, cockpit_view: contentKey, target_cockpit_area: contentKey.optional(), target_control: contentKey.optional(),
    x: z.number().min(0).max(1), y: z.number().min(0).max(1), width: z.number().gt(0).max(1), height: z.number().gt(0).max(1),
    shape: z.literal("RECTANGLE").default("RECTANGLE"), label: z.string().min(1).optional(), sort_order: nonnegative.default(0),
  }).superRefine((value, context) => {
    if (Number(Boolean(value.target_cockpit_area)) + Number(Boolean(value.target_control)) !== 1) context.addIssue({ code: "custom", message: "exactly one hotspot target is required" });
    if (value.x + value.width > 1 || value.y + value.height > 1) context.addIssue({ code: "custom", message: "hotspot rectangle extends outside normalized bounds" });
  }),
};

const sourceSchema = z.object({
  kind: z.literal("SOURCE_REFERENCE"), key: contentKey,
  source_type: z.enum(["ADDON_DOCUMENTATION", "AIRCRAFT_DOCUMENTATION", "SIMULATOR_DOCUMENTATION", "TRAINING_MATERIAL", "DIRECT_SIMULATOR_TEST", "OTHER"]),
  title: z.string().min(1), publisher: z.string().min(1).optional(), url: z.url().optional(), repository_identifier: z.string().min(1).optional(),
  document_version: z.string().min(1).optional(), publication_date: z.iso.date().optional(), notes: z.string().min(1).optional(), access_rights: z.string().min(1).optional(),
}).strict().refine((value) => value.url || value.repository_identifier, { message: "source requires url or repository_identifier" });

function parseDocument(value) {
  if (!value || typeof value !== "object" || typeof value.kind !== "string") throw new Error("document must declare kind");
  const schema = value.kind === "SOURCE_REFERENCE" ? sourceSchema : schemas[value.kind];
  if (!schema) throw new Error(`unsupported content kind ${value.kind}`);
  return schema.parse(value);
}

module.exports = { parseDocument, schemas, sourceSchema };
