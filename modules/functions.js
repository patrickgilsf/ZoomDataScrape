//Imports
import request from 'request';
import { google } from 'googleapis';
import createFile from 'create-file';
import fs from 'fs';
import { IncomingWebhook } from '@slack/webhook';
import {
	slackWebhook,
	token
} from './config.js';
import {
	dateStr
} from './date.js';
import {
    options,
    auth
} from "./modules/config.js";

/*
* This function sends makes a post in a slack channel
* @param {string} fileData
*/
var pushSlackData = (fileData) => {
    console.log('Pushing Data to Slack...');

	var webhook = new IncomingWebhook(slackWebhook);
    webhook.send({
        text: fileData,
    });
}

/*
* This function creates a file with the data for offline use
* @param {string} fileStr 
* @param {string} fileData 
*/
var createOfflineRoomsReport = (fileData, fileStr) => {
    console.log('Creatine Offline Rooms Report...');

    createFile(fileStr, fileData, (err) => {
        if(err) {
            console.error(err);
        } else {
            console.log(`File was successfully created at ${dateStr}`)
        }
    })
}

/*
* This function does the damn thing
* @param {array} exclusionList
* @param {array} zoomRooms
*/
var reportListFactory = (exclusionList, zoomRooms) => {
    var lenArr = [];
    var roomData = "";
    Object.entries(zoomRooms).forEach(
        ([key, value]) => {
            if (value.health === "critical" && !exclusionList.includes(value.room_name)) {
                lenArr.push(zoomRooms[key]);
                roomData = roomData + zoomRooms[key].room_name + '\n'
            }
        }
    );

    var fileStr = './FileOutput/Zoom Offline Rooms Report for ' + dateStr;
    var fileHeader = 
            `This file was generated in Node, and reports all Zoom Rooms that were offline at the time and date of the file, which is ${dateStr}.
                
            There are a total of ${lenArr.length} offline, plus ${exclusionList.length} rooms on the exclusion list. 
                
            The ExclusionList can be found at https://docs.google.com/spreadsheets/d/1O5SGlAWSrmGrSluc296agzFqYKP31gaQcjm23z42LdY/edit#gid=0
                
            Rooms Offline:

            `;

    var fileData = fileHeader + roomData;

    createOfflineRoomsReport(fileData, fileStr);
    pushSlackData(fileData);
}

/*
* This adds line breaks to the exclusion list, then updates the ExclusionList file
* @param {array} exclusionList
*/
var updateExclusionList = (exclusionList) => {
    console.log('Updating Exclusion List...');

    var excListHeader = 'This is the exclusion list, updated at ${dateStr}:';
    var excListPath = './ExclusionList/Exclusion List'; 
	var excListFull = excListHeader + exclusionList;

    fs.writeFile(excListPath, excListFull, 'utf8', (err) => {
		if(err) {
			console.error(err);
		} else {
            console.log(`Exclusion List Updated at ${dateStr}`)
		}
	});
}

/*
* This makes the api call to zoom
* @return {array} zoomRooms
*/
var zoomRequest = () => {
    request(options, (err, res, body) => {
        console.log('Requesting data from Zoom...');
        if (err) throw new Error(err);
        else {
            console.log('Received data from Zoom!')
            return JSON.parse(body).zoom_rooms;
        }
    })
}

/*
* This makes the api call to google sheets
* @return {array} exclusionList
*/
var googleRequest = () => {
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
            return response.data.values.toString().split(',').join(',\n');
        }
    });
}

export {
    reportListFactory,
    updateExclusionList,
    zoomRequest,
    googleRequest
}
