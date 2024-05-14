const path = require('path');
const fs = require('fs');
var http = require('follow-redirects').http;
const colors = require("colors");

const commit = (file) => {
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
            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function (chunk) {
                    var body = Buffer.concat(chunks);
                    const str = body.toString();
                    const fileInfo = JSON.parse(str);
                    remotefiles[encodeURIComponent('scripts__' + file)] = fileInfo.PostResponse;
                    fs.writeFileSync("./remote_files.json", JSON.stringify(remotefiles, null, 2), 'utf-8');
                    console.log(colors.green(`The file at ${filePath} has been uploaded to your webflow assets`))
                });

                res.on("error", function (error) {
                    console.error(colors.red(error));
                });
            });
            req.on("error", (error) => {
                if(error.code=="ECONNREFUSED" && error.address == "::1"){
                    console.error(colors.red("Your local dev server should be running! please run `npm run dev` in a seperate terminal before trying to push a file to your webflow assets"))
                }
                else {
                    console.log(error);
                    throw new Error(error);
                }
            })
            req.end();
        }
    } catch (error) {
        console.log(colors.red(error.message));
    }
}

module.exports = commit;