import test from 'node:test';
import assert from 'node:assert/strict';

import { sum } from './index.js';

test('should return the sum of two positive numbers', () => {
  assert.equal(sum(2, 3), 5);
});

test('should return the correct result for negative and positive numbers', () => {
  assert.equal(sum(-2, 3), 1);
});

test('should return zero when both numbers are zero', () => {
  assert.equal(sum(0, 0), 0);
});
