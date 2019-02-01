import assert from 'assert';
import path from 'path';
import test from 'asia';
import fs from 'fs-extra';
import dedent from 'dedent';
import simpleGit from 'simple-git/promise';

import release from '../src';
import { __dirname } from './cjs-globals';

test('basic', async () => {
  assert.strictEqual(typeof release, 'function');

  try {
    await release({ cwd: 'foo' });
  } catch (err) {
    assert.ok(/Cannot find module/.test(err.message));
  }
});

test('should detect new commits', async () => {
  const fakePkg = path.join(__dirname, 'fakepkg');

  await fs.remove(fakePkg);
  await fs.mkdirp(fakePkg);
  await fs.writeFile(
    path.join(fakePkg, 'package.json'),
    JSON.stringify({ name: '@tunnckocore/kokoko3' }, null, 2),
  );

  const git = simpleGit(fakePkg);
  await git.init();

  const localGitConfig = dedent`[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
    logallrefupdates = true
  [user]
    name = Foo Bar Baz
    email = foobar@example.com
  [commit]
    gpgsign = false`;

  await fs.writeFile(path.join(fakePkg, '.git', 'config'), localGitConfig);

  await git.add('./*');
  await git.commit('feat: initial blank release');
  await git.addTag('v1.1.0');

  await fs.writeFile(path.join(fakePkg, 'foo.txt'), 'bar');
  await git.add('./*');
  await git.commit('major(release): qxu quack');

  await fs.writeFile(path.join(fakePkg, 'fix2.txt'), '222xasas');
  await git.add('./*');
  await git.commit('fix: fo222222o bar baz');

  const [result] = await release({ cwd: fakePkg });

  assert.strictEqual(result.increment, 'major');
  assert.strictEqual(result.lastVersion, '1.1.0');
  assert.strictEqual(result.nextVersion, '2.0.0');
  fs.remove(fakePkg);
});
