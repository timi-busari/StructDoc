import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
config();

// Initialize AI clients conditionally
let openai: OpenAI | null = null;
let anthropic: Anthropic | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

// Configuration
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';
const MAX_RETRIES = parseInt(process.env.AI_MAX_RETRIES || '3');
const REQUEST_TIMEOUT = parseInt(process.env.AI_REQUEST_TIMEOUT || '30000');

interface NormalizedMetadata {
  controllers: Array<{
    name: string;
    basePath: string;
    endpoints: Array<{
      method: string;
      path: string;
      handler: string;
      auth?: string | null;
      requestBody?: { $ref: string } | null;
      response?: { $ref: string } | null;
      params?: Array<{ name: string; in: string; type: string }>;
    }>;
  }>;
  components?: {
    schemas: Record<string, any>;
  };
}

interface EnrichedEndpoint {
  originalPath: string;
  originalMethod: string;
  description: string;
  useCase: string;
  requestExample?: any;
  responseExample?: any;
  authNotes?: string;
  errorScenarios: string[];
}

interface EnrichedMetadata extends NormalizedMetadata {
  enriched: {
    endpoints: EnrichedEndpoint[];
    generatedAt: string;
  };
}

/**
 * Create system prompt for the AI enrichment
 */
function createSystemPrompt(): string {
  return `You are a senior backend engineer and technical writer specializing in API documentation. Your role is to:

1. Generate clear, professional descriptions for API endpoints based on their metadata
2. Explain real-world use cases and practical applications
3. Create realistic request/response examples that match the provided schemas exactly
4. Note authentication requirements based on guards/middleware
5. List common error scenarios developers might encounter

CRITICAL RULES:
- Use ONLY the provided metadata and schemas - never invent fields, properties, or behavior
- Don't speculate about business logic not evident in the metadata
- Keep descriptions practical and developer-focused, not marketing-oriented
- Examples must match the exact schema structure provided
- Error scenarios should be realistic HTTP-level errors (400, 401, 403, 404, 500)
- If authentication guards are present, always note authentication requirements
- For enum types, use actual enum values if provided in the schema

RESPONSE FORMAT:
You must respond with valid JSON matching this exact structure:
{
  "originalPath": "string",
  "originalMethod": "string", 
  "description": "string",
  "useCase": "string",
  "requestExample": object | null,
  "responseExample": object | null,
  "authNotes": "string | null",
  "errorScenarios": ["string", "string", ...]
}

Focus on being helpful to developers who need to integrate with this API.`;
}

/**
 * Create endpoint-specific prompt with rich context
 */
function createEndpointPrompt(path: string, method: string, endpoint: any, schemas: Record<string, any>): string {
  // Extract schema information for better context
  const requestSchemaName = endpoint.requestBody?.$ref?.replace('#/components/schemas/', '');
  const responseSchemaName = endpoint.response?.$ref?.replace('#/components/schemas/', '');
  
  const requestSchema = requestSchemaName ? schemas[requestSchemaName] : null;
  const responseSchema = responseSchemaName ? schemas[responseSchemaName] : null;

  const contextData = {
    endpoint: {
      method: method.toUpperCase(),
      path: path,
      handler: endpoint.handler,
      hasAuth: !!endpoint.auth,
      authType: endpoint.auth || null,
      parameters: endpoint.params || [],
    },
    requestSchema: requestSchema ? {
      name: requestSchemaName,
      schema: requestSchema
    } : null,
    responseSchema: responseSchema ? {
      name: responseSchemaName, 
      schema: responseSchema
    } : null,
    availableSchemas: Object.keys(schemas).slice(0, 10) // Limit to avoid token limits
  };

  return `Analyze and enrich this API endpoint with developer-friendly documentation:

ENDPOINT DETAILS:
${JSON.stringify(contextData, null, 2)}

TASK:
Generate comprehensive documentation for this endpoint that helps developers understand:
1. What this endpoint does (clear, concise description)
2. When developers would use it (practical use case scenario)
3. What the request should look like (realistic example matching schema)
4. What response to expect (realistic example matching schema)
5. Authentication requirements (if guards are present)
6. Common errors they might encounter

IMPORTANT:
- Base your response ONLY on the provided metadata and schemas
- Use actual enum values where available in schemas
- Create realistic but generic example data (no real personal info)
- Match the exact JSON structure requested in the system prompt
- Path: "${path}", Method: "${method.toUpperCase()}"

Respond with valid JSON only.`;
}

