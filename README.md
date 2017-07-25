# entry-hash-plugin
Modify the target file that references the webpack entry

## Usage

``` javascript
module.exports = {
    entry: ['./index.js', './index.html'],
    ...
    plugins: {
        new EntryPlugins({
            file: './index.html',
            toReplace: 'main.js'
        })
    }
    ...
}

```

> options

- file: the exported destination file
- toReplace: replacement text

## Example

```
// webpack  output
output: {
    filename: 'js/main.[hash:6].js',
    path: buildPath,
    publicPath: 'https://sm.baidu.com/'
}

// toReplace `main.js`
<script src="main.js"></script>

// result     use publicPath
<script src="https://sm.baidu.com/js/main.2062b5.js"></script>
```

