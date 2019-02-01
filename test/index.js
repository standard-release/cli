import path from 'path';
import test from 'asia';
import fs from 'fs-extra';
import dedent from 'dedent';
import simpleGit from 'simple-git/promise';

import release from '../src';
import { __dirname } from './cjs-globals';

async function gitSetup(dir, initial) {
  const git = simpleGit(dir);
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

  await fs.outputFile(path.join(dir, '.git', 'config'), localGitConfig);
  await fs.outputFile(path.join(dir, 'readme.md'), '# monorepo root');

  if (initial) {
    await git.add('./*');
    await git.commit('chore: initial commit');
  }

  return git;
}

test('basic', async (t) => {
  t.strictEqual(typeof release, 'function');

  try {
    await release({ cwd: 'foo' });
  } catch (err) {
    t.ok(/Cannot find module/.test(err.message));
  }
});

test('should detect new commits', async (t) => {
  const fakePkg = path.join(__dirname, 'fakepkg');

  await fs.remove(fakePkg);
  await fs.ensureDir(fakePkg);
  await fs.outputJson(path.join(fakePkg, 'package.json'), {
    name: '@tunnckocore/kokoko3',
  });

  const git = await gitSetup(fakePkg);

  await git.add('./*');
  await git.commit('feat: initial blank release');
  await git.addTag('v1.1.0');

  await fs.outputFile(path.join(fakePkg, 'foo.txt'), 'bar');
  await git.add('./*');
  await git.commit('major(release): qxu quack');

  await fs.outputFile(path.join(fakePkg, 'fix2.txt'), '222xasas');
  await git.add('./*');
  await git.commit('fix: fo222222o bar baz');

  const result = await release({ cwd: fakePkg });
  console.log(result);
  t.strictEqual(result.increment, 'major');
  t.strictEqual(result.lastVersion, '1.1.0');
  t.strictEqual(result.nextVersion, '2.0.0');
  fs.remove(fakePkg);
});

/* eslint-disable max-statements */
test('should work for monorepo setups', async () => {
  const fakeMonorepo = path.join(__dirname, 'fake-monorepo');

  // the `foo-bar-baz-qux` package
  const fakePkgOne = path.join(fakeMonorepo, 'packages', 'foo-bar-baz-qux');

  // the `@tunnckocore/qq5` package
  const fakePkgTwo = path.join(fakeMonorepo, '@tunnckocore', 'qq5');

  // the `@tunnckocore/kokoko3` package
  const fakePkgTree = path.join(fakeMonorepo, '@tunnckocore', 'kokoko3');

  async function createFile(pkg, filename, content) {
    const rand = Math.floor(Math.random());
    await fs.outputJson(path.join(pkg, filename || rand), content || { rand });
  }

  await fs.ensureDir(fakeMonorepo);
  const git = await gitSetup(fakeMonorepo, true);

  await createFile(fakeMonorepo, 'package.json', {
    private: true,
    name: 'some-monorepo-root',
  });

  /**
   * add `foo-bar-baz-qux`
   */
  let name = 'foo-bar-baz-qux';
  await createFile(fakePkgOne, 'package.json', { name });

  await git.add('./*');
  await git.commit(`chore: add \`${name}\` package`);
  await git.addTag(`${name}@1.0.4`);

  /**
   * add `@tunnckocore/qq5`
   */
  name = '@tunnckocore/qq5';
  await createFile(fakePkgTwo, 'package.json', { name });

  await git.add('./*');
  await git.commit(`chore: add \`${name}\` package`);
  await git.addTag(`${name}@0.1.0`);

  /**
   * add `@tunnckocore/kokoko3`
   */
  name = '@tunnckocore/kokoko3';
  await createFile(fakePkgTree, 'package.json', { name });

  await git.add('./*');
  await git.commit(`chore: add \`${name}\` package`);
  await git.addTag(`${name}@1.1.0`);

  /**
   * Change only inside `@tunnckocore/qq5` and `foo-bar-baz-qux`
   *
   * TODO: when implemented
   */

  // await createFile(fakePkgOne, 'some-new-file');
  // await createFile(fakePkgTwo, 'yeah-new-new');

  /**
   * Get the results
   *
   * TODO: when implemented
   */
  const results = await release({ cwd: fakeMonorepo, monorepo: true });
  console.log(results);

  /**
   * Cleanup the whole monorepo
   */
  fs.remove(fakeMonorepo);
});
