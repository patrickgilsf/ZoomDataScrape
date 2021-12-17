// Imports
import express from 'express';
import {
    reportListFactory,
    updateExclusionList,
    zoomRequest,
    googleRequest
} from "./modules/functions.js";

const app = express();

var excList = googleRequest();
updateExclusionList(excList);

if(excList){
    var zr = zoomRequest(excList);
    reportListFactory(excList, zr);
} else {
    console.log('Error creating exclusion list, try again.');
}

excListGetter(); 
