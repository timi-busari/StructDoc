import fs from 'fs';
import path from 'path';
import { extractMetadata } from '../scripts/extract-metadata';
import { normalizeMetadata } from '../scripts/normalize-metadata';
import { enrichMetadataWithAgents } from '../scripts/enrich-metadata-agentic';
import { generateDocs } from '../scripts/generate-docs';

/**
 * StructDoc In-Memory Pipeline
 *
 * Chains all four stages without writing intermediate files to disk.
 * Intermediate data is passed directly between stages as plain objects,
 * which is faster and avoids stale-state bugs from leftover .temp/ files.
 *
 * The .temp/ directory is still used by the cache (enrichment-cache.json)
 * so subsequent runs benefit from incremental caching.
 *
 * Standalone scripts (extract-metadata.ts etc.) still work independently
 * for debugging by using `require.main === module` guards.
 */

export interface PipelineOptions {
  /** Absolute path to the NestJS project root to document */
  projectPath: string;
  /** Directory where openapi.json and api-docs.md will be written */
  outputDir: string;
  /** When true emit verbose progress logs */
  verbose?: boolean;
  /** Use the agentic enrichment workflow (default: true) */
  agentic?: boolean;
}

export interface PipelineResult {
  /** Number of controllers discovered */
  controllers: number;
  /** Number of endpoints documented */
  endpoints: number;
  /** Number of component schemas generated */
  schemas: number;
  /** Absolute path to the written openapi.json */
  openapiFile: string;
  /** Absolute path to the written api-docs.md */
  markdownFile: string;
  /** Wall-clock time for the whole run in milliseconds */
  durationMs: number;
}

export class Pipeline {
  private opts: Required<PipelineOptions>;

  constructor(options: PipelineOptions) {
    this.opts = {
      verbose: false,
      agentic: true,
      ...options,
    };
  }

  private log(msg: string): void {
    console.log(msg);
  }

  private debug(msg: string): void {
    if (this.opts.verbose) console.log(msg);
  }

  /**
   * Execute the full extract → normalize → enrich → generate pipeline
   * entirely in memory and return a result summary.
   */
  async run(): Promise<PipelineResult> {
    const t0 = Date.now();
    const { projectPath, outputDir, agentic } = this.opts;

    this.log('🚀 Starting StructDoc pipeline (in-memory)...');

    // Ensure output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // ── Stage 1: Extract ──────────────────────────────────────────────────
    this.log('📦 [1/4] Extracting metadata from controllers...');
    const rawMetadata = await extractMetadata(projectPath);
    const endpointCount = rawMetadata.controllers.reduce(
      (n: number, c: { endpoints: unknown[] }) => n + c.endpoints.length,
      0,
    );
    this.debug(`   → ${rawMetadata.controllers.length} controllers, ${endpointCount} endpoints`);

    // ── Stage 2: Normalize ────────────────────────────────────────────────
    this.log('🔧 [2/4] Normalizing to OpenAPI structure...');
    const normalizedMetadata = await normalizeMetadata(rawMetadata, projectPath);
    this.debug(`   → ${Object.keys(normalizedMetadata.components.schemas).length} schemas built`);

    // ── Stage 3: Enrich ───────────────────────────────────────────────────
    this.log(`🤖 [3/4] ${agentic ? 'AI-agent' : 'Template'} enrichment...`);
    const enrichedMetadata = await enrichMetadataWithAgents(normalizedMetadata);

    // ── Stage 4: Generate ─────────────────────────────────────────────────
    this.log('📝 [4/4] Generating documentation...');
    const openapiFile = path.join(outputDir, 'openapi.json');
    const markdownFile = path.join(outputDir, 'api-docs.md');
    await generateDocs(enrichedMetadata, openapiFile, markdownFile);

    const durationMs = Date.now() - t0;
    this.log(`✅ Pipeline complete in ${(durationMs / 1000).toFixed(1)}s`);

    return {
      controllers: rawMetadata.controllers.length,
      endpoints: endpointCount,
      schemas: Object.keys(normalizedMetadata.components.schemas).length,
      openapiFile,
      markdownFile,
      durationMs,
    };
  }
}
