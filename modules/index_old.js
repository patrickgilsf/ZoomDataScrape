//packages
var request = require("/Users/patrickgi/node_modules/request");
const jwt = require('/Users/patrickgi/node_modules/jsonwebtoken');
const createFile = require('/Users/patrickgi/node_modules/create-file');
const fs = require('fs');

//other files
require('dotenv').config()
const config = require('./config');
const date = require('./date.js');


//Slack
const { IncomingWebhook } = require('/Users/patrickgi/node_modules/@slack/webhook');
const url = config.slackWebhook;
const webhook = new IncomingWebhook(url);

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
	'VAN-4 Kiosk - Virtual IT',
	'SEA-34 Kiosk Virtual IT',
	'SEA-36 Kiosk - Virtual IT'
];

request(options, function (error, response, body) {
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

var fileStr = './FileOutput/Zoom Offline Rooms Report for ' + dateStr;

//this creates a full file with a header
var fileHeader = 
`This file was generated in Node, and reports all Zoom Rooms that were offline at the time and date of the file, which is ${dateStr}.

There are a total of ${roomsOff} offline, plus ${roomsExc} rooms on the exclusion list. 

The ExclusionList can be found at https://docs.google.com/spreadsheets/d/1O5SGlAWSrmGrSluc296agzFqYKP31gaQcjm23z42LdY/edit#gid=0

Rooms Offline:

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

//this sends the data to a Slack channel
webhook.send({
    text: fileData,
  });



//this generates a file folder the exclusion list
var excListStr = '';
let excListPath = './ExclusionList/Exclusion List';
var excListHeader = 
`This is the exclusion list, updated at ${dateStr}:

`;
//this iterates through the exclusion list, and adds to the excList string with a line break, so its easier to read
// export var lineBreak = () => {
	for (let i = 0; i < excList.length; i++) {
		excListStr += excList[i] + '\n';
	}
// }

//this fully populates the ExclusionList with header
var excListFull = excListHeader + excListStr;

//this uses fs to check and update the ExclusionList file
// export var fileWriter = () => {
	fs.writeFile(excListPath, excListFull, 'utf8', (err) => {
		if(err) {
			console.error(err);
		} else {
			console.log(`Exclusion List Updated as well`)
		}
	} )
// }


});

//exports
exports.excList = excList;

