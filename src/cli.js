import fs from 'fs';
import util from 'util';
import path from 'path';
import proc from 'process';
import { exec } from '@tunnckocore/execa';
import isCI from 'is-ci';
import ded from 'dedent';

import release from './index';

export default function releaseCli(pkg, argv) {
  return release(argv)
    .then(async (result) => {
      if (argv.ci && !isCI) {
        console.error('Publishing is only allowed on CI services!');
        console.error(
          'Try passing --no-ci flag to bypass this, if you are sure.',
        );
        proc.exit(1);
      }
      if (argv.dry) {
        console.log(JSON.stringify(result, null, 2));
        console.log(argv);
        return null;
      }
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
      const registry =
        argv.registry || proc.env.NPM_REGISTRY || defaultRegistry;
      const content = ded`//registry.npmjs.org/:_authToken=${token}
      sign-git-tag=false
      git-tag-version=false
      allow-same-version=false
      `;

      const opts = {
        cwd: argv.cwd,
        stdio: 'inherit',
      };

      await util.promisify(fs.writeFile)(
        path.join(argv.cwd, '.npmrc'),
        content,
      );
      await exec(`npm version ${result.nextVersion}`, opts);
      await exec(`npm publish --registry ${registry}`, opts);

      console.log('Successfully published.');
      return true;
    })
    .catch((err) => {
      console.error(err.stack);
      proc.exit(1);
    });
}
