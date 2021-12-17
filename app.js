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
    reportListMakerAndGen,
    //reportGen,
    //slackPush,
    fileWriter
} from "./modules/index.js";

const app = express();
// import { auth } from './config.js'



//handlers/////////////////////////////////////////////

//request to Zoom
var zoomReq = (list, listStr) => {
    request(options, (err, res, body) => {
        if (err) throw new Error(err);
        else {
            console.log('requesting to zoom');
            var zr = JSON.parse(body).zoom_rooms;
            var newList = listStr.split(',');
            reportListMakerAndGen(list, zr);
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
        if (err) {
            console.Error(err)
        } else {
            let quickRes = response.data.values;
            console.log('requesting google');
            var excList = [];
            var excListFormat = '';
            for (var item in quickRes){
                excList.push(item);
            }
            zoomReq(quickRes, quickRes.toString());
            fileWriter(quickRes);
        }
       
    });
}

excListGetter(); 