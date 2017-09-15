# istanbul-loader

This is a webpack loader that uses [istanbul-lib-instrument](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-lib-instrument) to add code coverage instrumentation to JavaScript files.

## Installation

Install with

```
npm install @theintern/istanbul-loader --save-dev
```

## Usage

Install the loader in a project and add an entry for it to the project's webpack.config:

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

Note that the istanbul-loader should be run _after_ transpilers such as TypeScript. This means that it should come _before_ transpilers in a loader list, or use `enforce: 'post'`:

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
