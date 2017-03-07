'use strict';

const fs = require('fs');
const path = require('path');

function loadFile(filePath) {
    let res;

    try {
        res = fs.readFileSync(filePath, 'utf8');
    } catch(err) {
        console.warn('no local file named: ', filePath)
    }

    return res;
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
};

module.exports = dir => {
    const htmlFiles = getHtmlFiles(dir);
    let files = {};

    htmlFiles.forEach(file => {
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        const newLines = [];
        const componentPath = file.match(/^(.*[\\\/])/)[0];

        lines.forEach(line => {
            const js = line.match(/script.*src="(.*)"/);
            const css = line.match(/link.*href="(.*\.css)"/);

            if (js) {
                const script = loadFile(`${componentPath}${js[1]}`);
                newLines.push(script ? `<script>\n${script}</script>` : line);
            } else if (css) {
                const style = loadFile(`${componentPath}${css[1]}`);
                newLines.push(style ? `<style>\n${style}</style>` : line);
            } else {
                newLines.push(line);
            }
        });

        files[file] = newLines.join('\n');
    });

    Object.keys(files).forEach(file => {
        const lines = files[file].split('\n');
        const newLines = [];
        const componentPath = file.match(/^(.*[\\\/])/)[0];

        lines.forEach(line => {
            const html = line.match(/template.*href="(.*\.html)"/);

            if (html) {
                newLines.push(files[`${componentPath}${html[1]}`]);
            } else {
                newLines.push(line);
            }
        });

        files[file] = newLines.join('\n');
    });

    return files[htmlFiles.pop()];
};
