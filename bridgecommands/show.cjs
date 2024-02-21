const { program } = require("commander");
const https = require('follow-redirects').https;
require('dotenv').config();

program
    .name('-show')
    .description('Retrieve remote scripts for a specific page')
    .option("--pageId <string>", "Specify the pageId")
    .parse();

if (!program.opts() || !program.opts().pageId) {
    program.outputHelp();
} else {
    try {
        const pageId = program.opts().pageId;
        const options = {
            'method': 'GET',
            'hostname': 'api.webflow.com',
            'path': `/v2/pages/${pageId}/custom_code`,
            'headers': {
                'accept': 'application/json',
                'authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            },
            'maxRedirects': 20
        };

        const req = https.request(options, function(res) {
            const chunks = [];

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function() {
                const body = Buffer.concat(chunks);
                const json_body = JSON.parse(body);
                console.log(json_body);
            });

            res.on("error", function(error) {
                console.error(error);
            });
        });

        req.end();
    } catch (error) {
        console.log(error.message);
    }
}