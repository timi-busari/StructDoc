import { Agent, AgentConfig, AgentResult, EnrichmentTask } from './types';
import { DescriptionAgent } from './description-agent';
import { ExampleAgent } from './example-agent';
import { ErrorScenarioAgent } from './error-scenario-agent';
import { SecurityAgent } from './security-agent';

/**
 * Agent Orchestrator - Manages multiple specialized agents
 */
export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.initializeAgents();
  }

  /**
   * Initialize all available agents
   */
  private initializeAgents(): void {
    // Register specialized agents
    this.agents.set('description', new DescriptionAgent(this.config));
    this.agents.set('examples', new ExampleAgent(this.config));
    this.agents.set('errors', new ErrorScenarioAgent(this.config));
    this.agents.set('security', new SecurityAgent(this.config));

    console.log(`🤖 Initialized ${this.agents.size} specialized agents`);
  }

  /**
   * Process an endpoint using multiple agents
   */
  async processEndpoint(task: EnrichmentTask): Promise<AgentResult> {
    const { path, method, endpoint, schemas } = task;
    console.log(`🎭 Processing ${method.toUpperCase()} ${path} with ${this.agents.size} agents...`);

    const results: Partial<AgentResult> = {
      originalPath: path,
      originalMethod: method.toUpperCase(),
    };

    // Run agents in parallel for efficiency
    const agentTasks = Array.from(this.agents.entries()).map(async ([agentType, agent]) => {
      try {
        const result = await agent.process(task);
        return { agentType, result };
      } catch (error: any) {
        console.warn(`⚠️ Agent ${agentType} failed for ${method} ${path}:`, error.message);
        return { agentType, result: null };
      }
    });

    // Wait for all agents to complete
    const agentResults = await Promise.all(agentTasks);

    // Merge results from all agents
    for (const { agentType, result } of agentResults) {
      if (result) {
        switch (agentType) {
          case 'description':
            results.description = result.description;
            results.useCase = result.useCase;
            break;
          case 'examples':
            results.requestExample = result.requestExample;
            results.responseExample = result.responseExample;
            break;
          case 'errors':
            results.errorScenarios = result.errorScenarios || [];
            break;
          case 'security':
            results.authNotes = result.authNotes;
            break;
        }
      }
    }

    // Ensure all required fields are present
    results.description = results.description || `${method.toUpperCase()} operation on ${path}`;
    results.useCase = results.useCase || `Use this endpoint to perform ${method.toLowerCase()} operations`;
    results.errorScenarios = results.errorScenarios || ['Invalid request format', 'Server error'];

    return results as AgentResult;
  }

  /**
   * Get agent status and health
   */
  getAgentStatus(): Record<string, { name: string; provider: string; healthy: boolean }> {
    const status: Record<string, { name: string; provider: string; healthy: boolean }> = {};
    
    for (const [agentType, agent] of this.agents.entries()) {
      status[agentType] = {
        name: agent.name,
        provider: agent.provider,
        healthy: agent.isHealthy(),
      };
    }

    return status;
  }

  /**
   * Configure which agents to use for different tasks
   */
  configureWorkflow(workflow: {
    description?: string; // Agent provider for descriptions
    examples?: string;    // Agent provider for examples
    errors?: string;      // Agent provider for error scenarios
    security?: string;    // Agent provider for security notes
  }): void {
    console.log('🔧 Configuring agent workflow:', workflow);
    
    // Update agent providers based on workflow configuration
    for (const [task, provider] of Object.entries(workflow)) {
      const agent = this.agents.get(task);
      if (agent && provider) {
        agent.setProvider(provider);
      }
    }
  }

  /**
   * Add a custom agent
   */
  addAgent(name: string, agent: Agent): void {
    this.agents.set(name, agent);
    console.log(`✅ Added custom agent: ${name}`);
  }

  /**
   * Remove an agent
   */
  removeAgent(name: string): boolean {
    const removed = this.agents.delete(name);
    if (removed) {
      console.log(`🗑️ Removed agent: ${name}`);
    }
    return removed;
  }
}