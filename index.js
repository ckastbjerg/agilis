'use strict';

const fs = require('fs');
const path = require('path');

const templateRegex = /template.*href="(.*\.html)"/;

function loadFile(filePath) {
    let res;

    try {
        res = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.warn('no local file named: ', filePath);
    }

    return res;
}

function createFileRecursively(filePath, fileMarkup, files, compiledFiles) {
    const lines = fileMarkup.split('\n');
    const newLines = [];
    const componentPath = filePath.match(/^(.*[\\\/])/)[0];

    lines.forEach(line => {
        const template = line.match(templateRegex);
        if (template) {
            const templatePath = `${componentPath}${template[1]}`;
            const compiledFile = compiledFiles[templatePath];
            if (!compiledFiles[templatePath]) {
                createFileRecursively(
                    templatePath,
                    files[templatePath],
                    files,
                    compiledFiles
                );
            }
            newLines.push(compiledFiles[templatePath]);
        } else {
            newLines.push(line);
        }
    });

    compiledFiles[filePath] = newLines.join('\n');
}

function getHtmlFiles(dir, filelist) {
    filelist = filelist || [];

    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            filelist = getHtmlFiles(filePath, filelist);
        } else if (file.indexOf('.html') !== -1) {
            filelist.push(filePath);
        }
    });

    return filelist;
}

module.exports = dir => {
    const compiledFiles = {};
    const files = {};
    const htmlFiles = getHtmlFiles(dir);

    htmlFiles.forEach(file => {
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        const newLines = [];
        const componentPath = file.match(/^(.*[\\\/])/)[0];

        lines.forEach(line => {
            const js = line.match(/script.*src="(.*)"/);
            const css = line.match(/link.*href="(.*\.css)"/);

            if (js) {
                const script = loadFile(`${componentPath}${js[1]}`);
                newLines.push(
                    script
                        ? `<script>(function() {\n${script}})()</script>`
                        : line
                );
            } else if (css) {
                const style = loadFile(`${componentPath}${css[1]}`);
                newLines.push(style ? `<style>\n${style}</style>` : line);
            } else {
                newLines.push(line);
            }
        });

        files[file] = newLines.join('\n');
    });

    const rootFileKey = Object.keys(files).sort(
        (a, b) => a.length - b.length
    )[0];
    const rootFile = files[rootFileKey];
    createFileRecursively(rootFileKey, rootFile, files, compiledFiles);

    return compiledFiles[rootFileKey];
};
