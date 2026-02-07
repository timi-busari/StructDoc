# Phase 2 — Codebase Discovery

## Objectives
- Extract controllers, routes, DTO references, guards
- Produce deterministic endpoint metadata JSON

## Deliverables
- Extraction script using `ts-morph`
- Example metadata JSON for sample controllers

## Tasks
- [ ] Implement file traversal and controller detection
- [ ] Parse method decorators for HTTP method + path
- [ ] Extract parameter types (params, query, body)
- [ ] Record guards/interceptors attached to routes

## Acceptance Criteria
- Deterministic JSON output for a sample NestJS project
- No source-code sent to AI (only metadata)
