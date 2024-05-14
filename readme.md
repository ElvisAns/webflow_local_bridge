# Webflow Custom Scripts CLI

The Webflow Custom Scripts CLI tool helps Webflow developers manage custom scripts within their projects easily.

## Installation

To install the project, follow these steps:

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install`.
3. Change your site ID, Client ID and Client Secret inside the `user.config.cjs` file (You can see your webflow site ID at the general settings of the site and the Client ID/Client Secret from the custom app tab)
4. Add javascript files inside the scripts folder (so you can run command below against them)
5. Start your dev server by running`npm run dev`. for more please read below.


## Commands

### Authentication

Authenticate your CLI instance with an authorization code.
To get the authCode please refer to the app website at https://webflow-local-bridge.replit.app/

```bash
npm run bridge -- auth <authCode>
```

### Upload

Upload a file to the Webflow assets.

The script has to be located inside the scripts folder

```bash
npm run bridge -- push <filename>
```

### Register

Register a script with a specific version.

Note : The first time you create a new file remember to register it's dev version (`npm run bridge -- deploy --version=dev --file=test.js --location=head`, which will automatically register the localhost url) then you can switch to that dev version whenever you want to start development and see changes live.


```bash
npm run bridge -- deploy --version=<version> --file=<filename> --location=<location>
```

### Attach

Attach a script's specific version to a Webflow page and location.

```bash
npm run bridge -- attach --pageId=<pageId> --file=<filename> --version=<version> --location=<location>
```
Make sure you redeploy your site from the designer for the script deployment to reflect on the actual website


### Detach

Detach a script from a Webflow page.

```bash
npm run bridge -- remove --pageId=<pageId> --file=<filename>

```
Make sure you redeploy your site from the designer for the script deployment to reflect on the actual website

### Show Registered

Retrieve scripts registered to your site or page, specify the page if you need to see registered script to the page only

```bash
npm run bridge -- show site --limit=<limit> --offset=<offset>
```
or
```bash
npm run bridge -- show page --pageId=<pageId> --limit=<limit> --offset=<offset>
```
The offset and limits are optional you can ommit them.

## Contributing

Contributions are welcome! Please submit bug reports, feature requests, and pull requests following our guidelines.


## Contact

For any questions or inquiries, please contact me.
