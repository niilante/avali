import isPlainObject from 'lodash.isplainobject';

function newException(num, expectedType) {
  const err = new Error(`Argument #${num + 1}: Expected ${expectedType}`);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, avali); // eslint-disable-line no-use-before-define
  }

  return err;
}

const types = {
  any: { type: 'any', check: () => true },
  str: { type: 'string', check: arg => typeof arg === 'string' },
  num: { type: 'number', check: arg => typeof arg === 'number' },
  bool: { type: 'boolean', check: arg => typeof arg === 'boolean' },
  func: { type: 'function', check: arg => typeof arg === 'function' },
  arr: { type: 'array', check: arg => Array.isArray(arg) },
  err: { type: 'error', check: arg => arg instanceof Error },
  nil: { type: 'nil', check: arg => arg == undefined }, // eslint-disable-line eqeqeq
  obj: { type: 'object', check: arg => isPlainObject(arg) },
  args: {
    type: 'arguments',
    check: arg => (
      Object.prototype.toString.call(arg) === '[object Arguments]' &&
      Object.hasOwnProperty.call(arg, 'callee')
    ),
  },
};

function humanize(arr) {
  if (arr.length < 2) {
    return arr[0];
  }

  arr.push(`${arr[0]} or ${arr[1]}`);
  return arr.slice(2).join(', ');
}

const avali = module.exports = function (rules, args) {
  if (!types.arr.check(rules)) {
    throw newException(0, 'array');
  }
  if (!types.args.check(args) && !types.arr.check(args)) {
    throw newException(1, 'arguments or array');
  }

  rules.forEach((rule, index) => {
    const hash = rule.split(',').map(item => item.toLowerCase().trim());
    const arg = args[index];
    const expectedTypes = [];

    const result = hash.reduce((value, current) => {
      const { type, check } = types[current];
      expectedTypes.push(type);

      if (check(arg)) {
        return true;
      }

      return value;
    }, false);

    if (!result) {
      throw newException(index, humanize(expectedTypes));
    }
  });
};
