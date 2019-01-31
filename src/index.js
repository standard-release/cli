import path from 'path';
import proc from 'process';
import gitCommitsSince from 'git-commits-since';
import detector from 'detect-next-version';

export default async function release(options) {
  const opts = Object.assign({ cwd: proc.cwd() }, options);

  // TODO: in next minor
  if (opts.monorepo) {
    return {};
  }

  const { default: pkg } = await import(path.join(opts.cwd, 'package.json'));
  const { plugin, ...opt } = opts;
  const { rawCommits } = await gitCommitsSince(opt);

  if (rawCommits.length === 0) {
    throw new Error('No commits since last tag.');
  }

  return detector(rawCommits, Object.assign({}, opt, { name: pkg.name }));
}
