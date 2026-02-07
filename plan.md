# AI Agent Plan — Automatic API Documentation Generator

## 1. Purpose & Vision

The goal of this project is to build an **AI-powered agent that generates accurate, human-friendly API documentation directly from a NestJS codebase**.

This agent should:

* Understand the **actual behavior of the API**, not just annotations
* Reduce or eliminate manual Swagger/doc writing
* Produce **developer-quality documentation** suitable for onboarding, integration, and maintenance

The long-term vision is a **code-aware documentation intelligence system**, not a simple doc generator.

---

## 2. Core Principles

These principles guide every decision the agent makes:

1. **Code is the source of truth**

   * Never invent endpoints or fields
   * Prefer static analysis over assumptions

2. **Structured before semantic**

   * Extract structured metadata first
   * Only then ask the LLM to explain or enrich

3. **Deterministic + AI hybrid**

   * Parsing, schemas, OpenAPI generation must be deterministic
   * Natural language, examples, explanations use AI

4. **Safe-by-default**

   * Avoid hallucinations
   * Clearly mark inferred behavior vs explicit behavior

---

## 3. MVP Scope (2-Week Build)

### In Scope (MVP)

* NestJS-only support
* REST APIs (no GraphQL yet)
* CLI-based execution
* Outputs:

  * OpenAPI 3.1 JSON
  * Markdown documentation
* AI enrichment:

  * Endpoint descriptions
  * Request/response examples
  * Auth & error explanations

### Out of Scope (Post-MVP)

* Multi-language support
* Web UI dashboard
* Test generation
* Real-time code watching
* GraphQL / gRPC

---

## 4. Agent Responsibilities (High-Level)

The AI agent must act as an **API documentation engineer**.

It is responsible for:

1. Understanding extracted API metadata
2. Explaining endpoint intent clearly
3. Writing docs for humans, not machines
4. Staying faithful to the code behavior
5. Highlighting constraints, auth, and errors

The agent must **never**:

* Guess business logic
* Add fields not present in metadata
* Change schemas or contracts

---

## 5. System Architecture

```
NestJS Codebase
   ↓
Static Analyzer (ts-morph)
   ↓
API Metadata (JSON)
   ↓
AI Documentation Agent
   ↓
Enriched API Model
   ↓
OpenAPI / Markdown Outputs
```

---

## 6. Detailed Pipeline

### Step 1: Codebase Discovery

Agent expectations:

* Receive a valid NestJS project path
* Detect:

  * Controllers
  * Routes
  * DTOs
  * Guards
  * Interceptors (basic awareness)

Deliverable:

```json
{
  "controllers": [...],
  "dtos": [...]
}
```

---

### Step 2: Static API Extraction (No AI)

Use TypeScript AST parsing (`ts-morph`).

Extract per endpoint:

* HTTP method
* Full route path
* Controller & handler name
* Route params
* Query params
* Request body DTO
* Response DTO / return type
* Guards (auth)
* Status codes (explicit & inferred)

Deliverable example:

```json
{
  "method": "POST",
  "path": "/wallet/transfer",
  "auth": "JWT",
  "body": {
    "amount": "number",
    "toUserId": "string"
  }
}
```

This step must be **100% deterministic**.

---

### Step 3: Metadata Normalization

Before calling the AI:

* Normalize naming
* Resolve DTOs to plain schemas
* Remove framework-specific noise

The AI **must never receive raw source code**.

---

### Step 4: AI Semantic Enrichment

#### AI Role

The AI acts as a **senior backend engineer writing API docs**.

#### Inputs to AI

* Endpoint metadata (JSON)
* Short service logic summary (optional, auto-generated)

#### Outputs from AI

For each endpoint:

* Clear description
* Use cases
* Request example
* Response example
* Auth explanation
* Common error scenarios

#### AI Constraints

The agent must:

* Use only provided metadata
* Avoid speculative language
* Keep explanations concise and practical

---

## 7. AI Prompt Design

### System Prompt (Global)

> You are an expert backend engineer and technical writer. You generate accurate API documentation using only the metadata provided. You never invent fields, endpoints, or behavior.

---

### Endpoint Documentation Prompt

```
You are given API metadata in JSON.

Write:
1. A short description of what the endpoint does
2. When and why to use it
3. A JSON request example
4. A JSON response example
5. Authentication and permission notes
6. Common error cases

Only use the provided metadata.
```

---

## 8. OpenAPI Generation Rules

* Version: OpenAPI 3.1
* Each controller = tag
* DTOs = components.schemas
* Guards = securitySchemes

AI **must not** modify schemas.

---

## 9. Markdown Output Structure

````
# API Documentation

## Authentication

## Endpoints

### POST /wallet/transfer
Description

#### Request
```json
````

#### Response

```json
```

#### Errors

* 400 Bad Request
* 401 Unauthorized

```

---

## 10. CLI Expectations

Command:
```

npx api-doc-agent generate --path ./api --out ./docs

```

CLI must:
- Fail loudly on invalid codebase
- Print summary of generated endpoints
- Be deterministic across runs

---

## 11. Success Criteria (MVP)

The project is successful if:

- A NestJS project with zero Swagger decorators produces usable docs
- Generated OpenAPI spec loads correctly in Swagger UI
- Markdown docs are readable and accurate
- AI output contains no hallucinated fields

---

## 12. Post-MVP Roadmap (Not Implemented Yet)

- Git diff → breaking change detection
- Auto PR with updated docs
- VS Code extension
- Conversational API explorer
- Test generation from contracts

---

## 13. Final Expectation

This agent should feel like:

> "A senior engineer who read the codebase and wrote the docs for me."

Accuracy > verbosity.
Trustworthiness > creativity.

---

End of plan.md

```
