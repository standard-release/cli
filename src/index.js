import path from 'path';
import proc from 'process';
import { applyPlugins, plugins, parse, check } from 'parse-commit-message';
import gitCommitsSince from 'git-commits-since';
import detector from 'detect-next-version';

export default async function release(options) {
  const opts = Object.assign({ cwd: proc.cwd() }, options);
  const { default: pkg } = await import(path.join(opts.cwd, 'package.json'));
  const { rawCommits } = await gitCommitsSince(opts);

  // temporary, remove when update `parse-commit-message` to v3
  const commits = applyPlugins(plugins, check(parse(rawCommits)));

  return detector(pkg.name, commits);
}
