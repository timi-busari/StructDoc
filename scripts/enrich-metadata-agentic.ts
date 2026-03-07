import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from 'dotenv';
import { AgentOrchestrator } from '../src/agents/agent-orchestrator';
import { loadAgentConfig, loadWorkflowConfig } from '../src/agent-config';
import { EnrichmentTask, AgentResult, AgentStatus, SchemaObject } from '../src/agents/types';

// Load environment variables
config();

export interface NormalizedMetadata {
  controllers: Array<{
    name: string;
    basePath: string;
    endpoints: Array<{
      method: string;
      path: string;
      handler: string;
      auth?: string | null;
      requestBody?: { $ref: string } | null;
      response?: { $ref: string } | null;
      params?: Array<{ name: string; in: string; type: string }>;
    }>;
  }>;
  components?: {
    schemas: Record<string, SchemaObject>;
  };
}

export interface EnrichedMetadata extends NormalizedMetadata {
  enriched: {
    endpoints: AgentResult[];
    generatedAt: string;
    agentStats: {
      totalEndpoints: number;
      successfulEnrichments: number;
      fallbackEnrichments: number;
      agentStatus: Record<string, AgentStatus>;
      processingTime: number;
    };
  };
}

// ── Enrichment cache ────────────────────────────────────────────────────────
/**
 * Stable MD5 hash of the parts of an endpoint that, if changed,
 * should trigger re-enrichment (method, path, params, body schema, response schema).
 */
function computeEndpointHash(
  endpoint: NormalizedMetadata['controllers'][number]['endpoints'][number],
): string {
  const stable = {
    method: endpoint.method,
    path: endpoint.path,
    params: endpoint.params ?? [],
    requestBody: endpoint.requestBody ?? null,
    response: endpoint.response ?? null,
  };
  return crypto.createHash('md5').update(JSON.stringify(stable)).digest('hex');
}

function loadCache(cacheFile: string): Record<string, AgentResult> {
  try {
    if (fs.existsSync(cacheFile)) {
      return JSON.parse(fs.readFileSync(cacheFile, 'utf-8')) as Record<string, AgentResult>;
    }
  } catch { /* corrupt or missing — start fresh */ }
  return {};
}

function saveCache(cacheFile: string, cache: Record<string, AgentResult>): void {
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.warn('⚠️ Could not write enrichment cache:', e);
  }
}
// ────────────────────────────────────────────────────────────────────────────

/**
 * Main agentic enrichment function
 */
