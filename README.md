# istanbul-loader

This is a webpack loader that uses
[istanbul-lib-instrument](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-lib-instrument)
to add code coverage instrumentation to JavaScript files.

## Installation

Install with

```
npm install @theintern/istanbul-loader --save-dev
```

## Usage

Install the loader in a project and add an entry for it to the project's
webpack.config:

```js
module: {
    rules: [
        {
            test: /src\/.*\.ts$/,
            use: '@theintern/istanbul-loader'
        },
		...
    ]
}
```

Note that the istanbul-loader should be run _after_ transpilers such as
TypeScript. This means that it should come _before_ transpilers in a loader
list, or use `enforce: 'post'`:

```js
rules: [
    {
	    test: /src\/.(\.ts$/,
		use: [ '@theintern/istanbul-loader', 'ts-node' ]
	},
	...
]
```

or

```js
rules: [
    {
	    test: /src\/.(\.ts$/,
		use: '@theintern/istanbul-loader',
		enforce: 'post'
	},
	...
]
```

## Configuration

The rule test should only match source files, not all `.ts` or `.js` files, so
as not to instrument tests or support files.

Options can be passed using the standard webpack `options` property:

```js
rules: [
    {
	    test: /src\/.(\.ts$/,
		use: {
			loader: '@theintern/istanbul-loader',
			options: { config: 'tests/intern.json' }
		}
	},
	...
]
```

Currently the only option used by the loader is 'config', which should point to
an
[Intern config file](https://github.com/theintern/intern/blob/master/docs/configuration.md#config-file).
The loader will use values for `coverageVariable` and `instrumenterOptions`
from the Intern config, if present.

## License

Intern is a [JS Foundation](https://js.foundationn) project offered under the
[New BSD](LICENSE) license.

© [SitePen, Inc.](http://sitepen.com) and its [contributors](https://github.com/theintern/intern/graphs/contributors)
