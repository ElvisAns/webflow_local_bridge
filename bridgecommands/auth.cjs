const https = require('follow-redirects').https;
require('dotenv').config();
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const userconfig  = require('../user.config.cjs');

const authenticate = (authCode) => {
    try {
        var options = {
            'method': 'POST',
            'hostname': 'api.webflow.com',
            'path': '/oauth/access_token',
            'headers': {
                'Content-Type': 'application/json'
            },
            'maxRedirects': 20
        };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                const bodyJson = JSON.parse(body.toString());
                if (bodyJson.error) {
                    console.log(colors.red(bodyJson));
                    return;
                }
                fs.writeFileSync(path.join(__dirname, '/../.env'), `ACCESS_TOKEN=${bodyJson.access_token}`)
                console.log(colors.green("Success your cli is now authenticated!"));
            });

            res.on("error", function (error) {
                console.error(colors.red(error));
            });
        });

        req.on("error", (error) => {
            throw new Error(error);
        })

        var postData = JSON.stringify({
            "client_id": userconfig.client_id,
            "client_secret": userconfig.client_secret,
            "code": authCode,
            "grant_type": "authorization_code",
            "redirect_URI": "https://webflow-local-bridge-website.vercel.app" //should change when i will deploy the app
        });

        req.write(postData);

        req.end();
    } catch (error) {
        console.log(colors.red(error.message));
    }
}

module.exports = authenticate;