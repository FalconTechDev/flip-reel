import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function fail(message) {
  console.error(`release: ${message}`)
  process.exit(1)
}

function run(command) {
  execSync(command, { stdio: 'inherit' })
}

function capture(command) {
  return execSync(command).toString().trim()
}

function bump(version, kind) {
  const [major, minor, patch] = version.split('.').map(Number)
  if (kind === 'major') return `${major + 1}.0.0`
  if (kind === 'minor') return `${major}.${minor + 1}.0`
  if (kind === 'patch') return `${major}.${minor}.${patch + 1}`
  return fail(`unknown bump "${kind}" — use patch, minor, major or x.y.z`)
}

function replaceOnce(path, from, to) {
  const source = readFileSync(path, 'utf8')
  if (!source.includes(from)) fail(`${path} does not contain "${from}"`)
  writeFileSync(path, source.replaceAll(from, to))
}

const request = process.argv[2]
if (!request) fail('usage: pnpm release <patch|minor|major|x.y.z>')

if (capture('git status --porcelain')) fail('working tree is not clean')
if (capture('git branch --show-current') !== 'main') fail('releases are cut from main')

const current = JSON.parse(readFileSync('package.json', 'utf8')).version
const next = /^\d+\.\d+\.\d+$/.test(request) ? request : bump(current, request)
console.log(`release: ${current} -> ${next}`)

const changelog = readFileSync('CHANGELOG.md', 'utf8')
if (!changelog.includes(`## ${next}`)) {
  fail(`CHANGELOG.md has no "## ${next}" section — write the release notes first`)
}

const manifests = ['package.json']
for (const group of ['packages', 'apps']) {
  for (const name of readdirSync(group)) {
    const manifest = join(group, name, 'package.json')
    if (existsSync(manifest)) manifests.push(manifest)
  }
}
for (const manifest of manifests) {
  replaceOnce(manifest, `"version": "${current}"`, `"version": "${next}"`)
}

replaceOnce(
  'packages/core/src/runtime/global-runtime.ts',
  `FLIP_REEL_VERSION = '${current}'`,
  `FLIP_REEL_VERSION = '${next}'`,
)
replaceOnce('README.md', `@flipatic/flip-reel@${current}`, `@flipatic/flip-reel@${next}`)

console.log(`release: bumped ${manifests.length} manifests, runtime version and README`)

run('pnpm lint')
run('pnpm typecheck')
run('pnpm exec turbo run test build --force')

run('git add -A')
run(`git commit -m "chore: release ${next}"`)
run(`git tag v${next}`)

console.log(`
release: ${next} is committed and tagged locally — nothing was pushed.

Review, then publish with:

  git push origin main
  git push origin v${next}

The tag push triggers .github/workflows/release.yml, which publishes
@flipatic/* to npm via OIDC trusted publishing.
`)
