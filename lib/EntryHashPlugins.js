/**
 * Created by Blaite on 2017/7/25.
 */
const fs = require('fs');
const path = require('path');

function EntryHashPlugins(opts) {
    if (!opts instanceof Array) {
        opts = [opts];
    }

    this.options = opts;
}

function checkName(filename) {
    const results = filename.match(/\[name\]/i);
    if (results) return results[0] || null;
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
    this.options.forEach(item => {
        console.log(item)
        let targetFilename = compiler.options.output.filename;
        const targetPublicPath = item.publicPath || compiler.options.output.publicPath || '';
        const targetPath = compiler.options.output.path;
        let targetFile;
        if (item.file instanceof Array) {
            targetFile = item.file.map(itemFile => path.resolve(targetPath, itemFile));
        }
        else {
            targetFile = path.resolve(targetPath, item.file);
        }

        compiler.plugin('done', function(stats) {
            let toReplace = item.toReplace;
            const hash = stats.hash;
            const hashLength = checkHash(targetFilename);
            const keyName = checkName(targetFilename);
            if (keyName) {
                targetFilename = targetFilename.replace(/\[name\]/i, item.toReplace.match(/\[name\]=??(\w+)/)[1]);
                toReplace = toReplace.replace(/\?.+/, '');
            }
            const subHash = hash.substr(0, hashLength);
            const replacement = targetFilename.replace(/\[hash:??(\d*?)\]/, subHash);
            if (targetFile instanceof Array) {
                targetFile.forEach(file => {
                    replaceInFile(file, toReplace, targetPublicPath + replacement);
                })

            }
            else {
                replaceInFile(targetFile, toReplace, targetPublicPath + replacement);
            }
        });
    })
};

module.exports = EntryHashPlugins;