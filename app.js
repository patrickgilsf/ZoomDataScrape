// package imports
import request from 'request';
import { google } from 'googleapis';
import express from 'express';
//file imports
import { //from config file
    options,
    auth
} from "./modules/config.js";
import { //from index file
    reportListFactory,
    updateExclusionList
} from "./modules/index.js";

const app = express();

//handlers/////////////////////////////////////////////

//request to Zoom
var zoomReq = (list) => {
    request(options, (err, res, body) => {
        console.log('Requesting data from Zoom...');
        if (err) throw new Error(err);
        else {
            console.log('Received datat from Zoom!')
            var zr = JSON.parse(body).zoom_rooms;
            reportListFactory(list, zr);
        }
    })
}

//request to Google
var excListGetter = () => {
    google.options({auth});
    var spreadsheetId = '1O5SGlAWSrmGrSluc296agzFqYKP31gaQcjm23z42LdY';
    var sheets = google.sheets('v4');
    var getSpreadsheetData = {
        spreadsheetId,
        range: 'ExclusionList!column'
    };
    sheets.spreadsheets.values.get(getSpreadsheetData, (err, response) => {
        console.log('Requesting data from Google Sheets...');
        if (err) {
            console.Error(err)
        } else {
            console.log('Received data from Google Sheets!');
            var excList = response.data.values.toString().split(',').join(',\n');
            zoomReq(excList);
            updateExclusionList(excList);
        }
       
    });
}

excListGetter(); 