/**
 * Call OpenAI API with retries and error handling
 */
async function callOpenAI(systemPrompt: string, userPrompt: string, retries = 0): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI client not initialized - API key missing');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1, // Low temperature for consistent, factual output
      max_tokens: 1000
    }, {
      timeout: REQUEST_TIMEOUT // Pass timeout in options object
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response content from OpenAI');
    }

    return response.trim();
  } catch (error: any) {
    // Check if it's a quota/rate limit error and try Claude if available
    if ((error.code === 'insufficient_quota' || error.status === 429) && anthropic) {
      console.warn(`⚠️ OpenAI quota exceeded, trying Claude...`);
      return callClaude(systemPrompt, userPrompt);
    }
    
    if (retries < MAX_RETRIES) {
      console.warn(`⚠️ OpenAI API call failed (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, error.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
      return callOpenAI(systemPrompt, userPrompt, retries + 1);
    }
    throw new Error(`OpenAI API call failed after ${MAX_RETRIES + 1} attempts: ${error.message}`);
  }
}

/**
 * Call Anthropic Claude API as fallback
 */
async function callClaude(systemPrompt: string, userPrompt: string, retries = 0): Promise<string> {
  if (!anthropic) {
    throw new Error('Claude client not initialized - ANTHROPIC_API_KEY not provided');
  }

  try {
    const completion = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      temperature: 0.1,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    const response = completion.content[0];
    if (!response || response.type !== 'text') {
      throw new Error('No text response content from Claude');
    }

    return response.text.trim();
  } catch (error: any) {
    if (retries < MAX_RETRIES) {
      console.warn(`⚠️ Claude API call failed (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, error.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
      return callClaude(systemPrompt, userPrompt, retries + 1);
    }
    throw new Error(`Claude API call failed after ${MAX_RETRIES + 1} attempts: ${error.message}`);
  }
}

/**
 * Parse and validate AI response with enhanced error handling
 */
function parseAIResponse(response: string, path: string, method: string): EnrichedEndpoint {
  try {
    // Clean up response (remove any markdown formatting and extra whitespace)
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Handle cases where AI wraps JSON in backticks or other formatting
    if (cleanResponse.startsWith('`') && cleanResponse.endsWith('`')) {
      cleanResponse = cleanResponse.slice(1, -1).trim();
    }
    
    // Try to find JSON content if it's embedded in text
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }
    
    console.log(`🔍 [DEBUG] Parsing AI response for ${method.toUpperCase()} ${path}`);
    console.log(`🔍 [DEBUG] Clean response length: ${cleanResponse.length} characters`);
    
    const parsed = JSON.parse(cleanResponse);
    
    // Validate required fields
    if (!parsed.description) {
      throw new Error('Missing description in AI response');
    }
    
    // Ensure correct path and method
    parsed.originalPath = path;
    parsed.originalMethod = method.toUpperCase();
    
    // Validate and fix data types
    if (!Array.isArray(parsed.errorScenarios)) {
      parsed.errorScenarios = Array.isArray(parsed.errorScenarios) ? parsed.errorScenarios : ['500 Internal Server Error - Unexpected server error'];
    }
    
    // Ensure useCase exists
    if (!parsed.useCase) {
      parsed.useCase = `Developers use this endpoint when they need to ${parsed.description.toLowerCase()} in their application.`;
    }
    
    console.log(`✅ [DEBUG] Successfully parsed AI response for ${method.toUpperCase()} ${path}`);
    return parsed as EnrichedEndpoint;
    
  } catch (error: any) {
    console.warn(`⚠️ Failed to parse AI response for ${method.toUpperCase()} ${path}:`, error.message);
    console.warn('📝 Raw response (first 500 chars):', response.substring(0, 500));
    console.warn('📝 Cleaned response:', response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim().substring(0, 200));
    
    // Fallback to template-based generation if AI parsing fails
    return generateFallbackEnrichment(path, method);
  }
}

/**
 * Fallback enrichment when AI fails
 */
