#!/usr/bin/env node

'use strict';

const proc = require('process');
const parser = require('mri');

const pkg = require('./package');
const cli = require('./src/cli');

const argv = parser(proc.argv.slice(2), {
  default: {
    cwd: proc.cwd(),
    ci: true,
  },
});

cli(pkg, argv).catch(console.error);
