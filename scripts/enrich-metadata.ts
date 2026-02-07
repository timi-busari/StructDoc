import fs from 'fs';
import path from 'path';

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
  return `You are a senior backend engineer writing API documentation. Your role is to:

1. Generate clear, professional descriptions for API endpoints
2. Explain real-world use cases and practical applications
3. Create realistic request/response examples
4. Note authentication requirements where applicable
5. List common error scenarios

STRICT RULES:
- Use ONLY the provided metadata - never invent fields or behavior
- Don't speculate about business logic not evident in the metadata
- Keep descriptions practical and developer-focused
- Examples must match the schema structure exactly
- Error scenarios should be HTTP-level (400, 401, 403, 404, 500)

Output format: Valid JSON matching the EnrichedEndpoint interface.`;
}

/**
 * Create endpoint-specific prompt
 */
function createEndpointPrompt(path: string, method: string, endpoint: any, schemas: Record<string, any>): string {
  const metadataStr = JSON.stringify({
    path,
    method: method.toUpperCase(),
    endpoint,
    availableSchemas: Object.keys(schemas)
  }, null, 2);

  return `Enrich this API endpoint with human-friendly documentation:

${metadataStr}

Available DTOs for reference:
${JSON.stringify(schemas, null, 2)}

Generate JSON output with these fields:
- originalPath: "${path}"
- originalMethod: "${method.toUpperCase()}"
- description: Brief, clear description of what this endpoint does
- useCase: Real-world scenario when developers would use this
- requestExample: Sample request body (if applicable, matching schema)
- responseExample: Sample response body (matching schema structure)
- authNotes: Authentication notes if guards are present (optional)
- errorScenarios: Array of common HTTP error scenarios

Respond with valid JSON only.`;
}

/**
 * Mock AI enrichment function (would integrate with actual AI service)
 * For now, generates structured enrichment based on endpoint metadata
 */
async function enrichEndpoint(path: string, method: string, endpoint: any, schemas: Record<string, any>): Promise<EnrichedEndpoint> {
  // In a real implementation, this would call an AI service
  // For now, we'll generate reasonable enrichment based on the metadata
  
  const hasGuards = endpoint.auth && endpoint.auth.includes('Guard');
  const hasRequestBody = !!endpoint.requestBody;
  const operation = endpoint.operationId || `${method}${path.replace(/[^\w]/g, '')}`;
  
  // Generate description based on HTTP method and path
  let description = '';
  switch (method.toLowerCase()) {
    case 'get':
      description = path.includes('{') 
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

  // Generate use case
  const useCase = `Developers use this endpoint when they need to ${description.toLowerCase().replace(/^retrieve/, 'get').replace(/^list/, 'fetch')} in their application.`;

  // Generate examples based on schemas
  let requestExample = undefined;
  let responseExample = undefined;

  if (hasRequestBody && endpoint.requestBody?.$ref) {
    const schemaName = endpoint.requestBody.$ref.replace('#/components/schemas/', '');
    const schema = schemas[schemaName];
    if (schema && schema.properties) {
      requestExample = generateExampleFromSchema(schema);
    }
  }

  // Generate response example
  if (endpoint.response?.$ref) {
    const schemaName = endpoint.response.$ref.replace('#/components/schemas/', '');
    const schema = schemas[schemaName];
    if (schema) {
      responseExample = generateExampleFromSchema(schema);
    }
  }

  // Generate auth notes
  const authNotes = hasGuards ? 'This endpoint requires authentication. Ensure valid authorization headers are included.' : undefined;

  // Generate error scenarios
  const errorScenarios = [
    hasGuards ? '401 Unauthorized - Invalid or missing authentication' : null,
    hasRequestBody ? '400 Bad Request - Invalid request body or parameters' : null,
    path.includes('{') ? '404 Not Found - Resource does not exist' : null,
    '500 Internal Server Error - Unexpected server error'
  ].filter(Boolean) as string[];

  return {
    originalPath: path,
    originalMethod: method.toUpperCase(),
    description,
    useCase,
    requestExample,
    responseExample,
    authNotes,
    errorScenarios
  };
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
 * Main enrichment function
 */
async function enrichMetadata(inputFile: string, outputFile: string): Promise<void> {
  try {
    console.log(`🔍 Reading normalized metadata from ${inputFile}...`);
    
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    const normalizedData = JSON.parse(fs.readFileSync(inputFile, 'utf-8')) as NormalizedMetadata;
    
    // Count endpoints across all controllers
    const totalEndpoints = normalizedData.controllers.reduce((sum, controller) => sum + controller.endpoints.length, 0);
    console.log(`📊 Found ${totalEndpoints} endpoints to enrich across ${normalizedData.controllers.length} controllers...`);

    const enrichedEndpoints: EnrichedEndpoint[] = [];
    const availableSchemas = normalizedData.components?.schemas || {};

    // Process each controller and its endpoints
    for (const controller of normalizedData.controllers) {
      for (const endpoint of controller.endpoints) {
        const fullPath = `/${controller.basePath}${endpoint.path}`.replace(/\/+/g, '/');
        console.log(`🤖 Enriching ${endpoint.method.toUpperCase()} ${fullPath}...`);
        
        try {
          const enriched = await enrichEndpoint(fullPath, endpoint.method, endpoint, availableSchemas);
          enrichedEndpoints.push(enriched);
        } catch (error) {
          console.warn(`⚠️ Failed to enrich ${endpoint.method.toUpperCase()} ${fullPath}:`, error);
        }
      }
    }

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
    
    console.log(`✅ Enriched metadata written to ${outputFile}`);
    console.log(`📝 Processed ${enrichedEndpoints.length} endpoints with AI-enhanced descriptions`);
    
  } catch (error) {
    console.error('❌ Enrichment failed:', error);
    process.exit(1);
  }
}

// Main execution
const inputFile = process.argv[2] || './normalized-metadata.json';
const outputFile = process.argv[3] || './enriched-metadata.json';

enrichMetadata(inputFile, outputFile);