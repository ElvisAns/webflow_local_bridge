# Webflow Local bridge CLI

Local Bridge is a powerful command-line tool designed to supercharge the way Webflow developers handle custom scripts.

## Installation

To install the project, follow these steps:

1. Clone the repository to your local machine `git clone https://github.com/ElvisAns/webflow_local_bridge local_bridge` or download the latest release https://github.com/ElvisAns/webflow_local_bridge/releases
2. Cd to the project folder `cd local_bridge`
3. Install dependencies by running `npm install`.
4. Change your Site ID, Client ID and Client Secret inside the `user.config.cjs` file (You can see your webflow site ID at the general settings of the site and the Client ID/Client Secret from the custom app tab). When you dont have a custom app with Client ID and Client Secret, just fill the Site ID and just leave the Client ID and Client Secret empty.

### Authentication

#### Option 1 : You have a custom app with Client ID and Client Secret
Authenticate your CLI instance with an authorization code.
To get the authCode please refer to the app website at [https://webflow-local-bridge-website.vercel.app](https://webflow-local-bridge-website.vercel.app/)
```bash
npm run bridge -- auth <authCode>
```

#### Option 2 : Use an Access Token generated from a the docs site
Yes, it is a hacky way to authenticate but it works for now.
- Go to [webflow.com/oauth/authorize](https://webflow.com/oauth/authorize?response_type=code&client_id=2ccc1b455c782fd60093590c83ee5e315b36bd6640507bb48570e5d0265c2854&redirect_uri=https%3A%2F%2Fdevelopers.webflow.com%2Fapi%2Ffern-docs%2Foauth%2Fwebflow%2Fcallback&scope=assets%3Aread+assets%3Awrite+authorized_user%3Aread+cms%3Aread+cms%3Awrite+custom_code%3Aread+custom_code%3Awrite+forms%3Aread+forms%3Awrite+pages%3Aread+pages%3Awrite+sites%3Aread+sites%3Awrite+ecommerce%3Aread+ecommerce%3Awrite+users%3Aread+users%3Awrite+site_activity%3Aread+workspace%3Aread+workspace%3Awrite+app_subscriptions%3Aread+site_config%3Aread+site_config%3Awrite+components%3Aread+components%3Awrite&state=https%3A%2F%2Fdevelopers.webflow.com%2Fdata%2Freference%2Fcustom-code%2Fcustom-code-sites%2Fget-custom-code%3Fplayground%3D%252Fdata%252Freference%252Fcustom-code%252Fcustom-code-sites%252Fget-custom-code)
- Choose the site you want to authenticate against or select the entire workspace
- It will be redirect you to the docs site with the login successfull notice
- Copy the sample curl command shown to you and paste it in your favorite text editor then copy the value of the Bearer token
- If no .env file is found in the project folder, create one and add the following line `ACCESS_TOKEN=<your_access_token>`

### Adding JavaScript Files
Start the Development Server
```bash
npm run dev
```
Add JavaScript files to the scripts folder to be able to use the commands below with them.

## Steps to commit your changes

### 1. Upload the script to the Webflow assets

Once you have your script ready, you can upload it to the Webflow assets by running the following command.

The script has to be located inside the scripts folder

Your dev server has to be running for this command to work. (npm run dev)

```bash
npm run bridge -- push <filename>
```

### 2. Register the script

Register a script with a specific version.

Note : The first time you create a new file remember to register it's dev version (`npm run bridge -- deploy --version=dev --file=test.js --location=head`, which will automatically register the localhost url) then you can switch to that dev version whenever you want to start development and see changes live.


```bash
npm run bridge -- deploy --version=<version> --file=<filename> --location=<location>
```

### 3. Attach the script to the page

Attach a script's specific version to a Webflow page and location.
location can be `header` or `footer`

```bash
npm run bridge -- attach --pageId=<pageId> --file=<filename> --version=<version> --location=<location>
```
Make sure you redeploy your site from the designer for the script deployment to reflect on the actual website
Tip : If you dont know how to get the pageId, you can see the url of your designer tab while making changes to that page and take the value of the pageId query param. For homepage you usually dont see pageId in the url, so the hack is to visit the page in the browser, inspect the site with dev tools and take the value of the attribute `data-wf-page` from the `html` tag.

**Tip : Anytime you want to see changes live (dev server must be running) without redeploying your site any time you make changes, please attach the dev version to the page, deploy from the designer and stay between your code editor and the browser (just refresh the page in the browser). When  you are done making changes, upload the new file as of step 1, register the newest version and attach it to the page again then finally deploy from the designer. If you want to rollback to the previous version, just attach the previous version to the page and deploy from the designer.**

### 4. Detach the script from the page

if you want to remove the script from the page, you can do so by running the following command.

```bash
npm run bridge -- remove --pageId=<pageId> --file=<filename>

```
Make sure you redeploy your site from the designer for the script deployment to reflect on the actual website

### Miscellaneous

#### Show Registered scripts

Retrieve scripts registered to your site or page, specify the page if you need to see registered script to the page only

```bash
npm run bridge -- show site --limit=<limit> --offset=<offset>
```
or
```bash
npm run bridge -- show page --pageId=<pageId> --limit=<limit> --offset=<offset>
```
The offset and limits are optional you can ommit them.

#### Sharing the script with others

You can track the entire project with git and that means you can use tool like github to share the project with others within your team.

## Contributing

Contributions are welcome! Please submit bug reports, feature requests, and pull requests following our guidelines.


## Contact

For any questions or inquiries, please contact me.
