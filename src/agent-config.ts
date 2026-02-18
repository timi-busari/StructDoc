import { AgentConfig, WorkflowConfig } from './agents/types';

/**
 * Load agent configuration from environment variables
 */
export function loadAgentConfig(): AgentConfig {
  const config: AgentConfig = {
    providers: {},
    defaultProvider: 'openai',
    fallbackProviders: ['anthropic', 'ollama'],
  };

  // OpenAI Configuration
  if (process.env.OPENAI_API_KEY) {
    config.providers.openai = {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      timeout: parseInt(process.env.AI_REQUEST_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.AI_MAX_RETRIES || '3'),
    };
  }

  // Anthropic Configuration
  if (process.env.ANTHROPIC_API_KEY) {
    config.providers.anthropic = {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
      timeout: parseInt(process.env.AI_REQUEST_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.AI_MAX_RETRIES || '3'),
    };
  }

  // Ollama Configuration (local)
  if (process.env.OLLAMA_BASE_URL || process.env.ENABLE_OLLAMA === 'true') {
    config.providers.ollama = {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama2',
      timeout: parseInt(process.env.AI_REQUEST_TIMEOUT || '60000'),
      maxRetries: parseInt(process.env.AI_MAX_RETRIES || '2'),
    };
  }

  // Gemini Configuration
  if (process.env.GEMINI_API_KEY) {
    config.providers.gemini = {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-pro',
      timeout: parseInt(process.env.AI_REQUEST_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.AI_MAX_RETRIES || '3'),
    };
  }

  // Custom Provider Configuration
  if (process.env.CUSTOM_AI_URL) {
    config.providers.custom = {
      baseUrl: process.env.CUSTOM_AI_URL,
      apiKey: process.env.CUSTOM_AI_API_KEY,
      model: process.env.CUSTOM_AI_MODEL || 'default',
      timeout: parseInt(process.env.AI_REQUEST_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.AI_MAX_RETRIES || '3'),
    };
  }

  return config;
}

/**
 * Default workflow configuration
 */
export function getDefaultWorkflowConfig(): WorkflowConfig {
  return {
    agents: {
      description: {
        enabled: true,
        provider: process.env.DESCRIPTION_AGENT_PROVIDER || 'openai',
        priority: 1,
        timeout: 30000,
      },
      examples: {
        enabled: true,
        provider: process.env.EXAMPLES_AGENT_PROVIDER || 'anthropic',
        priority: 2,
        timeout: 45000,
      },
      errors: {
        enabled: true,
        provider: process.env.ERRORS_AGENT_PROVIDER || 'openai',
        priority: 3,
        timeout: 30000,
      },
      security: {
        enabled: true,
        provider: process.env.SECURITY_AGENT_PROVIDER || 'anthropic',
        priority: 4,
        timeout: 20000,
      },
    },
    parallel: process.env.AGENT_EXECUTION_MODE !== 'sequential',
    fallbackStrategy: (process.env.AGENT_FALLBACK_STRATEGY as any) || 'template',
  };
}

/**
 * Load custom workflow configuration from file
 */
export function loadWorkflowConfig(configPath?: string): WorkflowConfig {
  if (configPath && require('fs').existsSync(configPath)) {
    try {
      const customConfig = JSON.parse(require('fs').readFileSync(configPath, 'utf-8'));
      return { ...getDefaultWorkflowConfig(), ...customConfig };
    } catch (error) {
      console.warn(`⚠️ Failed to load workflow config from ${configPath}, using defaults`);
    }
  }
  
  return getDefaultWorkflowConfig();
}