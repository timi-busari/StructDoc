import fs from 'fs';
import path from 'path';

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

interface EnrichedMetadata {
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
  enriched: {
    endpoints: EnrichedEndpoint[];
    generatedAt: string;
  };
}

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, Record<string, any>>;
  components: {
    schemas: Record<string, any>;
    securitySchemes?: Record<string, any>;
  };
  security?: Array<Record<string, string[]>>;
}

/**
 * Convert parameter type string to OpenAPI type
 */
function convertParamType(typeStr: string): any {
  switch (typeStr) {
    case 'number':
      return { type: 'number' };
    case 'string':
      return { type: 'string' };
    case 'boolean':
      return { type: 'boolean' };
    default:
      return { type: 'string' };
  }
}

/**
 * Generate OpenAPI 3.1 specification from enriched metadata
 */
function generateOpenAPI(enrichedData: EnrichedMetadata): OpenAPISpec {
  const openapi: OpenAPISpec = {
    openapi: '3.0.3',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Auto-generated API documentation from NestJS codebase'
    },
    paths: {},
    components: {
      schemas: enrichedData.components?.schemas || {},
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: []
  };

  // Process each controller
  for (const controller of enrichedData.controllers) {
    for (const endpoint of controller.endpoints) {
      // Use the endpoint path directly since it already includes the full path
      const fullPath = endpoint.path || '/';
      const method = endpoint.method.toLowerCase();
      
      // Find enriched data for this endpoint
      const enriched = enrichedData.enriched.endpoints.find(
        e => e.originalPath === fullPath && e.originalMethod.toUpperCase() === endpoint.method.toUpperCase()
      );

      // Initialize path object if needed
      if (!openapi.paths[fullPath]) {
        openapi.paths[fullPath] = {};
      }

      // Create OpenAPI operation
      const operation: any = {
        operationId: `${controller.name}_${endpoint.handler}`,
        summary: enriched?.description || `${endpoint.method.toUpperCase()} ${fullPath}`,
        description: enriched?.useCase || `Execute ${endpoint.handler} operation`,
        tags: [controller.name]
      };

      // Add parameters
      if (endpoint.params && endpoint.params.length > 0) {
        operation.parameters = endpoint.params.map(param => ({
          name: param.name,
          in: param.in,
          required: param.in === 'path',
          schema: convertParamType(param.type)
        }));
      }

      // Add request body
      if (endpoint.requestBody && endpoint.requestBody.$ref) {
        operation.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: endpoint.requestBody
            }
          }
        };
        
        if (enriched?.requestExample) {
          operation.requestBody.content['application/json'].example = enriched.requestExample;
        }
      }

      // Add responses
      operation.responses = {
        '200': {
          description: 'Successful response'
        }
      };

      if (endpoint.response && endpoint.response.$ref) {
        operation.responses['200'].content = {
          'application/json': {
            schema: endpoint.response
          }
        };
        
        if (enriched?.responseExample) {
          operation.responses['200'].content['application/json'].example = enriched.responseExample;
        }
      }

      // Add error responses from enriched data
      if (enriched?.errorScenarios) {
        for (const error of enriched.errorScenarios) {
          if (error.includes('400')) {
            operation.responses['400'] = { description: 'Bad Request' };
          }
          if (error.includes('401')) {
            operation.responses['401'] = { description: 'Unauthorized' };
          }
          if (error.includes('404')) {
            operation.responses['404'] = { description: 'Not Found' };
          }
          if (error.includes('500')) {
            operation.responses['500'] = { description: 'Internal Server Error' };
          }
        }
      }

      // Add security if endpoint has authentication
      if (endpoint.auth && endpoint.auth.includes('Guard')) {
        operation.security = [{ BearerAuth: [] }];
      }

      openapi.paths[fullPath][method] = operation;
    }
  }

  return openapi;
}

/**
 * Generate Markdown documentation from enriched metadata
 */
