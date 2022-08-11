const xlsx = require('xlsx');
const fs = require('fs');

const WriteJsonToxlsx = (sheetname, jsondata, filePath) => {
    let newWB = xlsx.utils.book_new();  // made a new work book....
    let newWS = xlsx.utils.json_to_sheet(jsondata); // json to excel data...
    xlsx.utils.book_append_sheet(newWB, newWS, sheetname);  // (workbook,worksheet,sheetname)
    xlsx.writeFile(newWB, filePath);
}


const ReadxlsxtoJson = (filePath,sheetName) => {
    if(fs.existsSync(filePath) == false)
    {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function DirectoryCreator(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
}


module.exports = {WriteJsonToxlsx, ReadxlsxtoJson, DirectoryCreator};


