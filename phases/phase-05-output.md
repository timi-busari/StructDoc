# Phase 5 — Output Generation (OpenAPI & Markdown)

## Objectives
- Render OpenAPI 3.1 JSON and Markdown docs from enriched model
- Tag controllers, include components.schemas and securitySchemes

## Deliverables
- `openapi.json` generator
- Markdown docs following the project template

## Tasks
- [x] Map enriched model to OpenAPI 3.1 structure
- [x] Generate Markdown per endpoint with examples
- [x] Verify OpenAPI loads in Swagger UI

## Implementation
- Script: `scripts/generate-docs.ts`
- Input: `enriched-metadata.json` (from Phase 4)
- Outputs: 
  - `openapi.json` - OpenAPI 3.1 specification
  - `api-docs.md` - Human-readable Markdown
- Features: Structured paths, components, examples, descriptions

## Acceptance Criteria
- OpenAPI 3.1 valid and loads in Swagger UI
- Markdown readable and matches template in `plan.md`
