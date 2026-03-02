import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { AgentOrchestrator } from '../src/agents/agent-orchestrator';
import { loadAgentConfig, loadWorkflowConfig } from '../src/agent-config';
import { EnrichmentTask } from '../src/agents/types';

// Load environment variables
config();

interface NormalizedMetadata {
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
    schemas: Record<string, any>;
  };
}

interface EnrichedMetadata extends NormalizedMetadata {
  enriched: {
    endpoints: any[];
    generatedAt: string;
    agentStats: {
      totalEndpoints: number;
      successfulEnrichments: number;
      fallbackEnrichments: number;
      agentStatus: Record<string, any>;
      processingTime: number;
    };
  };
}

/**
 * Main agentic enrichment function
 */
async function enrichMetadataWithAgents(inputFile: string, outputFile: string): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log(`🤖 Starting Agentic Workflow Enrichment...`);
    console.log(`📖 Reading normalized metadata from ${inputFile}...`);
    
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
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
    
    const healthyAgents = Object.values(agentStatus).filter((status: any) => status.healthy).length;
    console.log(`✅ ${healthyAgents}/${Object.keys(agentStatus).length} agents are healthy`);

    if (healthyAgents === 0) {
      console.warn('⚠️ No healthy agents available! Using fallback template-based enrichment.');
    }

    // Load normalized metadata
    const normalizedData = JSON.parse(fs.readFileSync(inputFile, 'utf-8')) as NormalizedMetadata;
    
    // Count endpoints
    const totalEndpoints = normalizedData.controllers.reduce(
      (sum, controller) => sum + controller.endpoints.length, 
      0
    );
    console.log(`📊 Found ${totalEndpoints} endpoints across ${normalizedData.controllers.length} controllers`);

    const enrichedEndpoints: any[] = [];
    const availableSchemas = normalizedData.components?.schemas || {};
    let successCount = 0;
    let fallbackCount = 0;

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
          console.log(`  🎭 Processing ${endpoint.method.toUpperCase()} ${endpoint.path}...`);
          
          const enriched = await orchestrator.processEndpoint(task);
          enrichedEndpoints.push(enriched);
          
          // Check if this was AI-enriched or template fallback
          if (healthyAgents > 0 && !enriched.description?.includes('Developers use this endpoint')) {
            successCount++;
            process.stdout.write('✅ ');
          } else {
            fallbackCount++;
            process.stdout.write('⚠️ ');
          }
          
          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.warn(`\n❌ Failed to process ${endpoint.method.toUpperCase()} ${endpoint.path}:`, error);
          fallbackCount++;
          process.stdout.write('❌ ');
        }
      }
    }

    const processingTime = Date.now() - startTime;

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

    // Write output
    fs.writeFileSync(outputFile, JSON.stringify(enrichedMetadata, null, 2));
    
    console.log(`\n\n📊 Agentic Enrichment Summary:`);
    console.log(`   🎯 Total endpoints: ${totalEndpoints}`);
    console.log(`   ✅ AI-powered: ${successCount} endpoints`);
    console.log(`   ⚠️ Template fallback: ${fallbackCount} endpoints`);
    console.log(`   ⏱️ Processing time: ${(processingTime / 1000).toFixed(2)}s`);
    console.log(`   📝 Output: ${outputFile}`);

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
    for (const [agentName, status] of Object.entries(agentStatus)) {
      const agentStatus_typed = status as any;
      const icon = agentStatus_typed.healthy ? '✅' : '❌';
      console.log(`   ${icon} ${agentStatus_typed.name}: ${agentStatus_typed.provider} (${agentStatus_typed.healthy ? 'healthy' : 'unhealthy'})`);
    }
    
  } catch (error) {
    console.error('❌ Agentic enrichment failed:', error);
    process.exit(1);
  }
}

// Main execution
const inputFile = process.argv[2] || './.temp/normalized-metadata.json';
const outputFile = process.argv[3] || './.temp/enriched-metadata.json';

enrichMetadataWithAgents(inputFile, outputFile);