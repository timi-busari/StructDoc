#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CLIOptions {
  path: string;
  output: string;
  verbose: boolean;
}

class ApiDocAgent {
  private options: CLIOptions;

  constructor(options: CLIOptions) {
    this.options = options;
  }

  private log(message: string, level: 'info' | 'verbose' | 'error' = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = level === 'error' ? '❌' : level === 'verbose' ? '🔍' : 'ℹ️';
    
    if (level === 'verbose' && !this.options.verbose) return;
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  private async runScript(script: string, args: string[] = []): Promise<{ stdout: string; stderr: string }> {
    const cwd = __dirname.includes('dist') ? path.join(__dirname, '..') : process.cwd();
    const command = `npm run ${script} ${args.join(' ')}`;
    
    this.log(`Running: ${command}`, 'verbose');
    
    try {
      const result = await execAsync(command, { cwd });
      return result;
    } catch (error: any) {
      throw new Error(`Script '${script}' failed: ${error.message}`);
    }
  }

  private async validateProject(): Promise<void> {
    this.log('🔍 Validating NestJS project structure...');
    
    if (!fs.existsSync(this.options.path)) {
      throw new Error(`Project path does not exist: ${this.options.path}`);
    }

    // Check for NestJS indicators
    const packageJsonPath = path.join(this.options.path, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`No package.json found at: ${packageJsonPath}`);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (!deps['@nestjs/core'] && !deps['@nestjs/common']) {
      throw new Error('Project does not appear to be a NestJS application (no @nestjs/core or @nestjs/common found)');
    }

    this.log('✅ Project validation passed');
  }

  private async ensureOutputDirectory(): Promise<void> {
    if (!fs.existsSync(this.options.output)) {
      this.log(`Creating output directory: ${this.options.output}`, 'verbose');
      fs.mkdirSync(this.options.output, { recursive: true });
    }
  }

  private async runPipeline(useAgentic: boolean = false): Promise<void> {
    this.log('🚀 Starting API documentation generation pipeline...');

    // Step 1: Extract metadata
    this.log('📊 Step 1/4: Extracting metadata from controllers...');
    await this.runScript('extract', [this.options.path]);

    // Step 2: Normalize metadata 
    this.log('🔧 Step 2/4: Normalizing metadata to OpenAPI structure...');
    await this.runScript('normalize', ['metadata.json', this.options.path]);

    // Step 3: Enrich with AI-generated content
    if (useAgentic) {
      this.log('🎭 Step 3/4: Enriching with Agentic AI Workflows...');
      await this.runScript('enrich-agentic');
    } else {
      this.log('⚠️ Step 3/4: Using simple enrichment (DEPRECATED - use agentic workflow for better results)...');
      await this.runScript('enrich');
    }

    // Step 4: Generate final documentation
    this.log('📝 Step 4/4: Generating OpenAPI and Markdown documentation...');
    const outputOpenApi = path.join(this.options.output, 'openapi.json');
    const outputMarkdown = path.join(this.options.output, 'api-docs.md');
    await this.runScript('generate', ['enriched-metadata.json', outputOpenApi, outputMarkdown]);
  }

  private async generateSummary(): Promise<void> {
    try {
      const enrichedPath = 'enriched-metadata.json';
      if (!fs.existsSync(enrichedPath)) {
        this.log('No enriched metadata found for summary', 'verbose');
        return;
      }

      const enriched = JSON.parse(fs.readFileSync(enrichedPath, 'utf-8'));
      const totalEndpoints = enriched.controllers?.reduce((sum: number, controller: any) => 
        sum + (controller.endpoints?.length || 0), 0) || 0;
      const totalControllers = enriched.controllers?.length || 0;
      const totalSchemas = Object.keys(enriched.components?.schemas || {}).length;

      console.log('\\n📋 Generation Summary:');
      console.log(`   • Controllers: ${totalControllers}`);
      console.log(`   • Endpoints: ${totalEndpoints}`);
      console.log(`   • Schemas: ${totalSchemas}`);
      console.log(`   • OpenAPI: ${path.join(this.options.output, 'openapi.json')}`);
      console.log(`   • Markdown: ${path.join(this.options.output, 'api-docs.md')}`);
      
    } catch (error) {
      this.log('Failed to generate summary', 'verbose');
    }
  }

  async run(useAgentic: boolean = false): Promise<void> {
    try {
      await this.validateProject();
      await this.ensureOutputDirectory();
      await this.runPipeline(useAgentic);
      await this.generateSummary();
      
      this.log('🎉 API documentation generated successfully!');
      
    } catch (error: any) {
      this.log(`Failed: ${error.message}`, 'error');
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      } else {
        throw error;
      }
    }
  }
}

function main() {
  const program = new Command();

  program
    .name('api-doc-agent')
    .description('AI-powered API documentation generator for NestJS applications')
    .version('0.1.0');

  program
    .command('generate')
    .description('Generate API documentation from NestJS codebase')
    .argument('[path]', 'Path to NestJS project', '.')
    .option('-o, --output <output>', 'Output directory for generated docs', './docs')
    .option('-v, --verbose', 'Enable verbose logging', false)
    .option('--agentic', 'Use advanced multi-agent AI workflows for enrichment (default: true)', true)
    .option('--simple', 'Use simple single-agent enrichment instead of agentic workflow', false)
    .action(async (projectPath, options) => {
      const resolvedPath = path.resolve(projectPath);
      const resolvedOutput = path.resolve(options.output);
      
      const agent = new ApiDocAgent({
        path: resolvedPath,
        output: resolvedOutput,
        verbose: options.verbose
      });

      // Use simple mode if --simple flag is provided, otherwise use agentic (default)
      const useAgentic = options.simple ? false : options.agentic;
      await agent.run(useAgentic);
    });

  // Add agent management commands
  program
    .command('agents')
    .description('Manage AI agents and workflows')
    .addCommand(
      new Command('status')
        .description('Check AI agent health and availability')
        .action(async () => {
          await execAsync('npm run agents:status', { cwd: __dirname.includes('dist') ? path.join(__dirname, '..') : process.cwd() })
            .then(result => console.log(result.stdout))
            .catch(error => console.error('❌ Agent status check failed:', error.message));
        })
    )
    .addCommand(
      new Command('test')
        .description('Test AI agents with sample data')
        .action(async () => {
          await execAsync('npm run agents:test', { cwd: __dirname.includes('dist') ? path.join(__dirname, '..') : process.cwd() })
            .then(result => console.log(result.stdout))
            .catch(error => console.error('❌ Agent test failed:', error.message));
        })
    );

  program.parse();
}

if (require.main === module) {
  main();
}

export { ApiDocAgent };