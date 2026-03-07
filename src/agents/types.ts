/**
 * Core types for the Agentic Workflow system
 */

/** Swagger/OpenAPI hints extracted directly from @nestjs/swagger decorators */
export interface SwaggerMetadata {
  /** Value of @ApiOperation({ summary }) */
  summary?: string;
  /** Value of @ApiOperation({ description }) */
  description?: string;
  /** Values of @ApiTags() on the controller class */
  tags?: string[];
  /** One entry per @ApiResponse() decorator on the method */
  responses?: Array<{ status: number; description: string }>;
}

/** Shape of a single controller endpoint produced by the extraction/normalization phase */
export interface NormalizedEndpoint {
  method: string;
  path: string;
  handler: string;
  auth?: string | null;
  requestBody?: { $ref: string } | null;
  response?: { $ref: string } | null;
  params?: Array<{ name: string; in: string; type: string }>;
  /** Populated when the source code contains @nestjs/swagger decorators */
  swagger?: SwaggerMetadata;
}

/** OpenAPI-compatible JSON Schema object */
export interface SchemaObject {
  type?: string;
  format?: string;
  description?: string;
  enum?: string[];
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  $ref?: string;
  nullable?: boolean;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  additionalProperties?: boolean | SchemaObject;
}

/** A freeform JSON payload used for request/response examples */
export type ExamplePayload = Record<string, unknown>;

/** Per-agent status returned by AgentOrchestrator.getAgentStatus() */
export interface AgentStatus {
  name: string;
  provider: string;
  healthy: boolean;
}

export interface EnrichmentTask {
  path: string;
  method: string;
  endpoint: NormalizedEndpoint;
  schemas: Record<string, SchemaObject>;
}

export interface AgentResult {
  originalPath: string;
  originalMethod: string;
  description?: string;
  useCase?: string;
  requestExample?: ExamplePayload;
  responseExample?: ExamplePayload;
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