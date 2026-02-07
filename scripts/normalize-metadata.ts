import path from 'path';
import fs from 'fs';
import { Project, TypeFormatFlags } from 'ts-morph';

// Function to parse Prisma schema and extract enum definitions
function parsePrismaEnums(projectPath: string): Record<string, string[]> {
  const prismaSchemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
  const enums: Record<string, string[]> = {};
  
  if (!fs.existsSync(prismaSchemaPath)) {
    return enums;
  }
  
  try {
    const schemaContent = fs.readFileSync(prismaSchemaPath, 'utf-8');
    const enumMatches = schemaContent.match(/enum\s+(\w+)\s*{[^}]+}/g);
    
    if (enumMatches) {
      for (const enumMatch of enumMatches) {
        const nameMatch = enumMatch.match(/enum\s+(\w+)/);
        if (nameMatch) {
          const enumName = nameMatch[1];
          const braceContent = enumMatch.match(/{([^}]+)}/);
          if (braceContent) {
            const values = braceContent[1]
              .split('\n')
              .map(line => line.trim())
              .filter(line => line && !line.startsWith('//') && !line.startsWith('@@'))
              .map(line => line.split('//')[0].trim()) // Remove inline comments
              .filter(Boolean);
            
            if (values.length > 0) {
              enums[enumName] = values;
            }
          }
        }
      }
    }
  } catch (error: any) {
    console.warn('Warning: Could not parse Prisma schema:', error?.message || 'Unknown error');
  }
  
  return enums;
}

function resolveTypeText(type: any, prismaEnums: Record<string, string[]> = {}): string {
  try {
    // Get the basic type text first
    const typeText = type.getText();
    
    // Check if it matches a Prisma enum
    const enumValues = prismaEnums[typeText];
    if (enumValues && Array.isArray(enumValues)) {
      return `enum:${typeText}[${enumValues.join('|')}]`;
    }
    
    // Try to get enum values if it's an enum type
    const symbol = type.getSymbol();
    if (symbol) {
      const declarations = symbol.getDeclarations();
      for (const decl of declarations) {
        if (decl.getKind() === 268) { // SyntaxKind.EnumDeclaration
          const enumName = decl.getName();
          if (enumName) {
            // Try to get enum values
            const members = decl.getMembers?.() || [];
            if (members.length > 0) {
              const values = members.map((member: any) => {
                try {
                  return member.getName?.() || member.getText();
                } catch {
                  return null;
                }
              }).filter(Boolean);
              
              if (values.length > 0) {
                return `enum:${enumName}[${values.join('|')}]`;
              }
            }
            return `enum:${enumName}`;
          }
        }
      }
    }
    
    // Check if it's a union type that might contain enum-like values
    if (type.isUnion && type.isUnion()) {
      const unionTypes = type.getUnionTypes();
      const literalValues = unionTypes
        .filter((ut: any) => ut.isStringLiteral && ut.isStringLiteral())
        .map((ut: any) => {
          try {
            return ut.getLiteralValue?.() || ut.getText();
          } catch {
            return ut.getText();
          }
        })
        .filter(Boolean);
      
      if (literalValues.length > 0) {
        return `union[${literalValues.join('|')}]`;
      }
    }
    
    // Check if the type name suggests it's an enum (common patterns)
    if (typeText && (/Status$|Type$|State$|Mode$/.test(typeText) || typeText.includes('Enum'))) {
      // Check if we have this enum in Prisma schema
      const enumValues = prismaEnums[typeText];
      if (enumValues && Array.isArray(enumValues)) {
        return `enum:${typeText}[${enumValues.join('|')}]`;
      }
      return `enum:${typeText}`;
    }
    
    // Get the full type text with better formatting
    const fullTypeText = type.getText(undefined, TypeFormatFlags.UseFullyQualifiedType);
    if (fullTypeText && fullTypeText !== 'unknown' && fullTypeText !== typeText) {
      return fullTypeText;
    }
    
    return typeText || 'unknown';
  } catch (error) {
    // Fallback to basic type text
    return type.getText() || 'unknown';
  }
}

