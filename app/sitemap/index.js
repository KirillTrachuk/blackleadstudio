const pages = require('./pages');
const { Hostname } = require('./hostname');

/** @typedef {pages.SitePage} SitePage */


/** @type {(SitePage & { output: string })[]} */
const pagesFlatten = [];

pages.forEach(page => {
    let path;

    if (page.outputFileName) {
        path = page.outputFileName;
    } else {
        path = `${page.id}/index.html`;
    }

    pagesFlatten.push({
        ...page,
        output: path,
    });
});

const result = {
    pages,
    pagesFlatten,
    Hostname,
};

module.exports = result;
