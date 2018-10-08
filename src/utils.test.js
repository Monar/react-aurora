/* eslint-env jest */
const utils = require('./utils');

test('mergeStyles', () => {
  expect(utils.mergeStyles({}, {})).toBe({});
});
