var request = require("request");
const config = require('./config');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
require('dotenv').config()


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
Object.entries(zr).forEach(
    ([key, value]) => {
		if (value.status === "Offline") {
			newArr.push(zr[key]);
			console.log(zr[key].room_name);
		}
	}
);
});