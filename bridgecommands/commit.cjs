const { program } = require("commander");
const path = require('path');
const fs = require('fs');
var http = require('follow-redirects').http;
const colors = require("colors");

program
    .name("-push")
    .description('Upload the file to the assets')
    .option("--file <string>", "relative path of the file to the scripts/ folder eg. test.js if the file is right inside the scripts folder")
    .parse();

var file = program.opts().file;

if (!file) {
    program.outputHelp();
    return;
}

try {
    const filePath = path.join(__dirname, '../scripts/', file);
    if (!filePath || !fs.existsSync(filePath)) {
        console.log(colors.red(`The filepath ${filePath} is not valid or file does not exist`));
    } else {
        var options = {
            'method': 'GET',
            'hostname': 'localhost',
            'port': 3000,
            'path': '/sync/files?filePath=' + filePath,
            'headers': {},
            'maxRedirects': 20
        };

        let remotefiles = fs.readFileSync("./remote_files.json", 'utf8');
        remotefiles = remotefiles.length > 0 ? JSON.parse(remotefiles) : {};
        var req = http.request(options, function(res) {
            var chunks = [];

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function(chunk) {
                var body = Buffer.concat(chunks);
                const str = body.toString();
                const fileInfo = JSON.parse(str);
                remotefiles[encodeURIComponent('scripts__' + file)] = fileInfo.PostResponse;
                fs.writeFileSync("./remote_files.json", JSON.stringify(remotefiles, null, 2), 'utf-8');
                console.log(colors.green(`The file at ${filePath} has been uploaded to your webflow assets`))
            });

            res.on("error", function(error) {
                console.error(colors.red(error));
            });
        });
        req.end();
    }
} catch (error) {
    console.log(colors.red(error.message));
}