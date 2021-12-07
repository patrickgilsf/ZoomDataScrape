var request = require("request");
const config = require('./config');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const createFile = require('create-file');
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
	'SEA-34 Kiosk - Virtual IT',
	'SEA-37 Kiosk - Virtual IT',
	'SFO-10 Kiosk - Virtual IT',
	'IRV-8 Kiosk - Virtual IT'
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
let dateStr = date.dateStr;
let fileStr = './FileOutput/Zoom Offline Rooms Report for ' + dateStr;

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
		console.log(`New File was successfully created at ${dateStr}`)
	}
})
});