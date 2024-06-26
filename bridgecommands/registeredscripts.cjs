const https = require('follow-redirects').https;
const userconfig = require('../user.config.cjs');
require('dotenv').config();

const registered_scripts = (options) => {
    const offset = options.offset ? program.opts().offset : 0;
    const limit = options.limit ? program.opts().limit : 100;

    try {
        const options = {
            'method': 'GET',
            'hostname': 'api.webflow.com',
            'path': `/v2/sites/${userconfig.site_id}/registered_scripts?limit=${limit}&offset=${offset}`,
            'headers': {
                'accept': 'application/json',
                'authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            },
            'maxRedirects': 20
        };

        const req = https.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                const json_body = JSON.parse(body);
                console.log(json_body);
            });

            res.on("error", function (error) {
                console.error(error);
            });
        });
        
        req.on("error", (error) => {
            throw new Error(error);
        })
        req.end();
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = registered_scripts;