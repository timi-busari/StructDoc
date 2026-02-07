import { promises as fs } from 'fs';
import path from 'path';

async function pathExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(p: string) {
  const raw = await fs.readFile(p, 'utf8');
  return JSON.parse(raw) as any;
}

async function validate(projectPath = '.') {
  const abs = path.resolve(projectPath);
  const results: any = { valid: true, checks: [] };

  // 1. Path exists
  const exists = await pathExists(abs);
  results.checks.push({ check: 'path-exists', ok: exists, path: abs });
  if (!exists) results.valid = false;

  // 2. package.json present and contains Nest deps
  const pkgPath = path.join(abs, 'package.json');
  const hasPkg = await pathExists(pkgPath);
  let pkg: any = null;
  if (hasPkg) {
    try {
      pkg = await readJson(pkgPath);
    } catch (e: any) {
      results.checks.push({ check: 'package-json-parse', ok: false, error: String(e) });
      results.valid = false;
    }
  }
  results.checks.push({ check: 'package-json-present', ok: hasPkg, path: pkgPath });

  const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };
  const hasNest = Boolean(deps['@nestjs/core'] || deps['@nestjs/common']);
  results.checks.push({ check: 'nestjs-dependency', ok: hasNest });
  if (!hasNest) results.valid = false;

  // 3. Typical Nest entrypoints
  const mainTs = path.join(abs, 'src', 'main.ts');
  const nestCli = path.join(abs, 'nest-cli.json');
  const hasMainTs = await pathExists(mainTs);
  const hasNestCli = await pathExists(nestCli);
  results.checks.push({ check: 'src-main-ts', ok: hasMainTs, path: mainTs });
  results.checks.push({ check: 'nest-cli.json', ok: hasNestCli, path: nestCli });
  if (!hasMainTs && !hasNestCli) results.valid = false;

  // 4. TypeScript sources under src
  let tsFiles: string[] = [];
  try {
    const srcDir = path.join(abs, 'src');
    const files = await fs.readdir(srcDir);
    tsFiles = files.filter(f => f.endsWith('.ts'));
  } catch (e) {
    // ignore
  }
  const hasTs = tsFiles.length > 0;
  results.checks.push({ check: 'src-ts-files', ok: hasTs, count: tsFiles.length });
  if (!hasTs) results.valid = false;

  // 5. Optional: check for tsconfig.json
  const tsconfig = path.join(abs, 'tsconfig.json');
  const hasTsconfig = await pathExists(tsconfig);
  results.checks.push({ check: 'tsconfig.json', ok: hasTsconfig, path: tsconfig });

  // Print human-friendly summary
  if (results.valid) {
    console.log('VALID: Project looks like a NestJS TypeScript project.');
  } else {
    console.error('INVALID: Project failed validation checks.');
  }

  console.log(JSON.stringify(results, null, 2));
  process.exit(results.valid ? 0 : 2);
}

const argvPath = process.argv[2] || '.';
validate(argvPath).catch(err => {
  console.error('ERROR:', err);
  process.exit(3);
});