function generateMarkdown(enrichedData: EnrichedMetadata): string {
  const lines: string[] = [];
  
  lines.push('# API Documentation');
  lines.push('');
  lines.push('Auto-generated API documentation from NestJS codebase.');
  lines.push('');
  lines.push(`*Generated on: ${new Date(enrichedData.enriched.generatedAt).toLocaleString()}*`);
  lines.push('');

  // Table of contents
  lines.push('## Table of Contents');
  lines.push('');
  for (const controller of enrichedData.controllers) {
    lines.push(`- [${controller.name}](#${controller.name.toLowerCase()})`);
    for (const endpoint of controller.endpoints) {
      const fullPath = endpoint.path || '/';
      const anchor = `${endpoint.method.toLowerCase()}-${fullPath.replace(/[^\w]/g, '-').toLowerCase()}`;
      lines.push(`  - [${endpoint.method.toUpperCase()} ${fullPath}](#${anchor})`);
    }
  }
  lines.push('');

  // Controller sections
  for (const controller of enrichedData.controllers) {
    lines.push(`## ${controller.name}`);
    lines.push('');

    for (const endpoint of controller.endpoints) {
      const fullPath = endpoint.path || '/';
      const enriched = enrichedData.enriched.endpoints.find(
        e => e.originalPath === fullPath && e.originalMethod.toUpperCase() === endpoint.method.toUpperCase()
      );

      lines.push(`### ${endpoint.method.toUpperCase()} ${fullPath}`);
      lines.push('');

      // Description and use case
      if (enriched) {
        lines.push(`**Description:** ${enriched.description}`);
        lines.push('');
        lines.push(`**Use Case:** ${enriched.useCase}`);
        lines.push('');
      }

      // Authentication
      if (endpoint.auth && endpoint.auth.includes('Guard')) {
        lines.push('**Authentication:** Required (Bearer Token)');
        lines.push('');
      }

      // Parameters
      if (endpoint.params && endpoint.params.length > 0) {
        lines.push('**Parameters:**');
        lines.push('');
        for (const param of endpoint.params) {
          lines.push(`- **${param.name}** (${param.in}): ${param.type}`);
        }
        lines.push('');
      }

      // Request body
      if (endpoint.requestBody && enriched?.requestExample) {
        lines.push('**Request Body:**');
        lines.push('');
        lines.push('```json');
        lines.push(JSON.stringify(enriched.requestExample, null, 2));
        lines.push('```');
        lines.push('');
      }

      // Response
      if (endpoint.response && enriched?.responseExample) {
        lines.push('**Response:**');
        lines.push('');
        lines.push('```json');
        lines.push(JSON.stringify(enriched.responseExample, null, 2));
        lines.push('```');
        lines.push('');
      }

      // Error scenarios
      if (enriched?.errorScenarios && enriched.errorScenarios.length > 0) {
        lines.push('**Error Scenarios:**');
        lines.push('');
        for (const error of enriched.errorScenarios) {
          lines.push(`- ${error}`);
        }
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    }
  }

  // Schemas section
  if (enrichedData.components?.schemas && Object.keys(enrichedData.components.schemas).length > 0) {
    lines.push('## Schemas');
    lines.push('');
    
    for (const [schemaName, schema] of Object.entries(enrichedData.components.schemas)) {
      lines.push(`### ${schemaName}`);
      lines.push('');
      lines.push('```json');
      lines.push(JSON.stringify(schema, null, 2));
      lines.push('```');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Main documentation generation function
 */
async function generateDocs(inputFile: string, openapiFile: string, markdownFile: string): Promise<void> {
  try {
    console.log(`📖 Reading enriched metadata from ${inputFile}...`);
    
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    const enrichedData = JSON.parse(fs.readFileSync(inputFile, 'utf-8')) as EnrichedMetadata;
    
    const totalEndpoints = enrichedData.controllers.reduce((sum, controller) => sum + controller.endpoints.length, 0);
    console.log(`📊 Generating docs for ${totalEndpoints} endpoints across ${enrichedData.controllers.length} controllers...`);

    // Generate OpenAPI specification
    console.log(`🔧 Generating OpenAPI 3.1 specification...`);
    const openapi = generateOpenAPI(enrichedData);
    fs.writeFileSync(openapiFile, JSON.stringify(openapi, null, 2));
    console.log(`✅ OpenAPI specification written to ${openapiFile}`);

    // Generate Markdown documentation
    console.log(`📝 Generating Markdown documentation...`);
    const markdown = generateMarkdown(enrichedData);
    fs.writeFileSync(markdownFile, markdown);
    console.log(`✅ Markdown documentation written to ${markdownFile}`);

    // Summary
    console.log('');
    console.log('📋 Generation Summary:');
    console.log(`   • OpenAPI paths: ${Object.keys(openapi.paths).length}`);
    console.log(`   • Components schemas: ${Object.keys(openapi.components.schemas).length}`);
    console.log(`   • Documentation sections: ${enrichedData.controllers.length + 1}`);
    
  } catch (error) {
    console.error('❌ Documentation generation failed:', error);
    process.exit(1);
  }
}

// Main execution
const inputFile = process.argv[2] || './enriched-metadata.json';
const openapiFile = process.argv[3] || './openapi.json';
const markdownFile = process.argv[4] || './api-docs.md';

generateDocs(inputFile, openapiFile, markdownFile);