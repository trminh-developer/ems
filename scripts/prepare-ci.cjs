const { createRequire } = require('node:module');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const backendRequire = createRequire(path.resolve(__dirname, '../backend/package.json'));

try {
  backendRequire('sqlite3');
} catch (error) {
  // Some SQLite prebuilds target a newer glibc than the Vercel/GitLab runner.
  if (process.platform !== 'linux' || error.code !== 'ERR_DLOPEN_FAILED' || !/GLIBC_[\d.]+.*not found/.test(error.message)) {
    throw error;
  }

  console.log('Rebuilding SQLite for this Linux runtime before running CI tests.');
  const sqliteManifest = backendRequire.resolve('sqlite3/package.json');
  const sqliteRequire = createRequire(sqliteManifest);
  const nodeGyp = sqliteRequire.resolve('node-gyp/bin/node-gyp.js');
  const napiVersion = Math.max(...sqliteRequire('./package.json').binary.napi_versions);
  const build = spawnSync(process.execPath, [nodeGyp, 'rebuild', `--napi_build_version=${napiVersion}`], {
    cwd: path.dirname(sqliteManifest),
    stdio: 'inherit',
  });
  if (build.error) throw build.error;
  if (build.status !== 0) process.exit(build.status ?? 1);
  backendRequire('sqlite3');
}
