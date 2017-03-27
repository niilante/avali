'use strict';

const is = require('is');

function newException(num, expectedType) {
  const err = new Error(`Argument #${num + 1}: Expected ${expectedType}`);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, avali); // eslint-disable-line no-use-before-define
  }

  return err;
}

const types = {
  any: { type: 'any', check: () => true },
  args: { type: 'arguments', check: is.args },
  arr: { type: 'array', check: is.array },
  bool: { type: 'boolean', check: is.bool },
  err: { type: 'error', check: is.error },
  func: { type: 'function', check: is.fn },
  nil: { type: 'nil', check: arg => is.nil(arg) || is.undef(arg) },
  num: { type: 'number', check: is.number },
  obj: { type: 'object', check: is.object },
  str: { type: 'string', check: is.string },
};

function humanize(arr) {
  if (arr.length < 2) {
    return arr[0];
  }

  arr.push(`${arr[0]} or ${arr[1]}`);
  return arr.slice(2).join(', ');
}

function avali(rules, args) {
  if (!is.array(rules)) {
    throw newException(0, 'array');
  }
  if (!is.args(args) && !is.array(args)) {
    throw newException(1, 'arguments or array');
  }

  rules.forEach((rule, index) => {
    const arg = args[index];
    const expectedTypes = [];
    const arr = rule.split(',').map(item => item.toLowerCase().trim());
    let isValid = false;

    for (const key of arr) {
      const { type, check } = types[key];
      expectedTypes.push(type);

      if (check(arg)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      throw newException(index, humanize(expectedTypes));
    }
  });
}

module.exports = avali;
