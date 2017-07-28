/**
 * Created by Blaite on 2017/7/25.
 */
const fs = require('fs');
const path = require('path');

function EntryHashPlugins(options) {
    if (options.file)
        this.matchFile = options.file;
    if (options.toReplace) 
        this.toReplace = options.toReplace;
    if (options.publicPath) 
        this.publicPath = options.publicPath;
}

function checkHash(filename) {
    const results = filename.match(/\[hash\:??(\d*?)\]/i);
    if (results) return results[1] || 0;
    else return undefined
}

function replaceInFile(filePath, toReplace, replacement) {
    let file = fs.readFileSync(filePath, 'utf8');
    const outFile = file.replace(new RegExp(toReplace, 'g'), function (match) {
        console.log('Replacing in %s: %s => %s', filePath, match, replacement);
        return replacement;
    });
    fs.writeFileSync(filePath, outFile);
}

EntryHashPlugins.prototype.apply = function(compiler) {
    let _this = this;
    const targetFilename = compiler.options.output.filename;
    const targetPublicPath = this.publicPath || compiler.options.output.publicPath || '';
    const targetPath = compiler.options.output.path;
    const targetFile = path.resolve(targetPath, this.matchFile);

    compiler.plugin('done', function(stats) {
        const hash = stats.hash;
        const hashLength = checkHash(targetFilename);
        const subHash = hash.substr(0, hashLength) || '';
        const replacement = targetFilename.replace(/\[hash:??(\d*?)\]/, subHash);
        replaceInFile(targetFile, _this.toReplace, targetPublicPath + replacement);
    });
};

module.exports = EntryHashPlugins;