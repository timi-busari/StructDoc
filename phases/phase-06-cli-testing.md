# Phase 6 — CLI, Tests & Validation

## Objectives
- Provide `npx api-doc-agent generate` CLI
- Add deterministic tests and validation steps

## Deliverables
- CLI entrypoint and usage docs
- Unit tests for extraction and normalization

## Tasks
- [x] Implement CLI argument parsing (`--path`, `--out`)
- [x] Add validation for codebase and fail loudly on errors
- [x] Add tests for deterministic outputs
- [x] Print summary of generated endpoints after run

## Implementation
- Main CLI: `src/cli.ts`
- Package bin: `api-doc-agent` command
- Arguments: `--path <project>`, `--output <dir>`, `--verbose`
- Pipeline: validate → extract → normalize → enrich → generate

## Testing
- Unit tests: `test/` directory
- Integration tests: Full pipeline validation
- Deterministic output verification

## Acceptance Criteria
- CLI runs and exits non-zero on invalid inputs
- Tests cover extraction -> normalization -> generation pipeline
