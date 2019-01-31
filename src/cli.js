import proc from 'process';
import path from 'path';
import isCI from 'is-ci';

import { npm } from './plugins';
import release from './index';

export default function releaseCli(argv, env) {
  return release(argv, env)
    .then(async (results) => {
      if (argv.ci && !isCI) {
        console.error('Publishing is only allowed on CI services!');
        console.error(
          'Try passing --no-ci flag to bypass this, if you are sure.',
        );
        proc.exit(1);
      }
      if (argv.verbose) {
        console.log('Meta info:', serialize(results));
        console.log('Flags / Options:', argv);
      }

      // should be path to file
      if (argv.plugin) {
        // with `export default () => {}` or
        // named exports `export async function fooPlugin(argv, env, results) {}`
        const plugins = await import(path.resolve(argv.cwd, argv.plugin));

        await Object.keys(plugins)
          .filter(
            (exportName) =>
              exportName.endsWith('Plugin') || exportName === 'default',
          )
          .map(async (name) => {
            const plugin = plugins[name];
            await plugin(argv, env, results);
          });
      } else {
        await npm(argv, env, results);
      }

      return true;
    })
    .catch((err) => {
      console.error(err.stack);
      proc.exit(1);
    });
}

function serialize(val) {
  return JSON.stringify(
    val,
    (x, v) => (typeof v === 'function' ? '[Function]' : v),
    2,
  );
}
