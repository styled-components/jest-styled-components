// The workspace link makes Vitest inline the entry whatever the config says, so these runs use a real node_modules layout.
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const fixtureDir = fileURLToPath(new URL('./fixture', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const workspaceModules = fileURLToPath(
  new URL('../node_modules', import.meta.url)
);

const run = (command, args, cwd) => {
  const { status } = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (status !== 0) {
    throw new Error(
      `"${command} ${args.join(' ')}" exited with status ${status} in ${cwd}`
    );
  }
};

const projectDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'jest-styled-components-installed-'))
);

try {
  const packageDir = join(projectDir, 'node_modules/jest-styled-components');
  mkdirSync(packageDir, { recursive: true });

  cpSync(fixtureDir, projectDir, { recursive: true });

  run(
    'npm',
    ['pack', '--ignore-scripts', '--silent', '--pack-destination', projectDir],
    repoRoot
  );
  run(
    'tar',
    [
      '-xzf',
      readdirSync(projectDir).find((file) => file.endsWith('.tgz')),
      '-C',
      packageDir,
      '--strip-components=1',
    ],
    projectDir
  );

  mkdirSync(join(projectDir, 'node_modules/@adobe'));
  symlinkSync(
    join(repoRoot, 'node_modules/@adobe/css-tools'),
    join(projectDir, 'node_modules/@adobe/css-tools')
  );

  for (const dependency of [
    'react',
    'react-dom',
    'react-test-renderer',
    'styled-components',
    'vitest',
  ]) {
    symlinkSync(
      join(workspaceModules, dependency),
      join(projectDir, 'node_modules', dependency)
    );
  }

  for (const config of ['vitest.config.mjs', 'vitest.default.config.mjs']) {
    run(
      join(workspaceModules, '.bin/vitest'),
      ['run', '--config', config, '--reporter=dot'],
      projectDir
    );
  }
} finally {
  rmSync(projectDir, { force: true, recursive: true });
}
