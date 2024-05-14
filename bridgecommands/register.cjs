const path = require('path');
const fs = require('fs');
var https = require('follow-redirects').https;
const userconfig = require('../user.config.cjs');
require('dotenv').config();
const colors = require("colors");
var crypto = require('crypto');


function cleanDisplayName(displayName) {
    const cleanedDisplayName = displayName.replace(/[^a-zA-Z0-9]/g, '');
    const trimmedDisplayName = cleanedDisplayName.slice(0, 50);
    return trimmedDisplayName;
}

const deploy = (({ file, version, location }) => {
    try {
        if (location !== 'footer' && location !== 'header') {
            throw new Error("Location must be 'header' or 'footer'");
        }
        location = location == 'footer' ? 'body' : 'head';
        const filePath = path.join(__dirname, '../scripts/', file);
        if (!filePath || !fs.existsSync(filePath)) {
            console.log(colors.red(`The filepath ${filePath} is not valid or file dont exist`));
        } else {
            const fileData = fs.readFileSync(filePath);
            const hash = crypto.createHash('sha256');
            hash.update(fileData, "utf8");
            const integrityHash = `sha256-${hash.digest().toString('base64')}`;
            let remotefiles = fs.readFileSync("./remote_files.json", 'utf8');
            remotefiles = remotefiles.length > 0 ? JSON.parse(remotefiles) : {};

            if (remotefiles[encodeURIComponent(`scripts__${file}`)] && remotefiles[encodeURIComponent(`scripts__${file}`)]['Location']) {
                const hostedLocation = version == "dev" ? `http://localhost:3000/${file}` : remotefiles[encodeURIComponent(`scripts__${file}`)]['Location']
                var options = {
                    'method': 'POST',
                    'hostname': 'api.webflow.com',
                    'path': `/v2/sites/${userconfig.site_id}/registered_scripts/inline`,
                    'headers': {
                        'accept': 'application/json',
                        'authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
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
                        const responseObj = JSON.parse(body.toString());
                        if (responseObj.message) {
                            console.log(colors.red(responseObj))
                        } else {
                            remotefiles[encodeURIComponent(`scripts__${file}`)] = { ...remotefiles[encodeURIComponent(`scripts__${file}`)], ...responseObj };
                            fs.writeFileSync("./remote_files.json", JSON.stringify(remotefiles, null, 2), 'utf-8');
                            console.log(colors.green(`The file at ${filePath} has been successfully registered!`));
                        }
                    });

                    res.on("error", function (error) {
                        console.error(colors.red(error));
                    });
                });
                var postData = JSON.stringify({
                    "canCopy": true,
                    sourceCode: `(function(){const script = document.createElement('script');script.src = '${hostedLocation}';script.type = 'text/javascript';script.crossorigin = 'anonymous';document.${location}.appendChild(script);})()`,
                    integrityHash,
                    "version": version == "dev" ? '0.0.1' : version,
                    "displayName": cleanDisplayName(`scripts__${file}`)
                });

                req.on("error", (error) => {
                    throw new Error(error);
                })
                req.write(postData);

                req.end();
            } else {
                console.log(colors.red("Please make sure the file has already been uploaded to your assets"))
            }
        }
    } catch (error) {
        console.log(colors.red(error.message));
    }
});

module.exports = deploy;