# Webflow Custom Scripts CLI

The Webflow Custom Scripts CLI tool helps Webflow developers manage custom scripts within their projects easily.

## Installation

To install the project, follow these steps:

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install`.
3. Change your site ID from `user.config.cjs` file

## Commands

### Authentication

Authenticate your CLI instance with an authorization code.

```bash
npm run auth -- auth --authCode <authCode>
```

### Upload

Upload a file to the Webflow assets.

```bash
npm run upload -- push --file <filename>
```

### Register

Register a script with a specific version.

```bash
npm run register -- register --version=<version> --file=<filename>
```

### Set

Attach a script to a Webflow page.

```bash
npm run set -- attach --pageId <pageId> --file <filename> --version <version> --location <location>
```

### Unset

Detach a script from a Webflow page.

```bash
npm run unset -- detach --pageId <pageId> --file <filename>
```

### Attach

Attach a script to a Webflow page.

```bash
npm run attach -- attach --pageId <pageId> --file <filename> --version <version> --location <location>
```

### Detach

Detach a script from a Webflow page.

```bash
npm run detach -- detach --pageId <pageId> --file <filename>
```

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
