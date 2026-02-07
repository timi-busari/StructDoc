# Phase 4 — AI Semantic Enrichment

## Objectives
- Design prompts and constraints for LLM enrichment
- Produce human-friendly descriptions and examples

## Deliverables
- System & endpoint prompts
- Example enriched endpoint doc (description, examples, errors)

## Tasks
- [x] Define strict input contract for the LLM (metadata only)
- [x] Create prompt templates that forbid hallucination
- [x] Produce example enriched output for one endpoint

## Implementation
- Script: `scripts/enrich-metadata.ts`
- Input: `normalized-metadata.json` (from Phase 3)
- Output: `enriched-metadata.json` with descriptions, examples, errors
- AI role: Senior backend engineer writing API docs
- Constraints: Use only provided metadata, avoid speculation

## Prompt Design
- System: Expert technical writer, never invent fields/behavior
- Per endpoint: Description, use cases, request/response examples, auth notes, error cases
- Output format: Structured JSON with enriched fields

## Acceptance Criteria
- Enriched docs only reference provided metadata
- Prompts and failures handled (retries, validation)
- Human-friendly descriptions and practical examples
