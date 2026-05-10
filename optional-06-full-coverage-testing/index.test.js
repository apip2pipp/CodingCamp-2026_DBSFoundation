import test from 'node:test';
import assert from 'node:assert/strict';

import sum from './index.js';

test('should return the sum of two positive numbers', () => {
  assert.equal(sum(2, 3), 5);
});

test('should return the sum when one of the numbers is zero', () => {
  assert.equal(sum(0, 3), 3);
});

test('should return 0 when the first parameter is not a number', () => {
  assert.equal(sum('2', 3), 0);
});

test('should return 0 when the second parameter is not a number', () => {
  assert.equal(sum(2, '3'), 0);
});

test('should return 0 when the first parameter is a negative number', () => {
  assert.equal(sum(-2, 3), 0);
});

test('should return 0 when the second parameter is a negative number', () => {
  assert.equal(sum(2, -3), 0);
});
