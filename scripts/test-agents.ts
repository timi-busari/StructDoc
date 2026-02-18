import { config } from 'dotenv';
import { AgentOrchestrator } from '../src/agents/agent-orchestrator';
import { loadAgentConfig } from '../src/agent-config';
import { EnrichmentTask } from '../src/agents/types';

// Load environment variables
config();

/**
 * Test script for agentic workflows
 */
async function testAgents(): Promise<void> {
  console.log('🧪 Testing Agentic Workflows...\n');

  try {
    // Load configuration
    const agentConfig = loadAgentConfig();
    console.log('🔧 Available Providers:', Object.keys(agentConfig.providers));

    if (Object.keys(agentConfig.providers).length === 0) {
      console.log('❌ No AI providers configured!');
      console.log('   Please set OPENAI_API_KEY, ANTHROPIC_API_KEY, or other provider keys in .env');
      process.exit(1);
    }

    // Initialize orchestrator
    const orchestrator = new AgentOrchestrator(agentConfig);

    // Check agent health
    const agentStatus = orchestrator.getAgentStatus();
    console.log('\n🏥 Agent Health Status:');
    for (const [name, status] of Object.entries(agentStatus)) {
      const icon = status.healthy ? '✅' : '❌';
      console.log(`   ${icon} ${status.name}: ${status.provider}`);
    }

    // Test with a sample endpoint
    const sampleTask: EnrichmentTask = {
      path: '/api/users/:id',
      method: 'get',
      endpoint: {
        handler: 'UserController.findById',
        auth: 'BearerAuth',
        params: [
          { name: 'id', in: 'path', type: 'string' }
        ]
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user', 'manager'] },
            createdAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'name', 'email']
        }
      }
    };

    console.log('\n🎭 Testing with sample endpoint: GET /api/users/:id');
    
    const startTime = Date.now();
    const result = await orchestrator.processEndpoint(sampleTask);
    const processingTime = Date.now() - startTime;

    console.log(`\n📊 Results (${processingTime}ms):`);
    console.log('📝 Description:', result.description);
    console.log('💡 Use Case:', result.useCase);
    console.log('🔒 Auth Notes:', result.authNotes || 'None');
    console.log('📋 Request Example:', result.requestExample ? 'Generated' : 'None');
    console.log('📄 Response Example:', result.responseExample ? 'Generated' : 'None');
    console.log('⚠️ Error Scenarios:', result.errorScenarios?.length || 0, 'scenarios');

    if (result.errorScenarios && result.errorScenarios.length > 0) {
      console.log('\n🚨 Sample Error Scenarios:');
      result.errorScenarios.slice(0, 2).forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }

    console.log('\n✅ Agentic workflow test completed successfully!');
    console.log('\n💡 To use in your pipeline:');
    console.log('   npm run enrich-agentic');

  } catch (error) {
    console.error('❌ Agent test failed:', error);
    process.exit(1);
  }
}

// Run tests
testAgents();