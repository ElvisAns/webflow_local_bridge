const { program } = require("commander");
const path = require('path');
const fs = require('fs');
var https = require('follow-redirects').https;
require('dotenv').config();
var colors = require('colors');

program
    .name("-attach")
    .description('Attach a script to a Webflow page')
    .option("--pageId <string>", "Webflow pageID")
    .option("--file <string>", "relative path of the file to the scripts/ folder eg. test.js if the file is right inside the scripts folder")
    .option("--version <string>", "semantic version eg. 1.0.0, you can use dev as well")
    .option("--location <string>", "header|footer")
    .parse();

var pageId = program.opts().pageId;
var file = program.opts().file;
var version = program.opts().version;
var location = program.opts().location;

if (!pageId || !file || !version || !location) {
    program.outputHelp();
    return;
}

try {
    const filePath = path.join(__dirname, '../scripts/', file);
    if (!filePath || !fs.existsSync(filePath)) {
        console.log(colors.red(`The filepath ${filePath} is not valid or file does not exist`));
    } else {
        let remotefiles = fs.readFileSync("./remote_files.json", 'utf8');
        remotefiles = remotefiles.length > 0 ? JSON.parse(remotefiles) : {};

        if (remotefiles[encodeURIComponent(`scripts__${file}`)] && remotefiles[encodeURIComponent(`scripts__${file}`)]['id']) {
            var options = {
                'method': 'PUT',
                'hostname': 'api.webflow.com',
                'path': `/v2/pages/${pageId}/custom_code`,
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
                    if (responseObj.message || responseObj.msg) {
                        console.log(colors.red(responseObj))
                    } else {
                        remotefiles[encodeURIComponent(`scripts__${file}`)] = { pageId, ...remotefiles[encodeURIComponent(`scripts__${file}`)], ...responseObj };
                        fs.writeFileSync("./remote_files.json", JSON.stringify(remotefiles, null, 2), 'utf-8');
                        console.log(colors.green(`Done, the file at ${filePath} has been attached to the page with ID ${pageId}`));
                    }
                });

                res.on("error", function(error) {
                    console.log(colors.red(error));
                });
            });
            const other_script = Object.values(remotefiles).filter(meta => meta.pageId == pageId && meta.id !== remotefiles[encodeURIComponent(`scripts__${file}`)]['id'])
            const scripts_to_attach = other_script.map((meta, key) => {
                return {
                    location: meta.scripts[0].location,
                    id: meta.id,
                    version: meta.version
                }
            });
            scripts_to_attach.push({
                location,
                "id": remotefiles[encodeURIComponent(`scripts__${file}`)]['id'],
                "version": version == "dev" ? "0.0.1" : version
            })
            var postData = JSON.stringify({
                "scripts": scripts_to_attach
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