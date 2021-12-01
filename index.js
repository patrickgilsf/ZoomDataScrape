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

request(options, function (error, response, body) {

//this code works
	if (error) throw new Error(error);
	var parsed = JSON.parse(body)
	var zr = parsed.zoom_rooms;
//this creates the list
var newArr = [];
var roomData = "";
Object.entries(zr).forEach(
    ([key, value]) => {
		if (value.status === "Offline") {
			newArr.push(zr[key]);
			roomData = roomData + zr[key].room_name + '\n'
		}
	}
);

//this creates a file with current date (sliced), within this codes' directory
let dateStr = date.dateStr;
let fileStr = './FileOutput/Zoom Offline Rooms Report for ' + dateStr;

//this creates a full file with a header
var fileHeader = 
`This file was generated in Node, and reports all Zoom Rooms that were offline at the time and date of the file, which is ${dateStr}.

Rooms Offline:
`
var fileData = fileHeader + roomData

//this generates the file
createFile(fileStr, fileData, (err) => {
	if(err) {
		console.error(err);
	}
})

});