const fs = require("fs");
const path = require('path');
const crypto = require('crypto');
const FormData = require('form-data');
const axios = require('axios');
const userconfig = require('../user.config.cjs');
const { XMLParser } = require("fast-xml-parser");
require('dotenv').config();

async function create_asset_meta_and_upload(filePath = null) {
    if (!filePath || !fs.existsSync(filePath)) {
        throw new Error(`The filepath ${filePath} is not valid or file dont exist`);
    }

    // Calculate file hash
    const hashStream = crypto.createHash('md5');
    const buff = fs.readFileSync(filePath);
    const fileHash = hashStream.update(buff).digest('hex');

    const fileName = path.basename(filePath);

    // Headers and data for API request
    const myHeaders = {
        accept: 'application/json',
        authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'content-type': 'application/json'
    };
    const data = { fileName, fileHash };
    const url = `https://api.webflow.com/v2/sites/${userconfig.site_id}/assets`;

    try {
        // Make API request to get upload details
        const response = await axios.post(url, data, { headers: myHeaders });
        const { uploadDetails, uploadUrl } = response.data;

        // Prepare form data for file upload
        const form = new FormData();
        Object.entries(uploadDetails).forEach(([field, value]) => {
            if (value !== null) {
                form.append(field, value);
            }
        });
        form.append('file', fs.createReadStream(filePath));

        // Upload file using obtained upload URL
        try {
            const uploadResponse = await axios.post(uploadUrl, form, { headers: form.getHeaders() });
            console.log(uploadResponse.data);
            const parser = new XMLParser();
            return parser.parse(uploadResponse.data);
        } catch (error) {
            console.error('Error:', error.message);
            if (error.response.data) {
                throw new Error(error.response.data);
            }
            throw new Error("Unkown error");
        }
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error("Unkown error");
    }
}

module.exports = create_asset_meta_and_upload