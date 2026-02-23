import { Agent, AgentConfig, AgentResult, EnrichmentTask } from './types';
import { ProviderFactory } from './providers';

/**
 * Specialized agent for generating realistic request/response examples
 */
export class ExampleAgent extends Agent {
  name = 'ExampleAgent';
  provider: string;
  private aiProvider: any;

  constructor(config: AgentConfig) {
    super(config);
    // Use environment-configured provider or fallback to first available
    this.provider = process.env.EXAMPLES_AGENT_PROVIDER || 
                   config.defaultProvider || 
                   Object.keys(config.providers)[0] || 
                   'anthropic';
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

    // Extract schema information
    const requestSchemaName = endpoint.requestBody?.$ref?.replace('#/components/schemas/', '');
    const responseSchemaName = endpoint.response?.$ref?.replace('#/components/schemas/', '');
    
    const requestSchema = requestSchemaName ? schemas[requestSchemaName] : null;
    const responseSchema = responseSchemaName ? schemas[responseSchemaName] : null;

    const systemPrompt = `You are a specialized agent for generating realistic API examples.

Your task is to create practical request and response examples based on the provided schema information.

Guidelines:
- Generate realistic but generic data (no real personal information)
- Follow the exact schema structure and types
- Use meaningful example values that demonstrate the purpose
- Include all required fields and some optional ones
- For IDs, use UUIDs or realistic-looking identifiers
- For dates, use recent but consistent timestamps
- For enums, use actual enum values from the schema

Respond with JSON in this exact format:
{
  "requestExample": <object or null>,
  "responseExample": <object or null>
}

If no schema is available for request or response, use null for that field.`;

    const userPrompt = `Generate examples for this API endpoint:

ENDPOINT: ${method.toUpperCase()} ${path}
HANDLER: ${endpoint.handler || 'unknown'}

REQUEST SCHEMA: ${requestSchema ? JSON.stringify(requestSchema, null, 2) : 'None'}
RESPONSE SCHEMA: ${responseSchema ? JSON.stringify(responseSchema, null, 2) : 'None'}

PARAMETERS: ${JSON.stringify(endpoint.params || [], null, 2)}

Create examples that would help a developer understand how to use this endpoint effectively.`;

    try {
      const response = await this.aiProvider.call(systemPrompt, userPrompt);
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      return {
        requestExample: parsed.requestExample,
        responseExample: parsed.responseExample,
      };
    } catch (error: any) {
      console.warn(`⚠️ ExampleAgent failed for ${method} ${path}:`, error.message);
      
      // Fallback to schema-based generation
      return this.generateFallbackExamples(endpoint, requestSchema, responseSchema);
    }
  }

  private generateFallbackExamples(endpoint: any, requestSchema: any, responseSchema: any): Partial<AgentResult> {
    const requestExample = requestSchema ? this.generateExampleFromSchema(requestSchema) : null;
    const responseExample = responseSchema ? this.generateExampleFromSchema(responseSchema) : 
                           this.generateGenericResponse(endpoint.method);

    return { requestExample, responseExample };
  }

  private generateExampleFromSchema(schema: any): any {
    if (!schema?.properties) return null;

    const example: any = {};
    for (const [key, prop] of Object.entries(schema.properties as Record<string, any>)) {
      example[key] = this.generateValueForProperty(key, prop);
    }
    return example;
  }

  private generateValueForProperty(key: string, prop: any): any {
    switch (prop.type) {
      case 'string':
        if (prop.enum) return prop.enum[0];
        if (key.toLowerCase().includes('email')) return 'john.doe@example.com';
        if (key.toLowerCase().includes('id')) return 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
        if (key.toLowerCase().includes('name')) return 'John Doe';
        if (key.toLowerCase().includes('code')) return 'EMP001';
        if (key.toLowerCase().includes('url')) return 'https://example.com';
        if (key.toLowerCase().includes('date')) return new Date().toISOString().split('T')[0];
        return `sample_${key}`;
        
      case 'number':
        if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) return 100.50;
        if (key.toLowerCase().includes('rate')) return 15.75;
        return 42;
        
      case 'integer':
        if (key.toLowerCase().includes('count')) return 5;
        if (key.toLowerCase().includes('age')) return 30;
        return 123;
        
      case 'boolean':
        return true;
        
      case 'array':
        if (prop.items) {
          return [this.generateValueForProperty(key.slice(0, -1), prop.items)];
        }
        return [];
        
      case 'object':
        if (prop.properties) {
          return this.generateExampleFromSchema(prop);
        }
        return {};
        
      default:
        return null;
    }
  }

  private generateGenericResponse(method: string): any {
    switch (method.toLowerCase()) {
      case 'get':
        return {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      case 'post':
        return {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          message: 'Resource created successfully',
          status: 'created',
          createdAt: new Date().toISOString(),
        };
      case 'put':
      case 'patch':
        return {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          message: 'Resource updated successfully',
          updatedAt: new Date().toISOString(),
        };
      case 'delete':
        return {
          message: 'Resource deleted successfully',
          deletedAt: new Date().toISOString(),
        };
      default:
        return {
          message: 'Operation completed successfully',
          timestamp: new Date().toISOString(),
        };
    }
  }
}