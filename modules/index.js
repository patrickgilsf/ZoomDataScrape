//Imports
import request from 'request';
import jwt from 'jsonwebtoken';
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
* @param {array} list
* @param {array} zr
*/
var reportListFactory = (list, zr) => {
    var lenArr = [];
    var roomData = "";
    Object.entries(zr).forEach(
        ([key, value]) => {
            if (value.health === "critical" && !excList.includes(value.room_name)) {
                lenArr.push(zr[key]);
                roomData = roomData + zr[key].room_name + '\n'
            }
        }
    );

    var fileStr = './FileOutput/Zoom Offline Rooms Report for ' + dateStr;
    var fileHeader = 
            `This file was generated in Node, and reports all Zoom Rooms that were offline at the time and date of the file, which is ${dateStr}.
                
            There are a total of ${lenArr.length} offline, plus ${list.length} rooms on the exclusion list. 
                
            The ExclusionList can be found at https://docs.google.com/spreadsheets/d/1O5SGlAWSrmGrSluc296agzFqYKP31gaQcjm23z42LdY/edit#gid=0
                
            Rooms Offline:

            `;

    var fileData = fileHeader + roomData;

    createOfflineRoomsReport(fileData, fileStr);
    pushSlackData(fileData);
}

/*
* This adds line breaks to the exclusion list, then updates the ExclusionList
* @param {array} list
* @param {array} zr
*/
var updateExclusionList = (ex) => {
    console.log('Updating Exclusion List...');

    var excListHeader = 'This is the exclusion list, updated at ${dateStr}:';
    var excListPath = './ExclusionList/Exclusion List'; 
	var excListFull = excListHeader + ex;

    fs.writeFile(excListPath, excListFull, 'utf8', (err) => {
		if(err) {
			console.error(err);
		} else {
            console.log(`Exclusion List Updated at ${dateStr}`)
		}
	});
}

export {
    reportListFactory,
    updateExclusionList,
}
