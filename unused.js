//This posts the exclusion list to gSheet, commenting out for now
// var resources = {
//     auth,
//     spreadsheetId,
//     resource: {
//         valueInputOption: 'USER_ENTERED',
//         data: [{
//             range: 'ExclusionList!column',
//             majorDimension: 'COLUMNS',
//             values: [index.excList]
//             }
//         ]     
//     },
//     includeValuesInResponse: true,
// }
// sheets.spreadsheets.values.batchUpdate(resources, (err, response) => {
//     if(err) {
//         console.error(err)
//     } else {
//         console.log('success: '+response.responses)
//     }
// });
