# Phase 3 — Metadata Normalization

## Objectives
- Resolve DTOs into plain JSON schemas
- Normalize names and remove framework noise

## Deliverables
- Schema resolver utility
- Normalized metadata JSON ready for enrichment

## Tasks
- [x] Traverse DTO type declarations and build JSON schema
- [x] Inline or reference nested DTO schemas
- [x] Strip framework-specific types and annotations
- [x] Produce components.schemas compatible with OpenAPI 3.1

## Implementation
- Script: `scripts/normalize-metadata.ts`
- Input: `metadata.json` (from Phase 2)
- Output: `normalized-metadata.json` with `components.schemas`
- DTO resolution: ts-morph analyzes class properties and types

## Acceptance Criteria
- Clean, framework-agnostic JSON schemas
- Mappings from DTO names to schemas documented
- References use `#/components/schemas/DtoName` format
