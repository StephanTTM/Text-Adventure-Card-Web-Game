const test = require('node:test');
const assert = require('node:assert/strict');

test('basic math works in server', () => {
  assert.strictEqual(1 + 1, 2);
});
