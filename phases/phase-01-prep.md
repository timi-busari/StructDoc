# Phase 1 — Preparation & Research

## Objectives
- Confirm target NestJS project structure and path
- Choose static analysis tooling (ts-morph)
- Define deterministic metadata JSON schema
- Prepare minimal dev dependencies and CLI entry

Note: this project will use TypeScript for all scripts and tooling. Validation and extraction scripts should be implemented in TypeScript (`.ts`) and run via `ts-node` or a compiled step.

Restarting Phase 1: the TypeScript validator has been added at `scripts/validate-codebase.ts`. Use the `npm run validate` script to run it. The checklist below has been reset and Phase 1 set to `in-progress`.

## Deliverables
- `phases/phase-01-prep.md` (this file)
- Dev dependency list (`package.json` snippet)
- Validation checklist to verify codebase

## Completed in this restart
- Added TypeScript validator at `scripts/validate-codebase.ts`
- Added `package.json` with TypeScript devDeps (`typescript`, `ts-node`, `ts-morph`, `@types/node`)
- Added metadata schema at `schemas/metadata-schema.json`

## Remaining tasks (Phase 1)
- [ ] Add `tsconfig.json` tailored for tooling (if not present)
- [ ] Remove or deprecate `scripts/validate-codebase.js` (JS duplicate)
- [ ] Finalize `package.json` scripts for build, validate, and test
- [ ] Agree on CLI entrypoint and CLI type (Node + ts-node vs compiled binary)

## Next steps
- Run `npm install` to get dev dependencies installed.
- Run the validator against a target NestJS project to confirm readiness.

Recommended quick commands:

```bash
npm install
npm run validate -- ./path/to/nestjs/project
```

## Tasks
- [ ] Validate provided repo path and NestJS presence
- [ ] Add `ts-morph` and CLI scaffolding notes
- [ ] Define metadata JSON schema (controllers, dtos, endpoints)

## Acceptance Criteria
- Path validation script runs without errors
- Metadata schema documented and agreed

## Validation Checklist
- [ ] Project path exists and is readable
- [ ] `package.json` contains `@nestjs/core` or `@nestjs/common` in dependencies
- [ ] `src/main.ts` or `nest-cli.json` found (typical NestJS entry points)
- [ ] TypeScript source files exist under `src/` (not just JS)

Recommended: run the validator now to confirm the target project:

```bash
npm install
npm run validate -- ./path/to/nestjs/project
```

## Metadata JSON Schema (short)
The metadata exchanged between steps must be deterministic and framework-agnostic. A short JSON Schema example is stored in `schemas/metadata-schema.json`.

Example shape (simplified):

```json
{
	"controllers": [
		{
			"name": "WalletController",
			"basePath": "/wallet",
			"endpoints": [
				{
					"method": "POST",
					"path": "/transfer",
					"handler": "transfer",
					"auth": "JWT",
					"requestBody": {"$ref": "#/components/schemas/TransferDto"},
					"response": {"$ref": "#/components/schemas/TransferResponse"}
				}
			]
		}
	]
}
```
