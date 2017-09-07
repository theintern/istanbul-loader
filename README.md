# istanbul-loader

This is a webpack loader that uses istanbul to add code coverage instrumentation to JavaScript files.

## Usage

Install the loader in a project and add an entry for it to the project's webpack.config:

```js
module: {
    rules: [
        {
            test: /src\/.*\.ts$/,
            use: { loader: 'istanbul-loader' },
            enforce: 'post'
        }    
    ]
}
```
