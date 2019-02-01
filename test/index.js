import path from 'path';
import test from 'asia';
import fs from 'fs-extra';
import dedent from 'dedent';
import simpleGit from 'simple-git/promise';

import release from '../src';
import { __dirname } from './cjs-globals';

const FAKE_MONO = path.join(__dirname, 'some-monorepo');
const FAKE_PKG = path.join(__dirname, 'kokoko3');

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

async function createFile(pkg, filename, content) {
  const rand = Math.floor(Math.random());
  await fs.outputJson(path.join(pkg, filename || rand), content || { rand });
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
  await fs.remove(FAKE_PKG);
  await fs.ensureDir(FAKE_PKG);

  await fs.createFile(FAKE_PKG, 'package.json', {
    name: '@tunnckocore/kokoko3',
  });

  const git = await gitSetup(FAKE_PKG);

  await git.add('./*');
  await git.commit('feat: initial blank release');
  await git.addTag('v1.1.0');

  await createFile(FAKE_PKG);
  await git.add('./*');
  await git.commit('major(release): qxu quack');

  await createFile(FAKE_PKG);
  await git.add('./*');
  await git.commit('fix: fo222222o bar baz');

  const [result] = await release({ cwd: FAKE_PKG });

  t.strictEqual(result.increment, 'major');
  t.strictEqual(result.lastVersion, '1.1.0');
  t.strictEqual(result.nextVersion, '2.0.0');
  fs.remove(FAKE_PKG);
});

/* eslint-disable max-statements */
test('should work for monorepo setups', async () => {
  // the `foo-bar-baz-qux` package
  const FAKE_1 = path.join(FAKE_MONO, 'packages', 'foo-bar-baz-qux');

  // the `@tunnckocore/qq5` package
  const FAKE_2 = path.join(FAKE_MONO, '@tunnckocore', 'qq5');

  // the `@tunnckocore/kokoko3` package
  const FAKE_3 = path.join(FAKE_MONO, '@tunnckocore', 'kokoko3');

  await fs.remove(FAKE_MONO);
  await fs.ensureDir(FAKE_MONO);

  const git = await gitSetup(FAKE_MONO, true);

  await createFile(FAKE_MONO, 'package.json', {
    private: true,
    name: 'some-monorepo-root',
  });

  /**
   * add `foo-bar-baz-qux`
   */
  let name = 'foo-bar-baz-qux';
  await createFile(FAKE_1, 'package.json', { name });

  await git.add('./*');
  await git.commit(`chore: add \`${name}\` package`);
  await git.addTag(`${name}@1.0.4`);

  /**
   * add `@tunnckocore/qq5`
   */
  name = '@tunnckocore/qq5';
  await createFile(FAKE_2, 'package.json', { name });

  await git.add('./*');
  await git.commit(`chore: add \`${name}\` package`);
  await git.addTag(`${name}@0.1.0`);

  /**
   * add `@tunnckocore/kokoko3`
   */
  name = '@tunnckocore/kokoko3';
  await createFile(FAKE_3, 'package.json', { name });

  await git.add('./*');
  await git.commit(`chore: add \`${name}\` package`);
  await git.addTag(`${name}@1.1.0`);

  /**
   * Change only inside `@tunnckocore/qq5` and `foo-bar-baz-qux`
   *
   * TODO: when implemented
   */

  // await createFile(FAKE_1, 'some-new-file');
  // await createFile(fakePkgTwo, 'yeah-new-new');

  /**
   * Get the results
   *
   * TODO: when implemented
   */
  const results = await release({ cwd: FAKE_MONO, monorepo: true });
  console.log(results);

  /**
   * Cleanup the whole monorepo
   */
  fs.remove(FAKE_MONO);
});
