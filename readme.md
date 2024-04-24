# Webflow Custom Scripts CLI

The Webflow Custom Scripts CLI tool helps Webflow developers manage custom scripts within their projects easily.

## Installation

To install the project, follow these steps:

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install`.
3. Change your site ID inside the `user.config.cjs` file (You can see your webflow site ID at the general settings of the site)
4. Add javascript files inside the scripts folder (so you can run command below against them)
5. Start your dev server by running`npm run dev`. for more please read below.


## Commands

### Authentication

Authenticate your CLI instance with an authorization code.
To get the authCode please refer to the app website at [https://webflow-local-bridge-website.vercel.app](https://webflow-local-bridge-website.vercel.app/)

```bash
npm run auth -- auth --authCode <authCode>
```

### Upload

Upload a file to the Webflow assets.

The script has to be located inside the scripts folder

```bash
npm run upload -- push --file <filename>
```

### Register

Register a script with a specific version.

Note : The first time you create a new file remember to register it's dev version (`npm run register -- register --version=dev --file=test.js --location=head`, which will automatically register the localhost url) then you can switch to that dev version whenever you want to start development and see changes live.


```bash
npm run register -- register --version=<version> --file=<filename> --location=<location>

```

### Set

Attach a script to a Webflow page.

```bash
npm run set -- attach --pageId <pageId> --file <filename> --version <version> --location <location>
```

For the `Set command` to take effect you have to deploy the site from your designer


### Unset

Detach a script from a Webflow page.

```bash
npm run unset -- detach --pageId <pageId> --file <filename>

```
For the `Unset command` to take effect you have to deploy the site from your designer


### Show Registered

Retrieve registered scripts with pagination options.

```bash
npm run show.registered -- show or npm run show.registered -- show --limit=<limit> --offset=<offset>
```

### Show

Retrieve remote scripts for a specific page.

```bash
npm run show -- show --pageId <pageId>
```

## Contributing

Contributions are welcome! Please submit bug reports, feature requests, and pull requests following our guidelines.


## Contact

For any questions or inquiries, please contact me.
