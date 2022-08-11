const fs = require("fs");
const path = require("path");
const pdfkit = require('pdfkit');


const CreateDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

const WriteinFile = (filePath, fileData) => {
    // fs.writeFileSync(filePath, fileData);
    let pdfDoc = new pdfkit;
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.text(fileData);
    pdfDoc.end();
}

const ReadinFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    let filedata = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(filedata);
}


module.exports = { ReadinFile, CreateDirectory, WriteinFile };