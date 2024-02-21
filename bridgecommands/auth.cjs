const { program } = require("commander");
const https = require('follow-redirects').https;
require('dotenv').config();
const colors = require("colors");
const fs = require("fs");
const path = require("path")

program
    .name('-auth')
    .description('Authenticate your cli instance')
    .option("--authCode <string>", "Specify the authCode you have got during the installation process")
    .parse();

if (!program.opts() || !program.opts().authCode) {
    program.outputHelp();
} else {
    try {
        const authCode = program.opts().authCode;

        var options = {
            'method': 'POST',
            'hostname': 'api.webflow.com',
            'path': '/oauth/access_token',
            'headers': {
                'Content-Type': 'application/json'
            },
            'maxRedirects': 20
        };

        var req = https.request(options, function(res) {
            var chunks = [];

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function(chunk) {
                var body = Buffer.concat(chunks);
                const bodyJson = JSON.parse(body.toString());
                if (bodyJson.error) {
                    console.log(colors.red(bodyJson));
                    return;
                }
                fs.writeFileSync(path.join(__dirname, '/../.env'), `ACCESS_TOKEN=${bodyJson.access_token}`)
                console.log(colors.green("Success your cli is now authenticated!"));
            });

            res.on("error", function(error) {
                console.error(colors.red(error));
            });
        });

        var postData = JSON.stringify({
            "client_id": "2e261b03f6714f214d4e974df390d8134af0a78a71dbfb9aab1497659773634a",
            "client_secret": "acf0d8fefaff9cfc373c8180404a5552d56ce17370d170e3c4829f043af699fb",
            "code": authCode,
            "grant_type": "authorization_code",
            "redirect_URI": "https://webflow-local-bridge.replit.app" //should change when i will deploy the app
        });

        req.write(postData);

        req.end();
    } catch (error) {
        console.log(colors.red(error.message));
    }
}