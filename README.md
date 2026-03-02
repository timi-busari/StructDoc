# StructDoc 🎭

**AI-Powered API Documentation Generator for NestJS Applications**

Transform your NestJS codebase into comprehensive, production-ready API documentation using specialized AI agents. StructDoc automatically extracts, analyzes, and enriches your API metadata to generate both OpenAPI specifications and human-readable documentation.

## ✨ Features

### 🎭 **AgentOrchestrator System**
- **4 Specialized AI Agents** working in parallel for comprehensive analysis
- **DescriptionAgent**: Creates clear technical descriptions and practical use cases
- **ExampleAgent**: Generates realistic request/response examples based on schemas
- **ErrorScenarioAgent**: Identifies comprehensive error scenarios and troubleshooting  
- **SecurityAgent**: Analyzes authentication requirements and security considerations

### 🚀 **Multi-Provider AI Support**
- **OpenAI** (GPT-4, GPT-3.5-turbo)
- **Anthropic Claude** (Claude-3 Haiku, Sonnet, Opus)
- **Local Ollama** (Privacy-first, runs offline)
- **Google Gemini** (Gemini Pro)
- **Automatic fallbacks** and health monitoring

### 📊 **High-Quality Output**
- **100% AI enrichment success rate** vs template fallbacks
- **Parallel processing** for 4x faster generation
- **Realistic examples** with proper data types and validation
- **Comprehensive error scenarios** beyond generic 500 errors
- **Authentication analysis** from guards and decorators

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- NestJS project with controllers
- At least one AI provider API key (OpenAI, Anthropic, or local Ollama)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd StructDoc

# Install dependencies
npm install

# Interactive setup (recommended)
npm run cli:init
# OR manually set up environment
cp .env.example .env
# Edit .env with your AI API keys
```

### Basic Usage

```bash
# 🚀 Interactive setup wizard (first time)
npm run cli:init

# 📝 Generate documentation for your NestJS project
npm run cli -- generate ./path/to/nestjs-project --output ./docs

# 👀 Watch mode for development (auto-regenerates on changes)
npm run cli:watch ./path/to/nestjs-project

# 🌐 Preview generated documentation
npm run cli:serve --port 3000

# ⚙️ Validate configuration
npm run cli:validate
```

## 🔧 Configuration

### Environment Setup

Create a `.env` file based on `.env.example`:

```bash
# OpenAI (Recommended for descriptions and errors)
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini

# Anthropic Claude (Excellent for examples and security)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Local Ollama (Privacy-first, no API costs)
ENABLE_OLLAMA=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b

# Agent Provider Assignment
DESCRIPTION_AGENT_PROVIDER=openai
EXAMPLES_AGENT_PROVIDER=anthropic  
ERRORS_AGENT_PROVIDER=openai
SECURITY_AGENT_PROVIDER=anthropic

# Workflow Configuration
AI_REQUEST_TIMEOUT=30000
AI_MAX_RETRIES=3
AGENT_EXECUTION_MODE=parallel
AGENT_FALLBACK_STRATEGY=template
```

### Supported Project Structures

StructDoc works with standard NestJS applications:

```
your-nestjs-app/
├── src/
│   ├── controllers/          # @Controller() classes
│   │   ├── user.controller.ts
│   │   └── wallet.controller.ts
│   ├── dto/                  # Data transfer objects
│   └── guards/               # Authentication guards
├── package.json              # Must include @nestjs dependencies
└── tsconfig.json
```

## 📖 Usage Examples

### Interactive Setup

```bash
# First-time setup with guided wizard
npm run cli:init
```

### Generate Documentation

```bash
# Basic generation (uses AgentOrchestrator by default)
npm run cli -- generate ./examples/sample-app

# Specify custom output directory
npm run cli -- generate ./my-nestjs-app --output ./api-docs

# Enable verbose logging to see agent activity
npm run cli -- generate ./my-nestjs-app --verbose

# Use simple enrichment (not recommended)
npm run cli -- generate ./my-nestjs-app --simple
```

### Development Workflow

```bash
# Watch mode - automatically regenerates on file changes
npm run cli:watch ./my-nestjs-app

# Preview documentation in browser
npm run cli:serve --port 3000

# Validate configuration
npm run cli:validate

# Diagnose configuration issues
npm run cli -- config doctor
```

### Agent Management

```bash
# Check which AI providers are available
npm run agents:status

# Test all agents with sample data
npm run agents:test

# Test individual agents
npm run agents:test-individual
```

### CLI Command Reference

```bash
# 🚀 Setup & Configuration
structdoc init                    # Interactive setup wizard
structdoc config validate        # Validate current configuration  
structdoc config doctor          # Diagnose configuration issues

# 📝 Documentation Generation
structdoc generate [path]        # Generate API documentation
structdoc generate --simple      # Use simple enrichment mode
structdoc generate --verbose     # Enable detailed logging

# 👀 Development Workflow  
structdoc watch [path]           # Auto-regenerate on file changes
structdoc serve                  # Preview documentation server
structdoc serve --port 3000      # Serve on custom port

