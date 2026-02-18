# Legacy Scripts

This folder contains deprecated scripts that have been replaced by better implementations.

## Files

### `enrich-metadata-simple.ts`
- **Status:** 🟡 **DEPRECATED** 
- **Replaced by:** AgentOrchestrator system (`../enrich-metadata-agentic.ts`)
- **Reason:** Single-agent approach replaced by specialized multi-agent workflows
- **Use:** Only for development/testing purposes

## Why Deprecated?

The simple enrichment script was replaced by the **AgentOrchestrator system** which provides:

- ✅ **4 Specialized Agents** (Description, Examples, Errors, Security)
- ✅ **Parallel Processing** for faster execution  
- ✅ **Multiple AI Providers** (OpenAI, Claude, Ollama, Gemini)
- ✅ **Better Error Handling** and fallback strategies
- ✅ **Detailed Analytics** and health monitoring
- ✅ **Higher Quality Output** with realistic examples

## Migration

If you were using:
```bash
npm run enrich          # Old simple method
```

Use instead:
```bash
npm run enrich-agentic  # New AgentOrchestrator method (default)
```

The CLI now uses AgentOrchestrator by default:
```bash
npm run cli -- generate ./path      # Uses agentic workflow
npm run cli -- generate ./path --simple  # Uses legacy (not recommended)
```