/**
 * Core types for the Agentic Workflow system
 */

export interface EnrichmentTask {
  path: string;
  method: string;
  endpoint: any;
  schemas: Record<string, any>;
}

export interface AgentResult {
  originalPath: string;
  originalMethod: string;
  description?: string;
  useCase?: string;
  requestExample?: any;
  responseExample?: any;
  authNotes?: string;
  errorScenarios?: string[];
}

export interface AgentConfig {
  providers: {
    openai?: {
      apiKey: string;
      model: string;
      timeout: number;
      maxRetries: number;
    };
    anthropic?: {
      apiKey: string;
      model: string;
      timeout: number;
      maxRetries: number;
    };
    gemini?: {
      apiKey: string;
      model: string;
      timeout: number;
      maxRetries: number;
    };
    ollama?: {
      baseUrl: string;
      model: string;
      timeout: number;
      maxRetries: number;
    };
    custom?: {
      baseUrl: string;
      apiKey?: string;
      model: string;
      timeout: number;
      maxRetries: number;
    };
  };
  defaultProvider: string;
  fallbackProviders: string[];
}

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  call(systemPrompt: string, userPrompt: string): Promise<string>;
  isHealthy(): Promise<boolean>;
}

export abstract class Agent {
  abstract name: string;
  abstract provider: string;

  constructor(protected config: AgentConfig) {}

  abstract process(task: EnrichmentTask): Promise<Partial<AgentResult>>;
  abstract isHealthy(): boolean;
  abstract setProvider(provider: string): void;
}

export interface WorkflowConfig {
  agents: {
    [agentType: string]: {
      enabled: boolean;
      provider: string;
      priority: number;
      timeout: number;
    };
  };
  parallel: boolean;
  fallbackStrategy: 'skip' | 'fallback' | 'template';
}