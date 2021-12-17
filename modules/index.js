//from packages
import request from 'request';
import jwt from 'jsonwebtoken';
import createFile from 'create-file';
import fs from 'fs';
import { IncomingWebhook } from '@slack/webhook';

//from other files
import {
	slackWebhook,
	token
} from './config.js';
import {
	dateStr
} from './date.js';

var reportListMakerAndGen = (excList, zr) => {
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

//this generates the file
    var fileStr = './FileOutput/Zoom Offline Rooms Report for ' + dateStr;
    var fileHeader = 
`This file was generated in Node, and reports all Zoom Rooms that were offline at the time and date of the file, which is ${dateStr}.
    
There are a total of ${lenArr.length} offline, plus ${excList.length} rooms on the exclusion list. 
    
The ExclusionList can be found at https://docs.google.com/spreadsheets/d/1O5SGlAWSrmGrSluc296agzFqYKP31gaQcjm23z42LdY/edit#gid=0
    
Rooms Offline:
    
`;
    var fileData = fileHeader + roomData;
    createFile(fileStr, fileData, (err) => {
        if(err) {
            console.error(err);
        } else {
            console.log(`New Offline Rooms Report File was successfully created at ${dateStr}`)
        }
    })
    

//this sends the data to a Slack channel
	const url = slackWebhook;
	const webhook = new IncomingWebhook(url);
	console.log('Pushing Data to Slack')
    webhook.send({
        text: fileData,
      });

} //dont comment this bracket out

//this adds line breaks to the exclusion list, then updates the ExclusionList
var fileWriter = (excList) => {
    var excListHeader = 
`This is the exclusion list, updated at ${dateStr}:

`;
    //var excListStr = '';
    var excListPath = './ExclusionList/Exclusion List'; 
	var excListFull = excListHeader + excList;
//this uses fs to check and update the ExclusionList file
	fs.writeFile(excListPath, excListFull, 'utf8', (err) => {
		if(err) {
			console.error(err);
		} else {
			console.log(`Exclusion List Updated from Google Sheets`)
		}
	} )
}



export {
    reportListMakerAndGen,
    fileWriter,
}