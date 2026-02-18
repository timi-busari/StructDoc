import { Agent, AgentConfig, AgentResult, EnrichmentTask } from './types';
import { ProviderFactory } from './providers';

/**
 * Specialized agent for analyzing security requirements and authentication
 */
export class SecurityAgent extends Agent {
  name = 'SecurityAgent';
  provider: string;
  private aiProvider: any;

  constructor(config: AgentConfig) {
    super(config);
    // Use environment-configured provider or fallback to first available
    this.provider = process.env.SECURITY_AGENT_PROVIDER || 
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
    const { path, method, endpoint } = task;

    // Skip if no auth required
    if (!endpoint.auth) {
      return {}; // Return empty object instead of null
    }

    const systemPrompt = `You are a specialized agent for analyzing API security requirements.

Your task is to analyze an endpoint's authentication and provide clear guidance for developers.

Consider:
- Type of authentication required
- What permissions or roles might be needed
- Security best practices for this type of endpoint
- Token requirements and formats

Generate a concise security note that helps developers understand authentication requirements.

Respond with JSON in this exact format:
{
  "authNotes": "string or null"
}

If the endpoint requires no authentication, return null for authNotes.`;

    const userPrompt = `Analyze the security requirements for this API endpoint:

ENDPOINT: ${method.toUpperCase()} ${path}
HANDLER: ${endpoint.handler || 'unknown'}
AUTH TYPE: ${endpoint.auth || 'none'}
PATH CONTAINS SENSITIVE DATA: ${this.hasSensitivePathData(path)}

What authentication guidance should developers know about this endpoint?`;

    try {
      const response = await this.aiProvider.call(systemPrompt, userPrompt);
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      return {
        authNotes: parsed.authNotes,
      };
    } catch (error: any) {
      console.warn(`⚠️ SecurityAgent failed for ${method} ${path}:`, error.message);
      
      // Fallback to basic auth notes
      return this.generateFallbackAuthNotes(method, endpoint, path);
    }
  }

  private hasSensitivePathData(path: string): boolean {
    const sensitiveKeywords = ['user', 'employee', 'admin', 'internal', 'private', 'secure', 'auth'];
    return sensitiveKeywords.some(keyword => 
      path.toLowerCase().includes(keyword)
    );
  }

  private generateFallbackAuthNotes(method: string, endpoint: any, path: string): Partial<AgentResult> {
    if (!endpoint.auth) {
      return {}; // Return empty object instead of null
    }

    let authNotes = '';

    // Basic auth requirements
    authNotes = 'Requires authentication. Include a valid Bearer token in the Authorization header.';

    // Add path-specific security notes
    if (path.includes('/admin/')) {
      authNotes += ' Admin-level permissions required.';
    } else if (path.includes('/internal/')) {
      authNotes += ' Internal service access only - requires service-to-service authentication.';
    } else if (path.includes('/manager/') || path.includes('/hod/')) {
      authNotes += ' Management-level permissions required.';
    }

    // Method-specific security considerations
    switch (method.toLowerCase()) {
      case 'post':
      case 'put':
      case 'patch':
      case 'delete':
        authNotes += ' Write operations require elevated permissions.';
        break;
      case 'get':
        if (this.hasSensitivePathData(path)) {
          authNotes += ' Read access to sensitive data - ensure proper authorization.';
        }
        break;
    }

    return { authNotes };
  }
}