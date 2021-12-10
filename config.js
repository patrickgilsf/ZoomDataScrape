//imports
const jwt = require('jsonwebtoken');
require('dotenv').config();

//secrets
const apiKey = process.env.MYAPIKEY;
const apiSecret = process.env.MYAPISECRET;
const slackToken = process.env.SLACKTOKEN;


//variables
const payload = {
    iss: apiKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, apiSecret);
//const token = ('eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IkpodUZDTDJKVHVheGJ0dFpVWkZjcXciLCJleHAiOjE2Mzg5MzgzMzYsImlhdCI6MTYzODkzMjkzNn0.5mZs-Q-UPVzvbqycHlIVsJmoUzrfnA-hRUH4ZMTktzo')
//exports
exports.token = token;
exports.slackToken = slackToken;