async function enrichMetadataWithAgents(
  inputFileOrData: string | NormalizedMetadata,
  outputFile?: string,
): Promise<EnrichedMetadata> {
  const startTime = Date.now();

  try {
    console.log(`🤖 Starting Agentic Workflow Enrichment...`);

    let normalizedData: NormalizedMetadata;

    if (typeof inputFileOrData === 'string') {
      console.log(`📖 Reading normalized metadata from ${inputFileOrData}...`);
      if (!fs.existsSync(inputFileOrData)) {
        throw new Error(`Input file not found: ${inputFileOrData}`);
      }
      normalizedData = JSON.parse(fs.readFileSync(inputFileOrData, 'utf-8')) as NormalizedMetadata;
    } else {
      normalizedData = inputFileOrData;
    }

    // Load configurations
    const agentConfig = loadAgentConfig();
    const workflowConfig = loadWorkflowConfig();
    
    console.log(`🔧 Agent Configuration:`, {
      availableProviders: Object.keys(agentConfig.providers),
      defaultProvider: agentConfig.defaultProvider,
      fallbackProviders: agentConfig.fallbackProviders,
    });

    // Initialize agent orchestrator
    const orchestrator = new AgentOrchestrator(agentConfig);
    
    // Check agent health
    const agentStatus = orchestrator.getAgentStatus();
    console.log(`🏥 Agent Health Check:`, agentStatus);
    
    const healthyAgents = Object.values(agentStatus).filter(status => status.healthy).length;
    console.log(`✅ ${healthyAgents}/${Object.keys(agentStatus).length} agents are healthy`);

    if (healthyAgents === 0) {
      console.warn('⚠️ No healthy agents available! Using fallback template-based enrichment.');
    }

    // Count endpoints
    const totalEndpoints = normalizedData.controllers.reduce(
      (sum, controller) => sum + controller.endpoints.length, 
      0
    );
    console.log(`📊 Found ${totalEndpoints} endpoints across ${normalizedData.controllers.length} controllers`);

    const enrichedEndpoints: AgentResult[] = [];
    const availableSchemas: Record<string, SchemaObject> = normalizedData.components?.schemas || {};
    let successCount = 0;
    let fallbackCount = 0;

    // Load enrichment cache from previous run
    const cacheFile = path.join(process.cwd(), '.temp', 'enrichment-cache.json');
    const cache = loadCache(cacheFile);
    const prevCacheSize = Object.keys(cache).length;
    let cacheHits = 0;
    if (prevCacheSize > 0) {
      console.log(`\n💾 Loaded cache — ${prevCacheSize} previously enriched endpoints available`);
    }

    // Process each controller and its endpoints
    for (const controller of normalizedData.controllers) {
      console.log(`\n🏗️ Processing controller: ${controller.name}`);
      
      for (const endpoint of controller.endpoints) {
        const task: EnrichmentTask = {
          path: endpoint.path,
          method: endpoint.method,
          endpoint,
          schemas: availableSchemas,
        };

        try {
          const hash = computeEndpointHash(endpoint);

          if (cache[hash]) {
            // Serve from cache — no AI call needed
            console.log(`  💾 [cached] ${endpoint.method.toUpperCase()} ${endpoint.path}`);
            enrichedEndpoints.push(cache[hash]);
            cacheHits++;
            successCount++;
            process.stdout.write('💾 ');
          } else {
            console.log(`  🎭 Processing ${endpoint.method.toUpperCase()} ${endpoint.path}...`);

            const enriched = await orchestrator.processEndpoint(task);

            // Persist to cache for future runs
            cache[hash] = enriched;
            enrichedEndpoints.push(enriched);

            if (healthyAgents > 0 && !enriched.description?.includes('Developers use this endpoint')) {
              successCount++;
              process.stdout.write('✅ ');
            } else {
              fallbackCount++;
              process.stdout.write('⚠️ ');
            }

            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          console.warn(`\n❌ Failed to process ${endpoint.method.toUpperCase()} ${endpoint.path}:`, error);
          fallbackCount++;
          process.stdout.write('❌ ');
        }
      }
    }

    const processingTime = Date.now() - startTime;

    // Persist updated cache before writing output
    saveCache(cacheFile, cache);

    // Create enriched metadata with agent statistics
    const enrichedMetadata: EnrichedMetadata = {
      ...normalizedData,
      enriched: {
        endpoints: enrichedEndpoints,
        generatedAt: new Date().toISOString(),
        agentStats: {
          totalEndpoints,
          successfulEnrichments: successCount,
          fallbackEnrichments: fallbackCount,
          agentStatus,
          processingTime,
        },
      }
    };

    // Write output file only when a path was supplied (standalone mode)
    if (outputFile) {
      fs.writeFileSync(outputFile, JSON.stringify(enrichedMetadata, null, 2));
      console.log(`   📝 Output: ${outputFile}`);
    }

    console.log(`\n\n📊 Agentic Enrichment Summary:`);
    console.log(`   🎯 Total endpoints: ${totalEndpoints}`);
    console.log(`   💾 From cache: ${cacheHits} endpoints`);
    console.log(`   ✅ AI-powered: ${successCount - cacheHits} endpoints`);
    console.log(`   ⚠️  Template fallback: ${fallbackCount} endpoints`);
    console.log(`   ⏱️  Processing time: ${(processingTime / 1000).toFixed(2)}s`);

    if (successCount > 0) {
      console.log(`\n🎉 Successfully enriched ${successCount} endpoints using AI agents!`);
    }

    if (fallbackCount > 0 && healthyAgents === 0) {
      console.log(`\n💡 To enable AI-powered enrichment:`);
      console.log(`   1. Configure at least one AI provider in .env:`);
      console.log(`      OPENAI_API_KEY=your_key_here`);
      console.log(`      ANTHROPIC_API_KEY=your_key_here`);
      console.log(`      OLLAMA_BASE_URL=http://localhost:11434`);
      console.log(`   2. Re-run the enrichment process`);
    }

    // Show agent performance stats
    console.log(`\n🤖 Agent Performance:`);
    for (const [, status] of Object.entries(agentStatus)) {
      const icon = status.healthy ? '✅' : '❌';
      console.log(`   ${icon} ${status.name}: ${status.provider} (${status.healthy ? 'healthy' : 'unhealthy'})`);
    }

    return enrichedMetadata;
    
  } catch (error) {
    console.error('❌ Agentic enrichment failed:', error);
    process.exit(1);
  }
}

/** Standalone entry point — called when the script is executed directly */
export { enrichMetadataWithAgents };

const inputFile = process.argv[2] || './.temp/normalized-metadata.json';
const outputFile = process.argv[3] || './.temp/enriched-metadata.json';

if (require.main === module) {
  enrichMetadataWithAgents(inputFile, outputFile);
}