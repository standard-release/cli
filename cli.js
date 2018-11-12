#!/usr/bin/env node

'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');
const proc = require('process');

const ded = require('dedent');
const isCI = require('is-ci');
const parser = require('mri');
const getPkg = require('@tunnckocore/package-json');
const { exec } = require('@tunnckocore/execa');

const release = require('./index');
const pkg = require('./package');

const argv = parser(proc.argv.slice(2), {
  default: {
    cwd: proc.cwd(),
    ci: true,
  },
});

getPkg(pkg.name)
  .then(({ version }) => (version !== pkg.version ? version : false))
  .catch((err) => {
    console.debug(`Error getting package metadata from the registry: ${err}`);
    console.debug("Don't worry, that is a check for latest cli version.");
  })
  .then((latestVersion) => {
    if (latestVersion) {
      console.log(`UPDATE AVAILABLE: v${latestVersion}`);
      console.log(
        'See:',
        `https://github.com/${pkg.repository}/releases/tag/v${latestVersion}`,
      );
      console.log('');
    }
    if (argv.ci && !isCI) {
      console.error('Publishing is only allowed on CI services!');
      console.error(
        'Try passing --no-ci flag to bypass this, if you are sure.',
      );
      proc.exit(1);
    }
  })
  .then(() => release(argv))
  .then(async (result) => {
    if (!result.increment && !result.nextVersion) {
      console.log('Skipping `npm publish` stage...');
      return null;
    }

    const token = argv.token || proc.env.NPM_TOKEN;
    if (!token) {
      throw new Error(
        'Expect --token to be passed or NPM_TOKEN environment variable to be set.',
      );
    }

    console.log(
      'Meta Info:',
      JSON.stringify(
        result,
        (x, v) => (typeof v === 'function' ? '[Function]' : v),
        2,
      ),
    );

    const defaultRegistry = 'https://registry.npmjs.org/';
    const registry = argv.registry || proc.env.NPM_REGISTRY || defaultRegistry;
    const content = ded`//registry.npmjs.org/:_authToken=${token}
    sign-git-tag=false
    git-tag-version=false
    allow-same-version=false
    `;

    const opts = {
      cwd: argv.cwd,
      stdio: 'inherit',
    };

    await util.promisify(fs.writeFile)(path.join(argv.cwd, '.npmrc'), content);
    await exec(`npm version ${result.nextVersion}`, opts);
    await exec(`npm publish --registry ${registry}`, opts);

    console.log('Successfully published.');
    return true;
  })
  .catch((err) => {
    console.error(err.stack);
    proc.exit(1);
  });
