import fs from 'fs';
import util from 'util';
import path from 'path';
import dedent from 'dedent';
import { exec } from '@tunnckocore/execa';
import registryUrl from 'registry-url';

/* eslint-disable import/prefer-default-export */

export async function npm(options, env, results) {
  const opts = Object.assign(
    { 'sign-git-tag': false, 'git-tag-version': false },
    options,
  );
  const token = opts.token || env.NPM_TOKEN;
  if (!token) {
    throw new Error(
      'Expect --token to be passed or NPM_TOKEN environment variable to be set.',
    );
  }

  const registry = opts.registry || env.NPM_REGISTRY || registryUrl();
  let reg = registry.replace(/https?:\/\//, '');
  reg = reg.endsWith('/') ? reg.slice(0, -1) : reg;

  const content = dedent`//${reg}/:_authToken=${token}
  sign-git-tag=${opts['sign-git-tag']}
  git-tag-version=${opts['git-tag-version']}
  allow-same-version=false
  `;

  await util.promisify(fs.writeFile)(path.join(opts.cwd, '.npmrc'), content);

  await results.map(async (result) => {
    if (!result.increment && !result.nextVersion) {
      console.log('Skipping `publish` stage for', result.name);
      return;
    }

    const pkgFolder = path.join(result.cwd, result.path);
    const execOpts = { cwd: pkgFolder, stdio: 'inherit' };

    if (opts.verbose) {
      console.log('Package Info:', result);
    }
    if (opts.dry) {
      console.log(result.name, result.lastVersion, '==>', result.nextVersion);
      return;
    }

    await exec(`npm version ${result.nextVersion}`, execOpts);
    await exec(`npm publish`, execOpts);
  });

  if (opts.dry) {
    console.log('Possible publish for', results.length, 'packages.');
    return;
  }
  console.log('Successfully published', results.length, 'packages.');
}
