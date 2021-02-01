
/** @type {string} */
let hostname = process.env.HOST || process.env.HOSTNAME || 'http://localhost';

hostname = hostname.trim();
if (hostname.endsWith('/')) {
    hostname = hostname.substring(0, hostname.length - 1);
}

module.exports = {
    Hostname: hostname,
};
