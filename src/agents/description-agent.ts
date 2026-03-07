import { Agent, AgentConfig, AgentResult, EnrichmentTask, AIProvider } from './types';
import { ProviderFactory } from './providers';

/**
 * Specialized agent for generating descriptions and use cases
 */
export class DescriptionAgent extends Agent {
  name = 'DescriptionAgent';
  provider: string;
  private aiProvider: AIProvider | null = null;

  constructor(config: AgentConfig) {
    super(config);
    // Use environment-configured provider or fallback to first available
    this.provider = process.env.DESCRIPTION_AGENT_PROVIDER || 
                   config.defaultProvider || 
                   Object.keys(config.providers)[0] || 
                   'openai';
    this.initializeProvider();
  }

  private initializeProvider(): void {
    const providerConfig = this.config.providers[this.provider as keyof typeof this.config.providers];
    if (providerConfig) {
      this.aiProvider = ProviderFactory.create(this.provider, providerConfig);
    }
  }

  setProvider(provider: string): void {
    this.provider = provider;
    this.initializeProvider();
  }

  isHealthy(): boolean {
    return this.aiProvider?.isAvailable() || false;
  }

  async process(task: EnrichmentTask): Promise<Partial<AgentResult>> {
    const { path, method, endpoint } = task;

    // Build swagger context block when decorator hints are available
    const swaggerHints = endpoint.swagger
      ? [
          endpoint.swagger.summary    ? `  Developer-provided summary: "${endpoint.swagger.summary}"` : '',
          endpoint.swagger.description ? `  Developer-provided description: "${endpoint.swagger.description}"` : '',
          endpoint.swagger.tags?.length ? `  Tags: ${endpoint.swagger.tags.join(', ')}` : '',
          endpoint.swagger.responses?.length
            ? `  Declared responses: ${endpoint.swagger.responses.map(r => `${r.status} - ${r.description}`).join(', ')}`
            : '',
        ].filter(Boolean).join('\n')
      : null;

    const systemPrompt = `You are a specialized API documentation agent focused on creating clear, concise descriptions and practical use cases.

Your task is to analyze API endpoints and provide:
1. A clear, technical description of what the endpoint does
2. A practical use case explaining when developers would use this endpoint

Rules:
- Be concise but informative
- Focus on the technical purpose, not implementation details
- Use developer-friendly language
- Avoid generic phrases like "Developers use this endpoint when..."

Respond with JSON in this exact format:
{
  "description": "string",
  "useCase": "string"
}`;

    const userPrompt = `Analyze this API endpoint and provide a description and use case:

ENDPOINT: ${method.toUpperCase()} ${path}
HANDLER: ${endpoint.handler || 'unknown'}
AUTH: ${endpoint.auth ? 'Required' : 'Not required'}
PARAMETERS: ${JSON.stringify(endpoint.params || [], null, 2)}${swaggerHints ? `\n\nEXISTING ANNOTATIONS FROM SOURCE CODE:\n${swaggerHints}\n\nUse these as a starting point — expand and improve them, do not contradict them.` : ''}

Focus on what this endpoint accomplishes from a business/technical perspective.`;

    try {
      if (!this.aiProvider) {
        return this.generateFallbackDescription(path, method);
      }
      const response = await this.aiProvider.call(systemPrompt, userPrompt);
      let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      // Extract just the JSON object — Ollama sometimes appends trailing prose after the closing brace
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) cleanResponse = jsonMatch[0];
      const parsed = JSON.parse(cleanResponse);
      
      return {
        description: parsed.description,
        useCase: parsed.useCase,
      };
    } catch (error: any) {
      console.warn(`⚠️ DescriptionAgent failed for ${method} ${path}:`, error.message);
      
      // Fallback to rule-based generation
      return this.generateFallbackDescription(path, method);
    }
  }

  private generateFallbackDescription(path: string, method: string): Partial<AgentResult> {
    const methodLower = method.toLowerCase();
    let description = '';
    let useCase = '';

    switch (methodLower) {
      case 'get':
        if (path.includes(':') || path.includes('{')) {
          description = `Retrieves a specific resource identified by the path parameters`;
          useCase = `Use when you need to fetch detailed information about a specific item`;
        } else {
          description = `Retrieves a collection of resources, optionally filtered by query parameters`;
          useCase = `Use when you need to list, search, or browse multiple items`;
        }
        break;
      case 'post':
        description = `Creates a new resource with the provided data`;
        useCase = `Use when you need to add a new item or submit data for processing`;
        break;
      case 'put':
        description = `Updates an existing resource by replacing it entirely`;
        useCase = `Use when you need to completely update all fields of an existing item`;
        break;
      case 'patch':
        description = `Partially updates an existing resource`;
        useCase = `Use when you need to modify only specific fields of an existing item`;
        break;
      case 'delete':
        description = `Removes a resource from the system`;
        useCase = `Use when you need to permanently delete an item`;
        break;
      default:
        description = `Performs a ${method.toUpperCase()} operation on the resource`;
        useCase = `Use for specialized ${method.toLowerCase()} operations on this endpoint`;
    }

    return { description, useCase };
  }
}