import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('API Documentation Pipeline', () => {
  const testProjectPath = path.join(__dirname, '../examples/sample-app');
  const outputDir = path.join(__dirname, 'output');

  beforeAll(async () => {
    // Clean up test output directory
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });
  });

  afterAll(async () => {
    // Clean up test files from temp directory
    const tempDir = '.temp';
    const tempFiles = ['metadata.json', 'normalized-metadata.json', 'enriched-metadata.json'];
    tempFiles.forEach(file => {
      const filePath = path.join(tempDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  test('should validate NestJS project structure', async () => {
    expect(fs.existsSync(testProjectPath)).toBe(true);
    expect(fs.existsSync(path.join(testProjectPath, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(testProjectPath, 'src'))).toBe(true);
  });

  test('should extract metadata from controllers', async () => {
    const { stdout } = await execAsync(`npm run extract ${testProjectPath}`);
    
    expect(stdout).toContain('Wrote metadata to');
    expect(fs.existsSync('.temp/metadata.json')).toBe(true);
    
    const metadata = JSON.parse(fs.readFileSync('.temp/metadata.json', 'utf-8'));
    expect(metadata.controllers).toBeDefined();
    expect(Array.isArray(metadata.controllers)).toBe(true);
    expect(metadata.controllers.length).toBeGreaterThan(0);
  });

  test('should normalize metadata to OpenAPI structure', async () => {
    // Ensure metadata.json exists from previous test
    expect(fs.existsSync('.temp/metadata.json')).toBe(true);
    
    const { stdout } = await execAsync(`npm run normalize .temp/metadata.json ${testProjectPath}`);
    
    expect(stdout).toContain('Wrote normalized metadata to');
    expect(fs.existsSync('.temp/normalized-metadata.json')).toBe(true);
    
    const normalized = JSON.parse(fs.readFileSync('.temp/normalized-metadata.json', 'utf-8'));
    expect(normalized.controllers).toBeDefined();
    expect(normalized.components?.schemas).toBeDefined();
  });

  test('should enrich metadata with AI-generated content', async () => {
    // Ensure normalized-metadata.json exists
    expect(fs.existsSync('.temp/normalized-metadata.json')).toBe(true);
    
    const { stdout } = await execAsync('npm run enrich-agentic');
    
    expect(stdout).toContain('Agentic Workflow Enrichment');
    expect(fs.existsSync('.temp/enriched-metadata.json')).toBe(true);
    
    const enriched = JSON.parse(fs.readFileSync('.temp/enriched-metadata.json', 'utf-8'));
    expect(enriched.enriched?.endpoints).toBeDefined();
    expect(Array.isArray(enriched.enriched.endpoints)).toBe(true);
  }, 180000);

  test('should generate OpenAPI and Markdown documentation', async () => {
    // Ensure enriched-metadata.json exists
    expect(fs.existsSync('.temp/enriched-metadata.json')).toBe(true);
    
    const openapiPath = path.join(outputDir, 'openapi.json');
    const markdownPath = path.join(outputDir, 'api-docs.md');
    
    const { stdout } = await execAsync(`npm run generate .temp/enriched-metadata.json ${openapiPath} ${markdownPath}`);
    
    expect(stdout).toContain('OpenAPI specification written');
    expect(stdout).toContain('Markdown documentation written');
    expect(fs.existsSync(openapiPath)).toBe(true);
    expect(fs.existsSync(markdownPath)).toBe(true);
    
    // Validate OpenAPI structure
    const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf-8'));
    expect(openapi.openapi).toBe('3.0.3');
    expect(openapi.info).toBeDefined();
    expect(openapi.paths).toBeDefined();
    expect(openapi.components?.schemas).toBeDefined();
    
    // Validate Markdown content
    const markdown = fs.readFileSync(markdownPath, 'utf-8');
    expect(markdown).toContain('# API Documentation');
    expect(markdown).toContain('## Table of Contents');
  });

  test('should produce deterministic output', async () => {
    // Clean up temp directory first
    const tempDir = '.temp';
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }

    // Run extraction twice and compare outputs
    await execAsync(`npm run extract -- ${testProjectPath}`);
    const metadata1 = fs.readFileSync('.temp/metadata.json', 'utf-8');
    
    // Clean and run again
    fs.rmSync(tempDir, { recursive: true });
    await execAsync(`npm run extract -- ${testProjectPath}`);
    const metadata2 = fs.readFileSync('.temp/metadata.json', 'utf-8');
    
    // Parse and compare (removing any timestamp-based differences)
    const data1 = JSON.parse(metadata1);
    const data2 = JSON.parse(metadata2);
    
    expect(data1).toEqual(data2);
  }, 30000);
});

describe('CLI Integration', () => {
  const testProjectPath = path.join(__dirname, '../examples/sample-app');
  const outputDir = path.join(__dirname, 'cli-output');

  beforeAll(async () => {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
  });

  test('should validate project structure correctly', async () => {
    const { ApiDocAgent } = await import('../src/cli');
    
    const agent = new ApiDocAgent({
      path: testProjectPath,
      output: outputDir,
      verbose: false
    });

    // This should not throw for a valid NestJS project
    await expect(agent.run()).resolves.not.toThrow();
    
    // Check that output files were created
    expect(fs.existsSync(path.join(outputDir, 'openapi.json'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'api-docs.md'))).toBe(true);
  }, 300000);

  test('should fail with invalid project path', async () => {
    const { ApiDocAgent } = await import('../src/cli');
    
    const agent = new ApiDocAgent({
      path: '/nonexistent/path',
      output: outputDir,
      verbose: false
    });

    await expect(agent.run()).rejects.toThrow('Project path does not exist');
  });
});