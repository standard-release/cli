import test from 'asia';
import release from '../src';

test('basic', async (t) => {
  t.strictEqual(typeof release, 'function');

  try {
    await release({ cwd: 'foo' });
  } catch (err) {
    t.ok(/Cannot find module/.test(err.message));
  }
});
