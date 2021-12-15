//imports
const jwt = require('jsonwebtoken');
require('dotenv').config();

//secrets
const apiKey = process.env.MYAPIKEY;
const apiSecret = process.env.MYAPISECRET;
const slackWebhook = process.env.SLACK_WEBHOOK_URL;
const googleKey = process.env.GOOGLE_KEY;



//variables
const payload = {
    iss: apiKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, apiSecret);

//exports
exports.token = token;
exports.slackWebhook = slackWebhook;
exports.googleKey = googleKey;

