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
updateExclusionList(exclusionList);

if(exclusionList){
    var zoomRooms = zoomRequest();
    reportListFactory(exclusionList, zoomRooms);
    console.log('Great Success!');
} else {
    console.log('Error creating exclusion list, try again.');
}