# 🤖 Agent Management
structdoc agents status          # Check AI provider health
structdoc agents test            # Test all agents
structdoc agents test-individual # Test agents separately
```

## 🏗️ How It Works

StructDoc uses a 4-stage pipeline:

### 1. **Extract** (`extract-metadata.ts`)
```bash
npm run extract ./path/to/nestjs-project
```
- Parses TypeScript controllers using `ts-morph`
- Extracts endpoints, DTOs, guards, and decorators
- Outputs: `metadata.json`

### 2. **Normalize** (`normalize-metadata.ts`)  
```bash
npm run normalize metadata.json ./path/to/nestjs-project
```
- Converts extracted data to OpenAPI-compatible structure
- Resolves DTO imports and type references
- Outputs: `normalized-metadata.json`

### 3. **Enrich** (`enrich-metadata-agentic.ts`)
```bash
npm run enrich-agentic
```
- **AgentOrchestrator** dispatches 4 specialized agents in parallel
- AI-powered analysis generates descriptions, examples, errors, security notes
- Fallback to templates if AI providers unavailable
- Outputs: `enriched-metadata.json`

### 4. **Generate** (`generate-docs.ts`)
```bash
npm run generate enriched-metadata.json ./output/openapi.json ./output/api-docs.md
```
- Creates OpenAPI 3.1 specification
- Generates human-readable Markdown documentation
- Outputs: `openapi.json`, `api-docs.md`

## 📋 Example Output

### Generated API Documentation

**Endpoint**: `POST /users`

**Description**: Creates a new user account in the system with email validation and duplicate checking.

**Use Case**: Register new customers during account creation flow, ensuring unique email addresses and proper profile initialization.

**Request Example**:
```json
{
  "email": "john.doe@example.com", 
  "name": "John Doe"
}
```

**Response Example**:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "john.doe@example.com",
  "name": "John Doe"
}
```

**Error Scenarios**:
- `400 Bad Request` - Invalid email format or missing required fields
- `409 Conflict` - Email address already registered  
- `429 Too Many Requests` - Rate limit exceeded, retry after delay
- `500 Internal Server Error` - Database connection or validation service failure

**Authentication**: Required (Bearer Token)

## 🎛️ Advanced Configuration

### Agent Specialization

Assign different AI providers to different agents based on their strengths:

```bash
# Use OpenAI for descriptions (good at technical writing)
DESCRIPTION_AGENT_PROVIDER=openai

# Use Claude for examples (excellent at structured data)  
EXAMPLES_AGENT_PROVIDER=anthropic

# Use local Ollama for privacy-sensitive environments
ERRORS_AGENT_PROVIDER=ollama
SECURITY_AGENT_PROVIDER=ollama
```

### Performance Tuning

```bash
# Parallel execution (default, fastest)
AGENT_EXECUTION_MODE=parallel

# Sequential execution (more conservative)
AGENT_EXECUTION_MODE=sequential  

# Timeout and retry configuration
AI_REQUEST_TIMEOUT=45000  # 45 seconds
AI_MAX_RETRIES=2
```

## 🧪 Testing

```bash
# Run full test suite
npm test

# Test the complete pipeline
npm run validate ./examples/sample-app

# Test individual components
npm run extract ./examples/sample-app
npm run normalize metadata.json ./examples/sample-app  
npm run enrich-agentic
npm run generate enriched-metadata.json ./docs/openapi.json ./docs/api-docs.md
```

## 🔍 Troubleshooting

### Common Issues

**"Command not found: structdoc"**
- Run `npm run build` to compile TypeScript
- Use `npm run cli -- <command>` during development

**"No AI API keys configured"**
- Run `structdoc init` for interactive setup
- Add at least one provider to your `.env` file
- For local setup, install and run Ollama with `ENABLE_OLLAMA=true`

**"Failed to parse AI response"**  
- Check API key validity and rate limits using `structdoc config validate`
- Try different AI model (e.g., switch from gpt-4 to gpt-3.5-turbo)
- Enable fallback with `AGENT_FALLBACK_STRATEGY=template`

**"Project does not appear to be NestJS"**
- Ensure `package.json` includes `@nestjs/core` and `@nestjs/common`
- Verify controllers use `@Controller()` decorators
- Check TypeScript compilation succeeds

**AgentOrchestrator Issues**
```bash
# Comprehensive diagnostics
structdoc config doctor

# Check agent health
structdoc agents status

# Test connectivity  
structdoc agents test

# Review logs with verbose mode
structdoc generate ./project --verbose
```

**Development Issues**
```bash
# Build project (for binary usage)
npm run build

# Watch mode not detecting changes
structdoc watch ./project --verbose  # Check file patterns

# Preview server not starting
structdoc config validate            # Check configuration first
```

## 📊 Performance Metrics

**Sample Performance** (7 endpoints with local Ollama):
- **Processing Time**: 87 seconds  
- **Success Rate**: 100% (7/7 endpoints enriched)
- **Fallback Rate**: 0% (no template fallbacks needed)
- **Parallel Agent Execution**: 4 agents working simultaneously

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`  
3. Make your changes and test with `npm test`
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS** community for the excellent framework
- **OpenAI**, **Anthropic**, and **Ollama** for AI capabilities
- **ts-morph** for TypeScript parsing
- All contributors who helped shape this project

---
**Built with ❤️ for the NestJS community**

Generate professional API documentation in minutes, not hours. Let AI handle the tedious work while you focus on building great applications.