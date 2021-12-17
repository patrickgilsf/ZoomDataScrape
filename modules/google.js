// // const { google } = require('googleapis')
// import { google } from 'googleapis';
// // const express = require('express');
// import express from 'express';
// const app = express();
// // const config = require('./config');
// import { auth } from './config.js'
// // const index = require('./index');


var excListGetter = () => {
    //const auth = config.auth;
    google.options({auth});
    var spreadsheetId = '1O5SGlAWSrmGrSluc296agzFqYKP31gaQcjm23z42LdY';
    var sheets = google.sheets('v4');
    var getSpreadsheetData = {
        spreadsheetId,
        range: 'ExclusionList!column'
    };
    sheets.spreadsheets.values.get(getSpreadsheetData, (err, response) => {
        let list = response.data.values;
        console.log(`The Exclusion list is: ${list}`)
    });
}

export {
    excListGetter
}

//This posts the exclusion list to gSheet
// var resources = {
//     auth,
//     spreadsheetId,
//     resource: {
//         valueInputOption: 'USER_ENTERED',
//         data: [{
//             range: 'ExclusionList!column',
//             majorDimension: 'COLUMNS',
//             values: [index.excList]
//             }
//         ]     
//     },
//     includeValuesInResponse: true,
// }
// sheets.spreadsheets.values.batchUpdate(resources, (err, response) => {
//     if(err) {
//         console.error(err)
//     } 
// });




// app.listen(3555);

//exports.excList = excList;