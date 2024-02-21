const { program } = require("commander");
const path = require('path');
const fs = require('fs');
var https = require('follow-redirects').https;
const userconfig = require('../user.config.cjs');
require('dotenv').config();
const colors = require("colors");

var crypto = require('crypto');

program
    .name("-register")
    .description('Register the script to the list of registered scripts')
    .option("--file <string>", "relative path of the file to the scripts/ folder eg. test.js if the file is right inside the scripts folder")
    .option("--version <string>", "semantic version eg. 1.0.0, you can use dev as well")
    .parse();

var file = program.opts().file;
var version = program.opts().version;

if (!file || !version) {
    program.outputHelp();
    return;
}

function cleanDisplayName(displayName) {
    const cleanedDisplayName = displayName.replace(/[^a-zA-Z0-9]/g, '');
    const trimmedDisplayName = cleanedDisplayName.slice(0, 50);
    return trimmedDisplayName;
}

try {
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
                'path': `/v2/sites/${userconfig.site_id}/registered_scripts/hosted`,
                'headers': {
                    'accept': 'application/json',
                    'authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
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
                    const responseObj = JSON.parse(body.toString());
                    if (responseObj.message) {
                        console.log(colors.red(responseObj))
                    } else {
                        remotefiles[encodeURIComponent(`scripts__${file}`)] = {...remotefiles[encodeURIComponent(`scripts__${file}`)], ...responseObj };
                        fs.writeFileSync("./remote_files.json", JSON.stringify(remotefiles, null, 2), 'utf-8');
                        console.log(colors.green(`The file at ${filePath} has been successfully registered!`));
                    }
                });

                res.on("error", function(error) {
                    console.error(colors.red(error));
                });
            });
            var postData = JSON.stringify({
                "canCopy": true,
                hostedLocation,
                integrityHash,
                "version": version == "dev" ? '0.0.1' : version,
                "displayName": cleanDisplayName(`scripts__${file}`)
            });

            req.write(postData);

            req.end();
        } else {
            console.log(colors.red("The file is not yet deployed, or has not been registered"))
        }
    }
} catch (error) {
    console.log(colors.red(error.message));
}