type NormalizedEndpoint = {
  method: string;
  path: string;
  handler: string;
  auth?: string | null;
  requestBody?: { $ref: string } | null;
  response?: { $ref: string } | null;
  params?: Array<{ name: string; in: string; type: string }>;
};

type NormalizedController = {
  name: string;
  basePath: string;
  endpoints: NormalizedEndpoint[];
};

type ComponentSchema = {
  type: 'object';
  properties: Record<string, any>;
  required?: string[];
};

type NormalizedMetadata = {
  controllers: NormalizedController[];
  components: {
    schemas: Record<string, ComponentSchema>;
  };
};

function convertTypeToSchema(typeStr: string): any {
  // Handle enum types with values
  if (typeStr.startsWith('enum:')) {
    const match = typeStr.match(/enum:(\w+)(\[([^\]]+)\])?/);
    if (match) {
      const enumName = match[1];
      const enumValues = match[3];
      if (enumValues) {
        return {
          type: 'string',
          enum: enumValues.split('|'),
          description: `Enum: ${enumName}`
        };
      } else {
        return {
          type: 'string',
          description: `Enum: ${enumName}`
        };
      }
    }
  }
  
  // Handle union types
  if (typeStr.startsWith('union[')) {
    const match = typeStr.match(/union\[([^\]]+)\]/);
    if (match) {
      const unionValues = match[1].split('|');
      return {
        type: 'string',
        enum: unionValues,
        description: 'Union type'
      };
    }
  }
  
  // Simple type conversion for basic types
  if (typeStr === 'string') return { type: 'string' };
  if (typeStr === 'number') return { type: 'number' };
  if (typeStr === 'boolean') return { type: 'boolean' };
  if (typeStr === 'Date') return { type: 'string', format: 'date-time' };
  if (typeStr.endsWith('[]')) {
    const itemType = typeStr.slice(0, -2);
    return { type: 'array', items: convertTypeToSchema(itemType) };
  }
  // For unknown types, default to string
  return { type: 'string' };
}

function extractDtoName(importStr: string): string | null {
  // Handle arrays by removing [] suffix first
  let cleanImportStr = importStr.replace(/\[\]$/, '');
  const match = cleanImportStr.match(/\.([A-Z][a-zA-Z0-9_]*)$/);
  return match ? match[1] : null;
}

function extractFilePath(importStr: string): string | null {
  const match = importStr.match(/^import\("([^"]+)"\)/);
  return match ? match[1] : null;
}

