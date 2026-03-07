#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import cliProgress from 'cli-progress';
import chokidar from 'chokidar';
import express from 'express';

const execAsync = promisify(exec);

interface CLIOptions {
  path: string;
  output: string;
  verbose: boolean;
}

class ApiDocAgent {
  private options: CLIOptions;
  private progressBar?: cliProgress.SingleBar;
  private spinner?: ora.Ora;
  private pipelineResult?: import('./pipeline').PipelineResult;

  constructor(options: CLIOptions) {
    this.options = options;
  }

  private createProgressBar(total: number = 4): cliProgress.SingleBar {
    return new cliProgress.SingleBar({
      format: chalk.blue('Progress') + ' |{bar}| {percentage}% | {value}/{total} | {stage}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
  }

  private createSpinner(text: string): ora.Ora {
    return ora({
      text: chalk.blue(text),
      spinner: 'dots'
    });
  }

  private log(message: string, level: 'info' | 'verbose' | 'error' | 'success' | 'warn' = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    if (level === 'verbose' && !this.options.verbose) return;
    
    let prefix: string;
    let coloredMessage: string;
    
    switch (level) {
      case 'error':
        prefix = '❌';
        coloredMessage = chalk.red(message);
        break;
      case 'success':
        prefix = '✅';
        coloredMessage = chalk.green(message);
        break;
      case 'warn':
        prefix = '⚠️';
        coloredMessage = chalk.yellow(message);
        break;
      case 'verbose':
        prefix = '🔍';
        coloredMessage = chalk.gray(message);
        break;
      default:
        prefix = 'ℹ️';
        coloredMessage = message;
    }
    
    console.log(`${prefix} ${chalk.gray(`[${timestamp}]`)} ${coloredMessage}`);
  }

  private logError(error: Error, context?: string): void {
    this.log(`${context ? context + ': ' : ''}${error.message}`, 'error');
    
    // Provide helpful suggestions based on common error patterns
    if (error.message.includes('ENOENT')) {
      this.log('💡 Tip: Check that the path exists and you have read permissions', 'info');
    } else if (error.message.includes('package.json')) {
      this.log('💡 Tip: Run "structdoc init" to set up your project', 'info');
    } else if (error.message.includes('@nestjs')) {
      this.log('💡 Tip: Ensure this is a valid NestJS project with controllers', 'info');
    } else if (error.message.includes('API key')) {
      this.log('💡 Tip: Run "structdoc config validate" to check your AI configuration', 'info');
    }
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
    const spinner = this.createSpinner('Validating NestJS project structure...');
    spinner.start();
    
    try {
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

      spinner.succeed(chalk.green('Project validation passed'));
      this.log('✅ NestJS project structure validated', 'success');
    } catch (error: any) {
      spinner.fail(chalk.red('Project validation failed'));
      throw error;
    }
  }

  private async ensureOutputDirectory(): Promise<void> {
    if (!fs.existsSync(this.options.output)) {
      this.log(`Creating output directory: ${this.options.output}`, 'verbose');
      fs.mkdirSync(this.options.output, { recursive: true });
    }
  }

  private async runPipeline(useAgentic: boolean = true): Promise<void> {
    const { Pipeline } = await import('./pipeline');

    const pipeline = new Pipeline({
      projectPath: this.options.path,
      outputDir: this.options.output,
      verbose: this.options.verbose,
      agentic: useAgentic,
    });

    try {
      this.pipelineResult = await pipeline.run();
    } catch (error) {
      throw error;
    }
  }

  private generateSummary(): void {
    const result = this.pipelineResult;
    if (!result) return;

    console.log('\n📋 Generation Summary:');
    console.log(`   • Controllers: ${result.controllers}`);
    console.log(`   • Endpoints: ${result.endpoints}`);
    console.log(`   • Schemas: ${result.schemas}`);
    console.log(`   • OpenAPI: ${result.openapiFile}`);
    console.log(`   • Markdown: ${result.markdownFile}`);
    console.log(`   • Duration: ${(result.durationMs / 1000).toFixed(1)}s`);
  }

  async run(useAgentic: boolean = true): Promise<void> {
    try {
      await this.validateProject();
      await this.ensureOutputDirectory();
      await this.runPipeline(useAgentic);
      this.generateSummary();
      
      this.log('🎉 API documentation generated successfully!', 'success');
      
    } catch (error: any) {
      this.logError(error, 'Generation failed');
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      } else {
        throw error;
      }
    }
  }

  // New methods for enhanced CLI functionality

  static async initProject(): Promise<void> {
    console.log(chalk.blue.bold('\n🎭 StructDoc Setup Wizard\n'));
    console.log('Welcome to StructDoc! Let\'s set up your AI-powered API documentation generator.\n');

    try {
      // Check if .env already exists
      if (fs.existsSync('.env')) {
        const { overwrite } = await inquirer.prompt([{
          type: 'confirm',
          name: 'overwrite',
          message: '.env file already exists. Overwrite it?',
          default: false
        }]);

        if (!overwrite) {
          console.log(chalk.yellow('Setup cancelled. Existing .env preserved.'));
          return;
        }
      }

      // AI Provider selection
      const { providers } = await inquirer.prompt([{
        type: 'checkbox',
        name: 'providers',
        message: 'Select AI providers to configure:',
        choices: [
          { name: 'OpenAI (Recommended for descriptions and errors)', value: 'openai', checked: true },
          { name: 'Anthropic Claude (Excellent for examples and security)', value: 'anthropic' },
          { name: 'Local Ollama (Privacy-first, no API costs)', value: 'ollama' },
          { name: 'Google Gemini', value: 'gemini' }
        ]
      }]);

      let envContent = '# StructDoc AI Configuration\n# Generated by setup wizard\n\n';

      // Configure each selected provider
      for (const provider of providers) {
        switch (provider) {
          case 'openai':
            const { openaiKey, openaiModel } = await inquirer.prompt([
              {
                type: 'password',
                name: 'openaiKey',
                message: 'Enter your OpenAI API key:',
                mask: '*'
              },
              {
                type: 'list',
                name: 'openaiModel',
                message: 'Select OpenAI model:',
                choices: ['gpt-4o-mini', 'gpt-4o', 'gpt-4', 'gpt-3.5-turbo'],
                default: 'gpt-4o-mini'
              }
            ]);
            envContent += `# OpenAI Configuration\nOPENAI_API_KEY=${openaiKey}\nAI_MODEL=${openaiModel}\n\n`;
            break;

          case 'anthropic':
            const { anthropicKey } = await inquirer.prompt([{
              type: 'password',
              name: 'anthropicKey',
              message: 'Enter your Anthropic API key:',
              mask: '*'
            }]);
            envContent += `# Anthropic Configuration\nANTHROPIC_API_KEY=${anthropicKey}\nCLAUDE_MODEL=claude-3-haiku-20240307\n\n`;
            break;

          case 'ollama':
            const { ollamaUrl, ollamaModel } = await inquirer.prompt([
              {
                type: 'input',
                name: 'ollamaUrl',
                message: 'Enter Ollama base URL:',
                default: 'http://localhost:11434'
              },
              {
                type: 'input',
                name: 'ollamaModel',
                message: 'Enter Ollama model name:',
                default: 'llama3.2:1b'
              }
            ]);
            envContent += `# Ollama Configuration\nENABLE_OLLAMA=true\nOLLAMA_BASE_URL=${ollamaUrl}\nOLLAMA_MODEL=${ollamaModel}\n\n`;
            break;

          case 'gemini':
            const { geminiKey } = await inquirer.prompt([{
              type: 'password',
              name: 'geminiKey',
              message: 'Enter your Google Gemini API key:',
              mask: '*'
            }]);
            envContent += `# Gemini Configuration\nGEMINI_API_KEY=${geminiKey}\nGEMINI_MODEL=gemini-pro\n\n`;
            break;
        }
      }

      // Agent specialization
      if (providers.length > 1) {
        console.log('\n' + chalk.blue('Configure agent specialization (assign different providers to different tasks):'));
        
        const agentConfig = await inquirer.prompt([
          {
            type: 'list',
            name: 'descriptionAgent',
            message: 'Description Agent provider:',
            choices: providers,
            default: providers.includes('openai') ? 'openai' : providers[0]
          },
          {
            type: 'list',
            name: 'examplesAgent',
            message: 'Examples Agent provider:',
            choices: providers,
            default: providers.includes('anthropic') ? 'anthropic' : providers[0]
          },
          {
            type: 'list',
            name: 'errorsAgent',
            message: 'Errors Agent provider:',
            choices: providers,
            default: providers.includes('openai') ? 'openai' : providers[0]
          },
          {
            type: 'list',
            name: 'securityAgent',
            message: 'Security Agent provider:',
            choices: providers,
            default: providers.includes('anthropic') ? 'anthropic' : providers[0]
          }
        ]);

        envContent += `# Agent Specialization\nDESCRIPTION_AGENT_PROVIDER=${agentConfig.descriptionAgent}\n`;
        envContent += `EXAMPLES_AGENT_PROVIDER=${agentConfig.examplesAgent}\n`;
        envContent += `ERRORS_AGENT_PROVIDER=${agentConfig.errorsAgent}\n`;
        envContent += `SECURITY_AGENT_PROVIDER=${agentConfig.securityAgent}\n\n`;
      }

      // Workflow configuration
      const { executionMode, timeout, retries } = await inquirer.prompt([
        {
          type: 'list',
          name: 'executionMode',
          message: 'Agent execution mode:',
          choices: [
            { name: 'Parallel (faster, default)', value: 'parallel' },
            { name: 'Sequential (more conservative)', value: 'sequential' }
          ],
          default: 'parallel'
        },
        {
          type: 'number',
          name: 'timeout',
          message: 'AI request timeout (seconds):',
          default: 30
        },
        {
          type: 'number',
          name: 'retries',
          message: 'Max retries on failure:',
          default: 3
        }
      ]);

      envContent += `# Workflow Configuration\nAGENT_EXECUTION_MODE=${executionMode}\n`;
      envContent += `AI_REQUEST_TIMEOUT=${timeout * 1000}\n`;
      envContent += `AI_MAX_RETRIES=${retries}\n`;
      envContent += `AGENT_FALLBACK_STRATEGY=template\n`;

      // Write .env file
      fs.writeFileSync('.env', envContent);
      
      console.log(chalk.green('\n✅ Setup completed successfully!'));
      console.log(chalk.blue('\n📋 Next steps:'));
      console.log('   1. Run: structdoc generate ./path/to/nestjs-project');
      console.log('   2. Check: structdoc config validate');
      console.log('   3. Test: structdoc agents status\n');

    } catch (error: any) {
      console.error(chalk.red('❌ Setup failed:'), error.message);
      process.exit(1);
    }
  }

  static async validateConfig(): Promise<void> {
    const spinner = ora('Validating configuration...').start();
    
    try {
      // Check .env file
      if (!fs.existsSync('.env')) {
        spinner.fail(chalk.red('.env file not found'));
        console.log(chalk.blue('💡 Run "structdoc init" to create configuration'));
        return;
      }

      require('dotenv').config();
      const issues: string[] = [];
      const warnings: string[] = [];

      // Check AI providers
      const hasOpenAI = !!process.env.OPENAI_API_KEY;
      const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
      const hasOllama = process.env.ENABLE_OLLAMA === 'true';
      const hasGemini = !!process.env.GEMINI_API_KEY;

      if (!hasOpenAI && !hasAnthropic && !hasOllama && !hasGemini) {
        issues.push('No AI providers configured');
      }

      if (hasOpenAI && !process.env.AI_MODEL) {
        warnings.push('OpenAI model not specified, using default');
      }

      if (hasAnthropic && !process.env.CLAUDE_MODEL) {
        warnings.push('Claude model not specified, using default');
      }

      spinner.stop();

      if (issues.length === 0) {
        console.log(chalk.green('✅ Configuration is valid'));
        
        if (warnings.length > 0) {
          console.log(chalk.yellow('\n⚠️ Warnings:'));
          warnings.forEach(warning => console.log(`   • ${warning}`));
        }

        console.log(chalk.blue('\n📊 Configured providers:'));
        if (hasOpenAI) console.log(`   • OpenAI (${process.env.AI_MODEL || 'gpt-4o-mini'})`);
        if (hasAnthropic) console.log(`   • Anthropic (${process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307'})`);
        if (hasOllama) console.log(`   • Ollama (${process.env.OLLAMA_MODEL || 'llama2'})`);
        if (hasGemini) console.log(`   • Gemini (${process.env.GEMINI_MODEL || 'gemini-pro'})`);
      } else {
        console.log(chalk.red('❌ Configuration issues found:'));
        issues.forEach(issue => console.log(`   • ${issue}`));
        console.log(chalk.blue('\n💡 Run "structdoc init" to fix configuration'));
      }

    } catch (error: any) {
      spinner.fail(chalk.red('Configuration validation failed'));
      console.error(error.message);
    }
  }

  async watchMode(): Promise<void> {
    this.log('👀 Starting watch mode for automatic documentation updates...', 'info');
    
    const srcPath = path.join(this.options.path, 'src');
    const watcher = chokidar.watch([
      path.join(srcPath, '**/*.controller.ts'),
      path.join(srcPath, '**/*.dto.ts'),
      path.join(srcPath, '**/*.entity.ts')
    ], {
      ignored: /node_modules/,
      persistent: true
    });

    let isGenerating = false;
    let pendingUpdate = false;

    const regenerate = async () => {
      if (isGenerating) {
        pendingUpdate = true;
        return;
      }

      isGenerating = true;
      pendingUpdate = false;

      try {
        this.log('📝 Regenerating documentation...', 'info');
        await this.runPipeline();
        this.log('✅ Documentation updated', 'success');
      } catch (error: any) {
        this.logError(error, 'Watch mode regeneration failed');
      } finally {
        isGenerating = false;
        if (pendingUpdate) {
          setTimeout(regenerate, 1000); // Debounce
        }
      }
    };

    watcher.on('change', (filePath) => {
      this.log(`📄 File changed: ${path.basename(filePath)}`, 'verbose');
      regenerate();
    });

    watcher.on('add', (filePath) => {
      this.log(`📄 File added: ${path.basename(filePath)}`, 'verbose');
      regenerate();
    });

    console.log(chalk.green('👀 Watching for changes... Press Ctrl+C to stop'));
    
    // Keep process alive
    process.on('SIGINT', () => {
      this.log('🛑 Stopping watch mode...', 'info');
      watcher.close();
      process.exit(0);
    });
  }

  async servePreview(port: number = 3000): Promise<void> {
    const app = express();
    const docsPath = this.options.output;

    // Serve static files
    app.use(express.static(docsPath));

    // Serve OpenAPI JSON
    app.get('/api/openapi.json', (req, res) => {
      const openApiPath = path.join(docsPath, 'openapi.json');
      if (fs.existsSync(openApiPath)) {
        res.sendFile(path.resolve(openApiPath));
      } else {
        res.status(404).json({ error: 'OpenAPI spec not found' });
      }
    });

    // Serve API docs
    app.get('/', (req, res) => {
      const markdownPath = path.join(docsPath, 'api-docs.md');
      if (fs.existsSync(markdownPath)) {
        const markdown = fs.readFileSync(markdownPath, 'utf-8');
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>API Documentation</title>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <style>
              body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
              pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
              code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <div id="content"></div>
            <script>
              document.getElementById('content').innerHTML = marked.parse(${JSON.stringify(markdown)});
            </script>
          </body>
          </html>
        `);
      } else {
        res.status(404).send('<h1>Documentation not found</h1><p>Run generation first</p>');
      }
    });

    app.listen(port, () => {
      console.log(chalk.green(`🚀 Preview server running at http://localhost:${port}`));
      console.log(chalk.blue('📖 API Documentation: http://localhost:' + port));
      console.log(chalk.blue('🔧 OpenAPI JSON: http://localhost:' + port + '/api/openapi.json'));
      console.log(chalk.gray('Press Ctrl+C to stop'));
    });
  }
}

function main() {
  const program = new Command();

  program
    .name('structdoc')
    .description('🎭 AI-powered API documentation generator for NestJS applications')
    .version('0.1.0');

  // Init command
  program
    .command('init')
    .description('🚀 Interactive setup wizard for StructDoc configuration')
    .action(async () => {
      await ApiDocAgent.initProject();
    });

  // Generate command (main functionality)
  program
    .command('generate')
    .description('📝 Generate API documentation from NestJS codebase')
    .argument('[path]', 'Path to NestJS project', '.')
    .option('-o, --output <output>', 'Output directory for generated docs', './docs')
    .option('-v, --verbose', 'Enable verbose logging', false)
    .option('--agentic', 'Use advanced multi-agent AI workflows (default)', true)
    .option('--simple', 'Use simple single-agent enrichment instead of agentic workflow', false)
    .action(async (projectPath, options) => {
      const resolvedPath = path.resolve(projectPath);
      const resolvedOutput = path.resolve(options.output);
      
      const agent = new ApiDocAgent({
        path: resolvedPath,
        output: resolvedOutput,
        verbose: options.verbose
      });

      const useAgentic = options.simple ? false : options.agentic;
      await agent.run(useAgentic);
    });

  // Watch command
  program
    .command('watch')
    .description('👀 Watch for changes and automatically regenerate documentation')
    .argument('[path]', 'Path to NestJS project', '.')
    .option('-o, --output <output>', 'Output directory for generated docs', './docs')
    .option('-v, --verbose', 'Enable verbose logging', false)
    .action(async (projectPath, options) => {
      const resolvedPath = path.resolve(projectPath);
      const resolvedOutput = path.resolve(options.output);
      
      const agent = new ApiDocAgent({
        path: resolvedPath,
        output: resolvedOutput,
        verbose: options.verbose
      });

      await agent.watchMode();
    });

  // Serve command
  program
    .command('serve')
    .description('🌐 Start preview server for generated documentation')
    .option('-o, --output <output>', 'Documentation directory to serve', './docs')
    .option('-p, --port <port>', 'Port to serve on', '3000')
    .action(async (options) => {
      const resolvedOutput = path.resolve(options.output);
      const port = parseInt(options.port);
      
      const agent = new ApiDocAgent({
        path: '.',
        output: resolvedOutput,
        verbose: false
      });

      await agent.servePreview(port);
    });

  // Config commands
  const configCommand = program
    .command('config')
    .description('⚙️ Manage StructDoc configuration');

  configCommand
    .command('validate')
    .description('🔍 Validate current configuration')
    .action(async () => {
      await ApiDocAgent.validateConfig();
    });

  configCommand
    .command('doctor')
    .description('🩺 Diagnose configuration issues and suggest fixes')
    .action(async () => {
      console.log(chalk.blue.bold('🩺 StructDoc Configuration Doctor\n'));
      
      // Run validation first
      await ApiDocAgent.validateConfig();
      
      // Additional diagnostics
      console.log(chalk.blue('\n🔍 Running additional diagnostics...\n'));
      
      // Check Node.js version
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion >= 18) {
        console.log(chalk.green('✅ Node.js version compatible:'), nodeVersion);
      } else {
        console.log(chalk.red('❌ Node.js version too old:'), nodeVersion);
        console.log(chalk.blue('💡 Please upgrade to Node.js 18 or higher'));
      }
      
      // Check for common project issues
      if (fs.existsSync('package.json')) {
        console.log(chalk.green('✅ package.json found'));
      } else {
        console.log(chalk.red('❌ No package.json found'));
        console.log(chalk.blue('💡 Make sure you\'re in a Node.js project directory'));
      }
    });

  // Agent management commands
  const agentsCommand = program
    .command('agents')
    .description('🤖 Manage AI agents and workflows');

  agentsCommand
    .command('status')
    .description('📊 Check AI agent health and availability')
    .action(async () => {
      const spinner = ora('Checking agent status...').start();
      try {
        await execAsync('npm run agents:status', { 
          cwd: __dirname.includes('dist') ? path.join(__dirname, '..') : process.cwd() 
        });
        spinner.succeed('Agent status check completed');
      } catch (error: any) {
        spinner.fail('Agent status check failed');
        console.error(chalk.red('❌ Error:'), error.message);
      }
    });

  agentsCommand
    .command('test')
    .description('🧪 Test AI agents with sample data')
    .action(async () => {
      const spinner = ora('Testing agents...').start();
      try {
        const result = await execAsync('npm run agents:test', { 
          cwd: __dirname.includes('dist') ? path.join(__dirname, '..') : process.cwd() 
        });
        spinner.succeed('Agent test completed');
        console.log(result.stdout);
      } catch (error: any) {
        spinner.fail('Agent test failed');
        console.error(chalk.red('❌ Error:'), error.message);
      }
    });

  agentsCommand
    .command('test-individual')
    .description('🔬 Test individual agents separately')
    .action(async () => {
      const spinner = ora('Testing individual agents...').start();
      try {
        const result = await execAsync('npm run agents:test-individual', { 
          cwd: __dirname.includes('dist') ? path.join(__dirname, '..') : process.cwd() 
        });
        spinner.succeed('Individual agent tests completed');
        console.log(result.stdout);
      } catch (error: any) {
        spinner.fail('Individual agent tests failed');
        console.error(chalk.red('❌ Error:'), error.message);
      }
    });

  // Help enhancement
  program.on('--help', () => {
    console.log('');
    console.log(chalk.blue.bold('🎭 StructDoc - AI-Powered API Documentation'));
    console.log('');
    console.log(chalk.yellow('Quick Start:'));
    console.log('  1. structdoc init                    # Setup configuration');
    console.log('  2. structdoc generate ./my-project   # Generate docs');
    console.log('  3. structdoc serve                   # Preview docs');
    console.log('');
    console.log(chalk.yellow('Development Workflow:'));
    console.log('  structdoc watch ./my-project         # Auto-regenerate on changes');
    console.log('  structdoc config validate            # Check configuration');
    console.log('  structdoc agents status              # Check AI providers');
    console.log('');
  });

  program.parse();
}

if (require.main === module) {
  main();
}

export { ApiDocAgent };