import path from 'path';
import fs from 'fs';
import { Project, TypeFormatFlags } from 'ts-morph';

type Endpoint = {
  method: string;
  path: string;
  handler: string;
  auth?: string | null;
  requestBody?: { type: string | null } | null;
  response?: { type: string | null } | null;
  params?: Array<{ name: string; in: string; type: string | null }>;
};

type ControllerMeta = {
  name: string;
  basePath: string;
  endpoints: Endpoint[];
};

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

function deterministicSort(arr: any[]) {
  return arr.sort((a, b) => {
    const ka = a.name || a.path || a.handler || '';
    const kb = b.name || b.path || b.handler || '';
    return ka.localeCompare(kb);
  });
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

function normalizePath(basePath: string, routePath: string): string {
  // Clean up paths and ensure no duplication
  const cleanBase = basePath.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
  const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
  
  // If route is empty, just return the base path
  if (!cleanRoute) {
    return cleanBase ? '/' + cleanBase : '/';
  }
  
  // If route already starts with base path, don't duplicate it
  if (cleanBase && cleanRoute.startsWith(cleanBase + '/')) {
    return '/' + cleanRoute;
  }
  
  // If route is exactly the base path, return it
  if (cleanRoute === cleanBase) {
    return '/' + cleanRoute;
  }
  
  // Combine paths properly
  if (cleanBase && cleanRoute) {
    return '/' + cleanBase + '/' + cleanRoute;
  } else if (cleanRoute) {
    return '/' + cleanRoute;
  }
  
  return '/';
}

async function run(target = '.') {
  const absTarget = path.resolve(target);
  const outPath = path.join(process.cwd(), 'metadata.json');

  // Parse Prisma enums
  const prismaEnums = parsePrismaEnums(absTarget);
  console.log('Found Prisma enums:', Object.keys(prismaEnums));

  const project = new Project({
    tsConfigFilePath: fs.existsSync(path.join(absTarget, 'tsconfig.json'))
      ? path.join(absTarget, 'tsconfig.json')
      : undefined,
  });

  project.addSourceFilesAtPaths(path.join(absTarget, 'src', '**', '*.ts'));
  const sourceFiles = project.getSourceFiles();
  const controllers: ControllerMeta[] = [];

  for (const sf of sourceFiles) {
    const classes = sf.getClasses();
    for (const cls of classes) {
      const decs = cls.getDecorators();
      const controllerDec = decs.find(d => d.getName() === 'Controller');
      if (!controllerDec) continue;

      let basePath = '';
      const args = controllerDec.getArguments();
      if (args.length > 0) {
        try {
          basePath = args[0].getText().replace(/^['`\"]|['`\"]$/g, '');
        } catch {
          basePath = '';
        }
      }

      const controllerMeta: ControllerMeta = { name: cls.getName() || 'Anonymous', basePath, endpoints: [] };
      const classGuards = decs.filter(d => d.getName() === 'UseGuards').map(d => d.getText());

      const methods = cls.getMethods();
      for (const m of methods) {
        const mDecs = m.getDecorators();
        const httpDec = mDecs.find(d => ['Get','Post','Put','Patch','Delete','Options','Head','All'].includes(d.getName()));
        if (!httpDec) continue;

        const methodName = httpDec.getName().toUpperCase();
        let routePath = '';
        const hArgs = httpDec.getArguments();
        if (hArgs.length > 0) routePath = hArgs[0].getText().replace(/^['`\"]|['`\"]$/g, '');

        const params: Array<{ name: string; in: string; type: string | null }> = [];
        for (const p of m.getParameters()) {
          const pDec = p.getDecorators()[0];
          const pName = p.getName();
          const typeNode = p.getTypeNode();
          const pType = typeNode ? typeNode.getText() : resolveTypeText(p.getType(), prismaEnums);
          if (pDec) {
            const decName = pDec.getName();
            if (decName === 'Param') params.push({ name: pName, in: 'path', type: pType });
            if (decName === 'Query') params.push({ name: pName, in: 'query', type: pType });
            if (decName === 'Headers') params.push({ name: pName, in: 'header', type: pType });
          }
        }

        let requestBody: { type: string | null } | null = null;
        const bodyParam = m.getParameters().find(p => p.getDecorators().some(d => d.getName() === 'Body'));
        if (bodyParam) {
          // Get more detailed type information for body parameters
          const bodyType = bodyParam.getType();
          const bodyTypeText = resolveTypeText(bodyType, prismaEnums);
          
          // If it's a complex DTO, try to get more detailed schema information
          if (bodyTypeText?.includes('import(')) {
            // Keep the original import reference but also try to analyze the DTO structure
            requestBody = { type: bodyTypeText || null };
          } else {
            requestBody = { type: bodyTypeText || null };
          }
        }

        let response: { type: string | null } | null = null;
        try { response = { type: resolveTypeText(m.getReturnType(), prismaEnums) || null }; } catch { response = null; }

        const methodGuards = mDecs.filter(d => d.getName() === 'UseGuards').map(d => d.getText());
        const auth = methodGuards.length > 0 ? methodGuards.join(',') : (classGuards.length > 0 ? classGuards.join(',') : null);

        const endpoint: Endpoint = {
          method: methodName,
          path: normalizePath(basePath || '', routePath || ''),
          handler: m.getName(),
          auth,
          requestBody,
          response,
          params: params.length ? deterministicSort(params) : undefined,
        };

        controllerMeta.endpoints.push(endpoint);
      }

      controllerMeta.endpoints = deterministicSort(controllerMeta.endpoints);
      controllers.push(controllerMeta);
    }
  }

  const out = { controllers: deterministicSort(controllers) };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('Wrote metadata to', outPath);
}

const target = process.argv[2] || '.';
run(target).catch(err => { console.error('ERROR:', err); process.exit(1); });
