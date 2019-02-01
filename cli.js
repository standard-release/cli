#!/usr/bin/env node

'use strict';

const path = require('path');
const proc = require('process');
const parser = require('mri');
const esmLoader = require('esm');
const prettyConfig = require('@tunnckocore/pretty-config');

const esmRequire = esmLoader(module);

function interop(x) {
  if (Object.keys(x).length === 1 && x.default) {
    return x.default;
  }
  return x;
}

const mod = esmRequire(path.join(__dirname, 'src', 'cli.js'));
const cli = interop(mod);

const argv = parser(proc.argv.slice(2), {
  default: {
    cwd: proc.cwd(),
    ci: true,
    'sign-git-tag': false,
    'git-tag-version': false,
  },
  alias: {
    'dry-run': ['dryRun', 'dry'],
    'sign-git-tag': ['signGitTag'],
    'git-tag-version': ['gitTagVersion'],
  },
});

prettyConfig('standard-release', { cwd: argv.cwd })
  .then((cfg) => {
    const opts = Object.assign({}, argv, cfg);

    return cli(opts, proc.env);
  })
  .catch(console.error);