async function run(metadataPath = 'metadata.json', targetProject = '.') {
  if (!fs.existsSync(metadataPath)) {
    console.error(`Metadata file not found: ${metadataPath}`);
    process.exit(1);
  }

  const rawMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const outPath = 'normalized-metadata.json';

  // Parse Prisma enums
  const prismaEnums = parsePrismaEnums(targetProject);
  console.log('Found Prisma enums for normalization:', Object.keys(prismaEnums));

  // Set up ts-morph project for DTO analysis
  const project = new Project({
    tsConfigFilePath: fs.existsSync(path.join(targetProject, 'tsconfig.json')) 
      ? path.join(targetProject, 'tsconfig.json') : undefined,
  });

  project.addSourceFilesAtPaths(path.join(targetProject, 'src', '**', '*.ts'));

  const schemas: Record<string, ComponentSchema> = {};
  const processedTypes = new Set<string>();

  // Extract and normalize all DTOs
  for (const controller of rawMetadata.controllers) {
    for (const endpoint of controller.endpoints) {
      // Process request body
      if (endpoint.requestBody?.type) {
        const dtoName = extractDtoName(endpoint.requestBody.type);
        const filePath = extractFilePath(endpoint.requestBody.type);
        
        if (dtoName && filePath && !processedTypes.has(dtoName)) {
          processedTypes.add(dtoName);
          
          const sourceFile = project.getSourceFile(filePath + '.ts');
          if (sourceFile) {
            const dtoClass = sourceFile.getClass(dtoName);
            if (dtoClass) {
              console.log(`✅ Processing request DTO: ${dtoName}`);
              const schema: ComponentSchema = {
                type: 'object',
                properties: {},
                required: []
              };

              const properties = dtoClass.getProperties();
              for (const prop of properties) {
                const propName = prop.getName();
                const propType = resolveTypeText(prop.getType(), prismaEnums);
                schema.properties[propName] = convertTypeToSchema(propType);
                
                // Assume all properties are required (can be refined later)
                if (!propType.includes('?') && !propType.includes('undefined')) {
                  schema.required?.push(propName);
                }
              }

              if (schema.required?.length === 0) delete schema.required;
              schemas[dtoName] = schema;
            }
          }
        }
      }

      // Process response
      if (endpoint.response?.type) {
        const responseTypeStr = endpoint.response.type;
        const dtoName = extractDtoName(responseTypeStr);
        const filePath = extractFilePath(responseTypeStr);
        
        if (dtoName && filePath && !processedTypes.has(dtoName)) {
          processedTypes.add(dtoName);
          
          const sourceFile = project.getSourceFile(filePath + '.ts');
          if (sourceFile) {
            const dtoClass = sourceFile.getClass(dtoName);
            if (dtoClass) {
              console.log(`✅ Processing response DTO: ${dtoName}`);
              const schema: ComponentSchema = {
                type: 'object',
                properties: {},
                required: []
              };

              const properties = dtoClass.getProperties();
              for (const prop of properties) {
                const propName = prop.getName();
                const propType = resolveTypeText(prop.getType(), prismaEnums);
                schema.properties[propName] = convertTypeToSchema(propType);
                
                if (!propType.includes('?') && !propType.includes('undefined')) {
                  schema.required?.push(propName);
                }
              }

              if (schema.required?.length === 0) delete schema.required;
              schemas[dtoName] = schema;
            }
          }
        }
      }
    }
  }

  // Normalize controllers and endpoints
  const normalizedControllers: NormalizedController[] = rawMetadata.controllers.map((controller: any) => ({
    name: controller.name,
    basePath: controller.basePath,
    endpoints: controller.endpoints.map((endpoint: any) => {
      const normalized: NormalizedEndpoint = {
        method: endpoint.method,
        path: endpoint.path,
        handler: endpoint.handler,
        auth: endpoint.auth,
        params: endpoint.params
      };

      // Convert requestBody to $ref
      if (endpoint.requestBody?.type) {
        const dtoName = extractDtoName(endpoint.requestBody.type);
        if (dtoName && schemas[dtoName]) {
          normalized.requestBody = { $ref: `#/components/schemas/${dtoName}` };
        }
      }

      // Convert response to $ref
      if (endpoint.response?.type) {
        const responseTypeStr = endpoint.response.type;
        if (responseTypeStr.includes('[]')) {
          // Array response
          const dtoName = extractDtoName(responseTypeStr.replace('[]', ''));
          if (dtoName && schemas[dtoName]) {
            normalized.response = { 
              $ref: `#/components/schemas/${dtoName}Array` 
            };
            // Create array schema
            schemas[`${dtoName}Array`] = {
              type: 'array' as any,
              items: { $ref: `#/components/schemas/${dtoName}` }
            } as any;
          }
        } else {
          const dtoName = extractDtoName(responseTypeStr);
          if (dtoName && schemas[dtoName]) {
            normalized.response = { $ref: `#/components/schemas/${dtoName}` };
          } else if (responseTypeStr.includes('{') && responseTypeStr.includes('}')) {
            // Inline object like { success: boolean }
            const inlineSchemaName = `${controller.name}_${endpoint.handler}_Response`;
            schemas[inlineSchemaName] = {
              type: 'object',
              properties: {
                success: { type: 'boolean' }
              },
              required: ['success']
            };
            normalized.response = { $ref: `#/components/schemas/${inlineSchemaName}` };
          }
        }
      }

      return normalized;
    })
  }));

  const normalizedMetadata: NormalizedMetadata = {
    controllers: normalizedControllers,
    components: { schemas }
  };

  fs.writeFileSync(outPath, JSON.stringify(normalizedMetadata, null, 2));
  console.log(`Wrote normalized metadata to ${outPath}`);
  console.log(`Schemas generated: ${Object.keys(schemas).length}`);
}

const metadataPath = process.argv[2] || 'metadata.json';
const targetProject = process.argv[3] || './examples/sample-app';
run(metadataPath, targetProject).catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});