function generateFallbackEnrichment(path: string, method: string): EnrichedEndpoint {
  const methodLower = method.toLowerCase();
  let description = '';
  
  switch (methodLower) {
    case 'get':
      description = path.includes(':') || path.includes('{')
        ? `Retrieve specific resource information from ${path}`
        : `List or search resources from ${path}`;
      break;
    case 'post':
      description = `Create a new resource at ${path}`;
      break;
    case 'put':
      description = `Update an existing resource at ${path}`;
      break;
    case 'patch':
      description = `Partially update a resource at ${path}`;
      break;
    case 'delete':
      description = `Remove a resource from ${path}`;
      break;
    default:
      description = `Perform ${method.toUpperCase()} operation on ${path}`;
  }

  return {
    originalPath: path,
    originalMethod: method.toUpperCase(),
    description,
    useCase: `Developers use this endpoint when they need to ${description.toLowerCase()} in their application.`,
    errorScenarios: ['500 Internal Server Error - Unexpected server error']
  };
}

/**
 * Real AI-powered endpoint enrichment with multiple provider support
 */
async function enrichEndpoint(path: string, method: string, endpoint: any, schemas: Record<string, any>): Promise<EnrichedEndpoint> {
  // Check if any AI provider is configured
  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.warn(`⚠️ No AI API keys configured, using fallback for ${method.toUpperCase()} ${path}`);
    return generateFallbackEnrichment(path, method);
  }

  try {
    console.log(`🤖 Enriching ${method.toUpperCase()} ${path} with AI...`);
    
    const systemPrompt = createSystemPrompt();
    const userPrompt = createEndpointPrompt(path, method, endpoint, schemas);
    
    let aiResponse: string;
    
    // Try OpenAI first, then Claude
    if (openai) {
      try {
        aiResponse = await callOpenAI(systemPrompt, userPrompt);
      } catch (error: any) {
        if (anthropic && (error.message.includes('quota') || error.message.includes('429'))) {
          console.warn(`⚠️ OpenAI quota exceeded, trying Claude...`);
          aiResponse = await callClaude(systemPrompt, userPrompt);
        } else {
          throw error;
        }
      }
    } else if (anthropic) {
      aiResponse = await callClaude(systemPrompt, userPrompt);
    } else {
      throw new Error('No AI providers available');
    }
    
    return parseAIResponse(aiResponse, path, method);
    
  } catch (error: any) {
    console.warn(`⚠️ AI enrichment failed for ${method.toUpperCase()} ${path}:`, error.message);
    console.warn('Falling back to template-based enrichment');
    return generateFallbackEnrichment(path, method);
  }
}

/**
 * Generate example data from JSON schema
 */
function generateExampleFromSchema(schema: any): any {
  if (schema.type === 'array' && schema.items) {
    // Handle array schemas
    if (schema.items.$ref) {
      // For array of references, we can't resolve the reference here
      // but we can create a placeholder
      return [{ "id": "sample_id", "placeholder": "array_item" }];
    } else {
      return [generateExampleFromSchema(schema.items)];
    }
  }
  
  if (!schema.properties) return {};

  const example: any = {};
  for (const [key, prop] of Object.entries(schema.properties as Record<string, any>)) {
    switch (prop.type) {
      case 'string':
        if (key.toLowerCase().includes('email')) {
          example[key] = 'user@example.com';
        } else if (key.toLowerCase().includes('id')) {
          example[key] = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
        } else if (key.toLowerCase().includes('currency')) {
          example[key] = 'USD';
        } else {
          example[key] = `sample_${key}`;
        }
        break;
      case 'number':
        if (key.toLowerCase().includes('amount')) {
          example[key] = 100.50;
        } else {
          example[key] = 42;
        }
        break;
      case 'integer':
        example[key] = 123;
        break;
      case 'boolean':
        example[key] = true;
        break;
      case 'array':
        example[key] = prop.items ? [generateExampleFromSchema(prop.items)] : [];
        break;
      case 'object':
        example[key] = prop.properties ? generateExampleFromSchema(prop) : {};
        break;
      default:
        example[key] = null;
    }
  }
  return example;
}

/**
 * Main enrichment function with proper error handling and progress tracking
 */
