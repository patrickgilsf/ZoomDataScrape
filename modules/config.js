//imports
import 'dotenv/config';
import dotenv from 'dotenv';
	dotenv.config();

import jwt from 'jsonwebtoken';
import { google } from 'googleapis';

const apiKey = process.env.MYAPIKEY;
const apiSecret = process.env.MYAPISECRET;
const slackWebhook = process.env.SLACK_WEBHOOK_URL;
const googleKey = process.env.GOOGLE_KEY;
const googleEmail = process.env.GOOGLE_CLIENT_EMAIL;




//zoom api keygen/auth
const payload = {
    iss: apiKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, apiSecret);

var options = {
	method: 'GET',
	url: 'https://api.zoom.us/v2/metrics/zoomrooms?page_size=400&page_number=1',
	auth: {
		'bearer': token
	}
};




//google api keygen/auth
const auth = new google.auth.JWT(
    googleEmail,
    null,
    googleKey,
    [
        'https://www.googleapis.com/auth/spreadsheets'
    ],
    null
)

export {
    token,
    slackWebhook,
    googleKey,
    auth,
    googleEmail,
    options
}