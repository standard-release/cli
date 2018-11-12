import path from 'path';
import proc from 'process';
import gitCommitsSince from 'git-commits-since';
import detector from 'detect-next-version';

export default async function release(options) {
  const opts = Object.assign({ cwd: proc.cwd() }, options);
  const { default: pkg } = await import(path.join(opts.cwd, 'package.json'));
  const { rawCommits } = await gitCommitsSince(opts);

  return detector(pkg.name, rawCommits);
}
