import fs from 'fs';
import util from 'util';
import path from 'path';
import { exec } from '@tunnckocore/execa';
import rc from 'rc';

/* eslint-disable import/prefer-default-export */

export async function npm(options, env, results) {
  const opts = Object.assign({}, options);

  await results.map(async (result) => {
    if (!result.increment && !result.nextVersion) {
      console.log('Skipping `publish` stage for', result.name);
      return;
    }

    const pkgFolder = opts.monorepo
      ? path.join(opts.cwd, result.path)
      : opts.cwd;

    const localPkg = await import(path.join(pkgFolder, 'package.json'));
    const cfg = normalizeConfig(options, env, localPkg.publishConfig);

    if (!cfg.token) {
      throw new Error(
        'Expect --token, NPM_TOKEN or _authToken in local/global .npmrc',
      );
    }

    await util.promisify(fs.writeFile)(
      path.join(opts.cwd, '.npmrc'),
      `${cfg.reg}:_authToken=${cfg.token}\nsign-git-tag=${
        opts.signGitTag
      }\ngit-tag-version=${opts.gitTagVersion}\n`,
    );

    const execOpts = { cwd: pkgFolder, stdio: 'inherit' };

    if (opts.verbose) {
      console.log('Package Info:', result);
      console.log('Package Folder', pkgFolder);
    }

    console.log(result.name, result.lastVersion, '==>', result.nextVersion);

    if (opts.dryRun) {
      return;
    }

    await exec(`npm version ${result.nextVersion}`, execOpts);

    const publishCmd = [
      'npm publish',
      result.nextVersion,
      '--tag',
      cfg.tag,
      '--access',
      cfg.access,
    ];

    await exec(publishCmd.join(' '), execOpts);
  });

  if (opts.dryRun) {
    console.log('Possible publish for', results.length, 'packages.');
    return;
  }
  console.log('Successfully published', results.length, 'packages.');
}

/**
 * Normalize and synchronize the config from several places.
 * Respect order: 1) options/flags, 2) env vars, 3) pkg.publishConfig,
 * 4) local .npmrc, 5) global .npmrc
 *
 * Returns merged config.
 *
 * @param {*} options
 * @param {*} env
 * @param {*} publishConfig
 */
function normalizeConfig(options, env, publishConfig) {
  const opts = Object.assign({}, options);
  const envs = Object.assign({}, env);
  const cfg = Object.assign({}, publishConfig);

  const npmrc = rc('npm', cfg);

  let registry =
    opts.registry || envs.NPM_REGISTRY || cfg.registry || npmrc.config_registry;

  registry = registry.includes('registry.yarnpkg.com')
    ? 'registry.npmjs.org'
    : registry;

  let regClean = registry.replace(/https?:\/\//, '');
  regClean = regClean.endsWith('/') ? regClean.slice(0, -1) : regClean;

  const rcToken = npmrc[`//${regClean}/:_authToken`];

  return {
    reg: `//${regClean}/`,
    registry,
    tag: cfg.tag || npmrc.tag,
    access: opts.access || cfg.access || npmrc.access,
    token: opts.token || envs.NPM_TOKEN || cfg.token || rcToken,
  };
}
