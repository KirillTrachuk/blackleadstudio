const { Hostname } = require('./hostname');

/**
 * @typedef {Object} SitePage
 * @property {string} id will be used as `{id}/index.html` for output file name unless `outputFileName` was set up
 * @property {string} templateName
 * @property {string=} outputFileName 'index.html' or 'pageName/index.html'
 * @property {string} title
 * @property {string=} metaTitle
 * @property {string} description
 * @property {string} cannonical
 * @property {string=} image
 * @property {string=} entryPoint
 * @property {{ [sectionName: string ]: SiteSection}} sections
*/

/** @typedef {any} SiteSection TODO */

const combine = (p1, p2) => `${p1}/${p2}`;

const DefaultTitle = 'Blacklead';
const DefaulMetatTitle = 'Blacklead - meta title';
const DefaultDescription = 'Blacklead - meta desc';
const imagePath = '';
/** @type {SitePage} */
const Home = {
    id: 'home',
    templateName: 'app/html/index.ejs',
    outputFileName: 'index.html',
    title: 'Blacklead',
    metaTitle: DefaulMetatTitle,
    description: DefaultDescription,
    cannonical: Hostname,
    image: imagePath,
    entryPoint: './app/js/pages/homePage.js',
    sections: {
        Hero: {
        },
    },
};

/** @type {SitePage[]} */
const pages = [
    Home,
];

module.exports = pages;
