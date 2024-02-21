const express = require('express');
const path = require('path');
const fs = require('fs');
const create_asset_meta_and_upload = require("./helpers/assets.cjs");
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve static files from the 'scripts' folder
const staticFolder = path.join(__dirname, 'scripts');
app.use(express.static(staticFolder));

// Route to serve user configuration file
app.get('/config/cli/auth', (req, res) => {
    res.sendFile('user.config.json', { root: __dirname });
});

// Route to receive user configuration data
app.post('/config/cli/auth', (req, res) => {
    const data = req.body;
    res.send(data);
});

// Route to sync files
app.get('/sync/files', async(req, res) => {
    //const filePath = path.join(__dirname, '/', 'user.config.cjs'); eg : D:\webflow_local_bridge\user.config.cjs
    const filePath = req.query.filePath;
    try {
        const uploadResponse = await create_asset_meta_and_upload(filePath);
        res.json(uploadResponse);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});