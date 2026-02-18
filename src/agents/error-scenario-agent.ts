import { Agent, AgentConfig, AgentResult, EnrichmentTask } from './types';
import { ProviderFactory } from './providers';

/**
 * Specialized agent for generating error scenarios and troubleshooting info
 */
export class ErrorScenarioAgent extends Agent {
  name = 'ErrorScenarioAgent';
  provider: string;
  private aiProvider: any;

  constructor(config: AgentConfig) {
    super(config);
    // Use environment-configured provider or fallback to first available
    this.provider = process.env.ERRORS_AGENT_PROVIDER || 
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
    const { path, method, endpoint, schemas } = task;

    const requestSchemaName = endpoint.requestBody?.$ref?.replace('#/components/schemas/', '');
    const requestSchema = requestSchemaName ? schemas[requestSchemaName] : null;

    const systemPrompt = `You are a specialized agent for identifying potential error scenarios in API endpoints.

Your task is to analyze an endpoint and predict common error scenarios developers might encounter.

Consider:
- Request validation errors (missing fields, wrong types, invalid formats)
- Authentication/authorization issues
- Business logic constraints
- Resource availability (not found, already exists, etc.)
- Rate limiting and quota issues
- Server-side processing errors

Generate 3-5 realistic error scenarios that developers should be aware of.

Respond with JSON in this exact format:
{
  "errorScenarios": ["error scenario 1", "error scenario 2", "error scenario 3"]
}

Keep scenarios concise and actionable.`;

    const userPrompt = `Analyze this API endpoint and identify potential error scenarios:

ENDPOINT: ${method.toUpperCase()} ${path}
HANDLER: ${endpoint.handler || 'unknown'}
AUTH REQUIRED: ${endpoint.auth ? 'Yes' : 'No'}

REQUEST SCHEMA: ${requestSchema ? JSON.stringify(requestSchema, null, 2) : 'No request body'}
PARAMETERS: ${JSON.stringify(endpoint.params || [], null, 2)}

What errors might developers encounter when using this endpoint?`;

    try {
      const response = await this.aiProvider.call(systemPrompt, userPrompt);
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      return {
        errorScenarios: parsed.errorScenarios || [],
      };
    } catch (error: any) {
      console.warn(`⚠️ ErrorScenarioAgent failed for ${method} ${path}:`, error.message);
      
      // Fallback to common error scenarios
      return this.generateFallbackErrors(method, endpoint, requestSchema);
    }
  }

  private generateFallbackErrors(method: string, endpoint: any, requestSchema: any): Partial<AgentResult> {
    const errors: string[] = [];

    // Common HTTP errors
    errors.push('Server error (500) - Internal processing failure');

    // Authentication errors
    if (endpoint.auth) {
      errors.push('Unauthorized (401) - Invalid or missing authentication token');
      errors.push('Forbidden (403) - Insufficient permissions for this operation');
    }

    // Method-specific errors
    switch (method.toLowerCase()) {
      case 'get':
        if (endpoint.params?.some((p: any) => p.in === 'path')) {
          errors.push('Not found (404) - Resource does not exist or has been deleted');
        }
        errors.push('Bad request (400) - Invalid query parameters or filters');
        break;

      case 'post':
        if (requestSchema) {
          errors.push('Bad request (400) - Invalid request body or missing required fields');
          errors.push('Conflict (409) - Resource already exists or violates constraints');
        }
        errors.push('Unprocessable entity (422) - Request format valid but contains invalid data');
        break;

      case 'put':
      case 'patch':
        errors.push('Not found (404) - Resource to update does not exist');
        if (requestSchema) {
          errors.push('Bad request (400) - Invalid update data or missing required fields');
        }
        errors.push('Conflict (409) - Update conflicts with current resource state');
        break;

      case 'delete':
        errors.push('Not found (404) - Resource to delete does not exist');
        errors.push('Conflict (409) - Resource cannot be deleted due to dependencies');
        break;
    }

    // Rate limiting (common for all endpoints)
    errors.push('Too many requests (429) - Rate limit exceeded, retry after delay');

    return {
      errorScenarios: errors.slice(0, 5), // Limit to 5 most relevant
    };
  }
}