# webpack-entry-hash-plugin
Modify the target file that references the webpack entry

## Usage

``` javascript
module.exports = {
    entry: ['./index.js', './index.html'],
    /*
    entry: {
        index: ['./index.js', './index.html']
    }
    */
    ...
    plugins: {
        new EntryPlugins({
            file: './index.html',
            // or template
            toReplace: 'main.js',
            // optional   toReplace: 'main.js?[name]=index',
            publicPath: 'xxxx.com'
            // optional   template example: {%$data.url%}
        })
    }
    ...
}

```

> options

- file: the exported destination file
- toReplace: replacement text
    - ?[name] = key : webpack replace [name]
- publicPath: prefix,instead of the output.publicPath