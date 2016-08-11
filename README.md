# avali [![Dependency Status][depstat-image]][depstat-url]

> Arguments validation

## Install

```
$ npm install --save avali
```

## Usage

```js
const avali = require('avali');

function something(a, b) {
  avali(['str', 'arr, nil'], arguments);
  // ...
}
```

## API

### avali(rules, args)

#### rules

Type: `array`

Each argument is an array element, which is a string with the valid types listed, separated by commas.

rule | description
---- | -----------
any    | any type
str    | string
num    | number
bool    | boolean
func    | function
arr    | array
err    | error
nil    | null or undefined
obj    | object
args    | arguments

If necessary, set the optional parameter, use `nil` in together with other types.

#### args

Type: `arguments` or `array`

## License

[MIT](LICENSE.md) © [Timofey Dergachev](https://exeto.me/)

[depstat-url]: https://david-dm.org/exeto/avali#info=Dependencies
[depstat-image]: https://img.shields.io/david/exeto/avali.svg?style=flat-square
