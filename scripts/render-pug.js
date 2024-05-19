"use strict";
const fs = require("fs").promises;
const upath = require("upath");
const pug = require("pug");
const sh = require("shelljs");
const prettier = require("prettier");

module.exports = async function renderPug(filePath) {
    const destPath = filePath
        .replace(/src\/pug\//, "dist/")
        .replace(/\.pug$/, ".html");
    const srcPath = upath.resolve(upath.dirname(__filename), "../src");

    console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
    const html = await pug.renderFile(filePath, {
        doctype: "html",
        filename: filePath,
        basedir: srcPath,
    });

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test("-e", destPathDirname)) {
        sh.mkdir("-p", destPathDirname);
    }

    const prettified = await prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: "preserve",
        endOfLine: "lf",
        parser: "html",
        htmlWhitespaceSensitivity: "ignore",
    });

    await fs.writeFile(destPath, prettified);
};
