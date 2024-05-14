const https = require('follow-redirects').https;
require('dotenv').config();

const registered_onpage = (pageId)=>{
    try {
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

        req.on("error", (error) => {
            throw new Error(error);
        })
        req.end();
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = registered_onpage;