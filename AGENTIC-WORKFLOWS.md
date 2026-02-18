# 🤖 Agentic AI Workflows for StructDoc

StructDoc now features a sophisticated **Agentic AI Workflow system** that uses specialized AI agents to create comprehensive API documentation. Each agent focuses on a specific aspect of documentation generation, working together to produce high-quality results.

## 🎭 Agent Specialization

### 📝 Description Agent
- **Purpose**: Creates clear technical descriptions and practical use cases
- **Default Provider**: OpenAI (GPT-4o-mini)
- **Specialization**: Business logic understanding and developer-friendly explanations
- **Output**: `description`, `useCase`

### 🎯 Examples Agent  
- **Purpose**: Generates realistic request/response examples from schemas
- **Default Provider**: Anthropic Claude (better at structured data)
- **Specialization**: Schema-based example generation with realistic data
- **Output**: `requestExample`, `responseExample`

### 🚨 Error Scenarios Agent
- **Purpose**: Identifies potential error conditions and troubleshooting guidance
- **Default Provider**: OpenAI (excellent at edge case reasoning)
- **Specialization**: Error prediction and developer pain point identification
- **Output**: `errorScenarios[]`

### 🔒 Security Agent
- **Purpose**: Analyzes authentication requirements and security considerations
- **Default Provider**: Anthropic Claude (thorough security analysis)
- **Specialization**: Auth patterns and security best practices
- **Output**: `authNotes`

## 🚀 Quick Start

### 1. Configure AI Providers

Copy `.env.example` to `.env` and configure at least one AI provider:

```env
# OpenAI (Primary provider)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Claude (Great for examples & security)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Local Ollama (Privacy-first)
ENABLE_OLLAMA=true
OLLAMA_BASE_URL=http://localhost:11434
```

### 2. Test Agent Health

```bash
npm run agents:status
npm run agents:test
```

### 3. Use Agentic Enrichment

```bash
# Use multi-agent workflows
npm run enrich-agentic

# Or via CLI
npm run cli generate /path/to/nestjs/project --agentic
```

## ⚙️ Configuration

### Environment Variables

#### Provider Assignment
```env
# Assign different providers to different agents
DESCRIPTION_AGENT_PROVIDER=openai
EXAMPLES_AGENT_PROVIDER=anthropic  
ERRORS_AGENT_PROVIDER=openai
SECURITY_AGENT_PROVIDER=anthropic
```

#### Execution Settings
```env
AGENT_EXECUTION_MODE=parallel        # parallel (default) | sequential
AGENT_FALLBACK_STRATEGY=template     # template | skip | fallback
AI_REQUEST_TIMEOUT=30000             # Request timeout in ms
AI_MAX_RETRIES=3                     # Max retry attempts
```

### Custom Workflow Configuration

Create `agent-workflow.json` to customize agent behavior:

```json
{
  "agents": {
    "description": {
      "enabled": true,
      "provider": "openai",
      "timeout": 30000
    },
    "examples": {
      "enabled": true,
      "provider": "anthropic",
      "timeout": 45000
    }
  },
  "execution": {
    "parallel": true,
    "fallbackStrategy": "template"
  }
}
```

## 🎯 Agent Providers

### OpenAI
- **Best for**: Descriptions, error scenarios, general reasoning
- **Models**: GPT-4o-mini (default), GPT-4, GPT-3.5-turbo
- **Strengths**: Excellent reasoning, developer-friendly explanations

### Anthropic Claude
- **Best for**: Examples, security analysis, structured data
- **Models**: Claude-3-haiku (default), Claude-3-sonnet, Claude-3-opus  
- **Strengths**: Great at following schemas, detailed security analysis

### Local Ollama
- **Best for**: Privacy-conscious setups, cost control
- **Models**: llama2, codellama, mistral, many others
- **Strengths**: Complete privacy, no API costs, offline capable

### Custom Providers
- **Best for**: Enterprise or specialized AI services
- **Configuration**: Set `CUSTOM_AI_URL` and required headers

## 📊 Example Output

With agentic workflows, each endpoint gets comprehensive enrichment:

```json
{
  "originalPath": "/api/users/:id",
  "originalMethod": "GET",
  "description": "Retrieves detailed information for a specific user account",
  "useCase": "Use when you need to display user profile information or validate user existence",
  "requestExample": null,
  "responseExample": {
    "id": "usr_1a2b3c4d5e6f",
    "name": "John Doe", 
    "email": "john.doe@company.com",
    "role": "manager",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "authNotes": "Requires authentication. Users can only access their own profile unless they have admin privileges.",
  "errorScenarios": [
    "Unauthorized (401) - Invalid or missing authentication token",
    "Forbidden (403) - Trying to access another user's profile without admin rights",
    "Not found (404) - User ID does not exist or has been deactivated",
    "Server error (500) - Database connection issues or internal processing failure"
  ]
}
```

## 🔧 Advanced Usage

### Multi-Provider Fallback

Configure multiple providers for automatic fallback:

```env
OPENAI_API_KEY=your_primary_key
ANTHROPIC_API_KEY=your_fallback_key
OLLAMA_BASE_URL=http://localhost:11434  # Local fallback
```

When OpenAI hits quota limits, agents automatically switch to Claude, then Ollama.

### Agent Specialization Matrix

| Task | OpenAI | Claude | Ollama | Gemini |
|------|---------|--------|---------|---------|
| Descriptions | ✅ Excellent | ✅ Good | ⚠️ Basic | ✅ Good |
| Examples | ✅ Good | ✅ Excellent | ⚠️ Basic | ✅ Good |
| Error Scenarios | ✅ Excellent | ✅ Good | ⚠️ Basic | ✅ Good |
| Security Analysis | ✅ Good | ✅ Excellent | ⚠️ Basic | ✅ Good |

### Performance Optimization

```env
# Enable parallel execution (default)
AGENT_EXECUTION_MODE=parallel

# Reduce timeouts for faster processing
AI_REQUEST_TIMEOUT=15000

# Use faster models
AI_MODEL=gpt-3.5-turbo
CLAUDE_MODEL=claude-3-haiku-20240307
```

## 🔍 Debugging

### Agent Health Check
```bash
npm run agents:status
# Shows which providers are available and healthy
```

### Test with Sample Data  
```bash
npm run agents:test
# Tests all agents with a sample endpoint
```

### Verbose Logging
```bash
npm run cli generate /path/to/project --verbose --agentic
# See detailed agent processing logs
```

## 🚧 Troubleshooting

### No AI Providers Available
```
❌ No healthy agents available! Using fallback template-based enrichment.
```
**Solution**: Configure at least one AI provider in `.env`

### Quota Exceeded
```
⚠️ OpenAI quota exceeded, trying Claude...
```
**Solution**: Add multiple provider API keys for automatic fallback

### Agent Timeout
```
⚠️ DescriptionAgent failed: Request timeout
```
**Solution**: Increase `AI_REQUEST_TIMEOUT` or use faster models

## 📈 Roadmap

- **Phase 8**: Advanced agent orchestration with dynamic provider selection
- **Phase 9**: Custom agent development SDK
- **Phase 10**: Interactive documentation with real-time agent assistance

## 🤝 Contributing

Want to create custom agents? See the agent development guide in `/docs/agent-development.md`.

---

**Next**: Ready to enhance your documentation with AI agents? Run `npm run enrich-agentic` to get started!