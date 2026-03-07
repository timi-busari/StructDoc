import { config } from 'dotenv';
import { loadAgentConfig } from '../src/agent-config';
import { DescriptionAgent } from '../src/agents/description-agent';
import { ExampleAgent } from '../src/agents/example-agent';
import { ErrorScenarioAgent } from '../src/agents/error-scenario-agent';
import { SecurityAgent } from '../src/agents/security-agent';
import { EnrichmentTask } from '../src/agents/types';

// Load environment variables
config();

/**
 * Test individual agents with their configured providers
 */
async function testIndividualAgents(): Promise<void> {
  console.log('🔬 Testing Individual Agents with Provider Specialization...\n');

  try {
    // Load configuration
    const agentConfig = loadAgentConfig();
    console.log('🔧 Available Providers:', Object.keys(agentConfig.providers));

    if (Object.keys(agentConfig.providers).length === 0) {
      console.log('❌ No AI providers configured!');
      console.log('   Please set AI provider keys in .env');
      process.exit(1);
    }

    // Sample test task
    const sampleTask: EnrichmentTask = {
      path: '/api/users/:id',
      method: 'get',
      endpoint: {
        method: 'get',
        path: '/api/users/:id',
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
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'user', 'manager'] },
            createdAt: { type: 'string', format: 'date-time' },
            isActive: { type: 'boolean' }
          },
          required: ['id', 'name', 'email']
        }
      }
    };

    console.log('📋 Test Task: GET /api/users/:id\n');

    // Test each agent individually
    const agents = [
      { name: 'DescriptionAgent', class: DescriptionAgent, envVar: 'DESCRIPTION_AGENT_PROVIDER' },
      { name: 'ExampleAgent', class: ExampleAgent, envVar: 'EXAMPLES_AGENT_PROVIDER' },
      { name: 'ErrorScenarioAgent', class: ErrorScenarioAgent, envVar: 'ERRORS_AGENT_PROVIDER' },
      { name: 'SecurityAgent', class: SecurityAgent, envVar: 'SECURITY_AGENT_PROVIDER' },
    ];

    let totalSuccessful = 0;
    let totalFailed = 0;

    for (const { name, class: AgentClass, envVar } of agents) {
      console.log(`\n🎭 Testing ${name}:`);
      console.log(`   📍 Environment Variable: ${envVar}=${process.env[envVar] || 'not set'}`);
      
      try {
        const agent = new AgentClass(agentConfig);
        console.log(`   🤖 Agent Provider: ${agent.provider}`);
        console.log(`   🏥 Health Check: ${agent.isHealthy() ? '✅ Healthy' : '❌ Unhealthy'}`);

        if (!agent.isHealthy()) {
          console.log(`   ⚠️ Skipping ${name} - provider not available`);
          totalFailed++;
          continue;
        }

        const startTime = Date.now();
        const result = await agent.process(sampleTask);
        const duration = Date.now() - startTime;

        console.log(`   ⏱️ Processing Time: ${duration}ms`);
        console.log(`   📊 Result Keys: [${Object.keys(result).join(', ')}]`);
        
        // Show sample output based on agent type
        if (name === 'DescriptionAgent') {
          console.log(`   📝 Description: ${result.description || 'None'}`);
          console.log(`   💡 Use Case: ${result.useCase || 'None'}`);
        } else if (name === 'ExampleAgent') {
          console.log(`   📋 Request Example: ${result.requestExample ? 'Generated' : 'None'}`);
          console.log(`   📄 Response Example: ${result.responseExample ? 'Generated' : 'None'}`);
        } else if (name === 'ErrorScenarioAgent') {
          console.log(`   ⚠️ Error Scenarios: ${result.errorScenarios?.length || 0} scenarios`);
          if (result.errorScenarios && result.errorScenarios.length > 0) {
            console.log(`   🚨 Sample: ${result.errorScenarios[0]}`);
          }
        } else if (name === 'SecurityAgent') {
          console.log(`   🔒 Auth Notes: ${result.authNotes ? 'Generated' : 'None'}`);
        }

        console.log(`   ✅ ${name} test PASSED`);
        totalSuccessful++;

      } catch (error: any) {
        console.log(`   ❌ ${name} test FAILED: ${error.message}`);
        totalFailed++;
      }
    }

    // Summary
    console.log(`\n📊 Individual Agent Test Results:`);
    console.log(`   ✅ Successful: ${totalSuccessful} agents`);
    console.log(`   ❌ Failed: ${totalFailed} agents`);
    console.log(`   📈 Success Rate: ${Math.round((totalSuccessful / agents.length) * 100)}%`);

    if (totalSuccessful === agents.length) {
      console.log(`\n🎉 All agents working perfectly with their specialized providers!`);
    } else if (totalSuccessful > 0) {
      console.log(`\n⚠️ Partial success - some agents need provider configuration adjustments`);
    } else {
      console.log(`\n❌ No agents working - check provider configurations`);
    }

    console.log(`\n💡 Provider Assignments:`);
    agents.forEach(({ name, envVar }) => {
      const provider = process.env[envVar] || 'default';
      const available = Object.keys(agentConfig.providers).includes(provider);
      console.log(`   ${name}: ${provider} ${available ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Individual agent test failed:', error);
    process.exit(1);
  }
}

// Run individual tests
testIndividualAgents();