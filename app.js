// Imports
import express from 'express';
import {
    reportListFactory,
    updateExclusionList,
    zoomRequest,
    googleRequest
} from "./modules/functions.js";

const app = express();

var exclusionList = googleRequest();
var zoomRooms = zoomRequest();

if(exclusionList && zoomRooms){
    updateExclusionList(exclusionList);
    reportListFactory(exclusionList, zoomRooms);
    console.log('Great Success!');
} else {
    console.log('Error retriving data, try again.');
}
