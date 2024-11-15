#!/usr/bin/env node

import { program } from "commander";
import colors from "colors";

import attach from "./bridgecommands/attach.cjs";
import authenticate from "./bridgecommands/auth.cjs";
import commit from "./bridgecommands/commit.cjs";
import detach from "./bridgecommands/detach.cjs";
import deploy from "./bridgecommands/register.cjs";
import registered_scripts from "./bridgecommands/registeredscripts.cjs";
import registered_onpage from "./bridgecommands/registeredonpage.cjs";


program.name("Webflow Local bridge");
program.description("Manage your webflow site scripts with the comfort of your IDE");


program
    .command('auth')
    .description('Authenticate your cli instance')
    .argument("<authcode>", "Specify the authCode you have got during the installation process")
    .action((authcode) => authenticate(authcode))


program
    .command("push")
    .description('Upload a file to your webflow assets')
    .argument("<filepath>", "relative path of the file to the scripts/ folder eg. test.js if the file is right inside the scripts folder")
    .action((filepath) => commit(filepath));

program
    .command("deploy")
    .description('Deploy a script version of your script, stage it to be used on a page')
    .option("--file <string>", "relative path of the file to the scripts/ folder eg. test.js if the file is right inside the scripts folder")
    .option("--version <string>", "semantic version eg. 1.0.0, dev version is used to deploy the script that will be in sync with your local development file")
    .option("--location <string>", "header|footer")
    .action((options) => deploy(options));


program
    .command("attach")
    .description('Attach a script to a page given the script deployed version')
    .requiredOption("--pageId <string>", "pageID")
    .requiredOption("--file <string>", "relative path of the file to the scripts/ folder eg. test.js if the file is right inside the scripts folder")
    .requiredOption("--version <string>", "semantic version eg. 1.0.0, you can use dev as well")
    .requiredOption("--location <string>", "header|footer")
    .action((options) => attach(options));

program
    .command("remove")
    .description('Detach a script from a page')
    .requiredOption("--file <string>", "relative path of the file to the scripts/ folder eg. test.js if the file is right inside the scripts folder")
    .requiredOption("--pageId <string>", "The page ID")
    .action((options) => detach(options));

program
    .command('show')
    .description('Retrieve scripts registered to your site or page, specify the page if you need ')
    .argument("<retrival>", "'site' or 'page', specify if you need to retrieve the list for the whole site or just one page by it's id")
    .option("--limit <number>", "Optionally specify the limit for the number of items to retrieve")
    .option("--offset <number>", "Optionally Specify the offset for pagination")
    .option("--pageId <string>", "Needed If you specified the retrievial to be done on a page")
    .action((retrievial, options) => {
        if (retrievial == "site") {
            registered_scripts(options);
            return;
        }

        if (retrievial == "page") {
            if (!options.pageId) {
                console.log(colors.red("For retrivial type page, the pageId should be supplied"));
                return;
            }
            registered_onpage(options.pageId);
            return;
        }
        console.log(colors.red("Retrivial argument can only be 'site' or 'page', " + retrievial + " supplied"));
    });

program.parse();
