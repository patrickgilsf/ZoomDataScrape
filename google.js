const { google } = require('googleapis')
const credentials = require('./credentials.json');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const index = require('./index');

app.use(bodyParser.json());


const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    config.googleKey,
    [
        'https://www.googleapis.com/auth/spreadsheets'
    ],
    null
)

google.options({auth})

const sheets = google.sheets('v4')
const spreadsheetId = '1NJ0MD_m1orF4whpHN6NpJyqm6srfyC17-ubxBF-EBKo';

// app.get('/', (req, res) => {
//     res.send('Hey there')
// });

sheets.spreadsheets.values.append({
    spreadsheetId,
    range:'ExclusionList!column',
    valueInputOption: 'USER_ENTERED',
    //InsertDataOption: 'OVERWRITE',
    includeValuesInResponse: true,
    //responseValueRenderOption: 'FORMATTED_VALUE',
    resource: {
        values: [index.excList]
    }
 }, (err, response) => {
        if(err) {
        console.error('error: '+err)
        } else {
        console.log('success: '+response.data.updates);
        }

})

// app.get('/api', (req, res) => {
//     sheets.spreadsheets.values.get({
//         spreadsheetId,
//         range: 'test!all'
//     }, (err, response) => {
//         res.send(response.data.values.map(([name, count])=>({name, count})))
//     })
// })

// app.listen(3555);