async function enrichMetadata(inputFile: string, outputFile: string): Promise<void> {
  try {
    console.log(`🔍 Reading normalized metadata from ${inputFile}...`);
    
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    // Validate environment setup
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasClaude = !!process.env.ANTHROPIC_API_KEY;
    
    if (!hasOpenAI && !hasClaude) {
      console.error('❌ NO AI API KEYS CONFIGURED!');
      console.error('   This is why you\'re getting template-based descriptions instead of AI-generated ones.');
      console.error('');
      console.error('   To fix this:');
      console.error('   1. Copy .env.example to .env: cp .env.example .env');
      console.error('   2. Edit .env and add your OpenAI API key: OPENAI_API_KEY=your_key_here');
      console.error('   3. Or add Anthropic API key: ANTHROPIC_API_KEY=your_key_here');
      console.error('   4. Re-run the generation process');
      console.error('');
      console.error('   For now, using fallback template-based enrichment...');
    } else {
      if (hasOpenAI) console.log('✅ OpenAI API configured for AI-powered enrichment');
      if (hasClaude) console.log('✅ Claude API configured for AI-powered enrichment');
    }

    const normalizedData = JSON.parse(fs.readFileSync(inputFile, 'utf-8')) as NormalizedMetadata;
    
    // Count endpoints across all controllers
    const totalEndpoints = normalizedData.controllers.reduce((sum, controller) => sum + controller.endpoints.length, 0);
    console.log(`📊 Found ${totalEndpoints} endpoints to enrich across ${normalizedData.controllers.length} controllers...`);

    const enrichedEndpoints: EnrichedEndpoint[] = [];
    const availableSchemas = normalizedData.components?.schemas || {};
    let successCount = 0;
    let fallbackCount = 0;

    // Process each controller and its endpoints
    for (const controller of normalizedData.controllers) {
      console.log(`\n🏗️ Processing controller: ${controller.name}`);
      
      for (const endpoint of controller.endpoints) {
        const fullPath = endpoint.path; // Path already normalized in previous phases
        
        try {
          const enriched = await enrichEndpoint(fullPath, endpoint.method, endpoint, availableSchemas);
          enrichedEndpoints.push(enriched);
          
          if ((hasOpenAI || hasClaude) && !enriched.description?.includes('Developers use this endpoint')) {
            successCount++;
            process.stdout.write('✅ ');
          } else {
            fallbackCount++;
            process.stdout.write('⚠️ ');
          }
          
          // Small delay to avoid rate limiting
          if (hasOpenAI || hasClaude) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          console.warn(`\n❌ Failed to enrich ${endpoint.method.toUpperCase()} ${fullPath}:`, error);
          // Add fallback enrichment even if processing fails completely
          enrichedEndpoints.push(generateFallbackEnrichment(fullPath, endpoint.method));
          fallbackCount++;
        }
      }
    }

    console.log(`\n\n📊 Enrichment Summary:`);
    console.log(`   ✅ AI-powered: ${successCount} endpoints`);
    console.log(`   ⚠️ Fallback: ${fallbackCount} endpoints`);
    console.log(`   📝 Total processed: ${enrichedEndpoints.length} endpoints`);

    // Create enriched metadata
    const enrichedMetadata: EnrichedMetadata = {
      ...normalizedData,
      enriched: {
        endpoints: enrichedEndpoints,
        generatedAt: new Date().toISOString()
      }
    };

    // Write output
    fs.writeFileSync(outputFile, JSON.stringify(enrichedMetadata, null, 2));
    
    console.log(`\n✅ Enriched metadata written to ${outputFile}`);
    
    if (successCount > 0) {
      console.log(`🎉 Successfully enriched ${successCount} endpoints with AI-generated descriptions!`);
    }
    
    if (fallbackCount > 0 && !hasOpenAI && !hasClaude) {
      console.log(`\n💡 To enable AI-powered enrichment:`);
      console.log(`   1. Copy .env.example to .env`);
      console.log(`   2. Add your OpenAI API key (OPENAI_API_KEY) or Anthropic API key (ANTHROPIC_API_KEY) to .env`);
      console.log(`   3. Run: npm install`);
      console.log(`   4. Re-run the enrichment process`);
    }
    
  } catch (error) {
    console.error('❌ Enrichment failed:', error);
    process.exit(1);
  }
}

// Main execution
const inputFile = process.argv[2] || './normalized-metadata.json';
const outputFile = process.argv[3] || './enriched-metadata.json';

enrichMetadata(inputFile, outputFile);