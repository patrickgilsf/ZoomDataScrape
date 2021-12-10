//packages
var request = require("/Users/patrickgi/node_modules/request");
const jwt = require('/Users/patrickgi/node_modules/jsonwebtoken');
const createFile = require('/Users/patrickgi/node_modules/create-file');
const fs = require('fs');
const app = 'express';

//other files
require('dotenv').config()
const config = require('./config');
const date = require('./date.js');






var options = {
	method: 'GET',
	url: 'https://api.zoom.us/v2/metrics/zoomrooms?page_size=400&page_number=1',
	auth: {
		bearer: config.token
	}
};

//list of rooms to not have on list:
var excList = [
	'Daimler',
	'Jason Tracey',
	"Patrick\'s Zoom Room",
	'SEA-34 Kiosk - MacMini+iPad test',
	'SEA-37 Kiosk - Virtual IT',
	'SFO-10 Kiosk - Virtual IT',
	'IRV-8 Kiosk - Virtual IT',
	'ATL-10 Kiosk - Virtual IT',
	'SEA-40 Kiosk - Virtual IT',
	'CIN-4 Kiosk - Virtual IT',
	'IRV-11 Kiosk - Virtual IT',
	'IRV-12 Kiosk - Virtual IT',
	'KCY-1 Kiosk - Virtual IT',
	'NYC-11 Kiosk - Virtual IT',
	'NYC-12 Kiosk - Virtual IT',
	'PHX-190 Kiosk - Virtual IT',
	'SEA-38 N Kiosk - Virtual IT',
	'SEA-39 Kiosk - Virtual IT',
	'SEA-38 Kiosk - Virtual IT',
	'SEA-39 Kiosk - Virtual IT',
	'IRV-10 Kiosk - Virtual IT',
	'SEA-34 N Kiosk Virtual IT',
	'SEA-34 S Kiosk - Virtual IT',
	'SEA-40 N Kiosk - Virtual IT',
	'SEA-40 S Kiosk - Virtual IT',
	'SFO-7 Kiosk - Virtual IT',
	'VAN-4 Kiosk - Virtual IT'
];

request(options, function (error, response, body) {
//this code works
	if (error) throw new Error(error);
	var parsed = JSON.parse(body)
	var zr = parsed.zoom_rooms;
	//console.log(zr)
//this creates the list
var newArr = [];
var roomData = "";
Object.entries(zr).forEach(
    ([key, value]) => {
		if (value.health === "critical" && !excList.includes(value.room_name)) {
			newArr.push(zr[key]);
			roomData = roomData + zr[key].room_name + '\n'
		}
	}
);

var roomsOff = newArr.length;
var roomsExc = excList.length;

//this creates a file with current date (sliced), within this codes' directory
var dateStr = date.dateStr;
var fileStr = '/Users/patrickgi/Documents/Zoom/PG_ZoomDev/ZoomDataScrape/FileOutput/Zoom Offline Rooms Report for ' + dateStr;

//this creates a full file with a header
var fileHeader = 
`This file was generated in Node, and reports all Zoom Rooms that were offline at the time and date of the file, which is ${dateStr}.

There are a total of ${roomsOff} offline, plus ${roomsExc} rooms on the exclusion list. Rooms Offline:

`
var fileData = fileHeader + roomData 


//this generates the file
createFile(fileStr, fileData, (err) => {
	if(err) {
		console.error(err);
	} else {
		console.log(`New Offline Rooms Report File was successfully created at ${dateStr}`)
	}
})

//this generates a file folder the exclusion list
var excListStr = '';
let excListPath = '/Users/patrickgi/Documents/Zoom/PG_ZoomDev/ZoomDataScrape/ExclusionList/Exclusion List';
var excListHeader = 
`This is the exclusion list, updated at ${dateStr}:

`;
//this iterates through the exclusion list, and adds to the excList tring with a line break, so its easier to read
for (let i = 0; i < excList.length; i++) {
	excListStr += excList[i] + '\n';
}
//this fully populates the ExclusionList with header
var excListFull = excListHeader + excListStr;

//this uses fs to check and update the ExclusionList file
fs.writeFile(excListPath, excListFull, 'utf8', (err) => {
	if(err) {
		console.error(err);
	} else {
		console.log(`Exclusion List Updated as well`)
	}
} )
});


/*
/////////////
//this auto-posts to my Slack channel (still need permissions from zSec + Brandon G.)


// The name of the file you're going to upload
		//using fileStr, from above
// ID of channel that you want to upload file to
const channelId = "C02PR1MTL90"//channel I created, hoping to invite app when published
//Imports
const slackToken = config.slackToken;
const { webClient } = require("@slack/web-api")
const client = new webClient(slackToken)


const slackOptions = {
	method: 'POST',
	url: 'https://slack.com/api/files.upload',
	token: slackToken
};

request(slackOptions, async function (error, response, body) {
	if (error) throw new Error(error); 
	const result = await client.files.upload({
		channels: channelId,
		initial_comment: `Here is another file generated in Node on {dateStr}, that reports all Offline Zoom Rooms`,
		file: fs.createReadStream(fileStrl)
	})
	console.log(response)
})
*/