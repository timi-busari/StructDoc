import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AIProvider } from './types';

// Dynamic import for Google GenAI to avoid TypeScript issues
const GoogleGenAI = require('@google/genai').GoogleGenAI;

/**
 * OpenAI Provider
 */
export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;
  private model: string;
  private timeout: number;

  constructor(apiKey: string, model = 'gpt-5-mini', timeout = 30000) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.timeout = timeout;
  }

  isAvailable(): boolean {
    return !!this.client;
  }

  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    // Combine system and user prompts for the new API format
    const fullInput = `${systemPrompt}\n\n${userPrompt}`;
    
    const response = await this.client.responses.create({
      model: this.model,
      input: fullInput,
      temperature: 0.1,
    }, {
      timeout: this.timeout,
    });

    if (!response.output_text) {
      throw new Error('No output_text from OpenAI');
    }

    return response.output_text.trim();
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.call('You are a helpful assistant.', 'Say "OK" if you can respond.');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Anthropic Claude Provider
 */
export class AnthropicProvider implements AIProvider {
  name = 'anthropic';
  private client: Anthropic;
  private model: string;
  private timeout: number;

  constructor(apiKey: string, model = 'claude-3-haiku-20240307', timeout = 30000) {
    this.client = new Anthropic({ apiKey });
    this.model = model;
    this.timeout = timeout;
  }

  isAvailable(): boolean {
    return !!this.client;
  }

  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const completion = await this.client.messages.create({
      model: this.model,
      max_tokens: 1500,
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
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.call('You are a helpful assistant.', 'Say "OK" if you can respond.');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Google Gemini Provider (using official SDK)
 */
export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private client: any;
  private model: string;
  private timeout: number;

  constructor(apiKey: string, model = 'gemini-3-flash-preview', timeout = 30000) {
    this.client = new GoogleGenAI({ apiKey });
    this.model = model;
    this.timeout = timeout;
  }

  isAvailable(): boolean {
    return !!this.client;
  }

  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      // Combine system and user prompts
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: fullPrompt,
      });
      
      const text = response.text;
      
      if (!text) {
        throw new Error('No response text from Gemini');
      }

      return text.trim();
    } catch (error: any) {
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error(`Gemini API key is invalid. Please verify your GEMINI_API_KEY.`);
      }
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.call('You are a helpful assistant.', 'Say "OK" if you can respond.');
      return true;
    } catch (error: any) {
      if (error.message.includes('API key is invalid')) {
        console.warn('⚠️ Gemini API key is invalid - provider marked as unhealthy');
      }
      return false;
    }
  }
}

/**
 * Local Ollama Provider
 */
export class OllamaProvider implements AIProvider {
  name = 'ollama';
  private baseUrl: string;
  private model: string;
  private timeout: number;

  constructor(baseUrl = 'http://localhost:11434', model = 'llama2', timeout = 60000) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.timeout = timeout;
  }

  isAvailable(): boolean {
    return true; // Assume available if configured
  }

  async call(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        prompt: `${systemPrompt}\n\nUser: ${userPrompt}\nAssistant:`,
        stream: false,
        options: {
          temperature: 0.1,
          max_tokens: 1500,
        }
      }),
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return (data as any).response?.trim() || '';
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Provider Factory
 */
export class ProviderFactory {
  static create(type: string, config: any): AIProvider {
    switch (type.toLowerCase()) {
      case 'openai':
        return new OpenAIProvider(config.apiKey, config.model, config.timeout);
      case 'anthropic':
      case 'claude':
        return new AnthropicProvider(config.apiKey, config.model, config.timeout);
      case 'ollama':
        return new OllamaProvider(config.baseUrl, config.model, config.timeout);
      case 'gemini':
        return new GeminiProvider(config.apiKey, config.model, config.timeout);
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }

  static getAvailableProviders(config: any): string[] {
    const available: string[] = [];
    
    if (config.openai?.apiKey) available.push('openai');
    if (config.anthropic?.apiKey) available.push('anthropic');
    if (config.ollama?.baseUrl) available.push('ollama');
    if (config.gemini?.apiKey) available.push('gemini');
    if (config.custom?.baseUrl) available.push('custom');

    return available;
  }
}