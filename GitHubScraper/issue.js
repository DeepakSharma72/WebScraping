const cheerio = require('cheerio');
const request = require('request-promise');
const  {ReadinFile ,WriteinFile} = require('./util');

async function extractIssues(RepoissueURL,RepoFilePath){
    await request(RepoissueURL,(err,res,html)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            extractIssuesLinks(html,RepoFilePath);
        }
    });
}

function extractIssuesLinks(html,RepoFilePath)
{
    const $ = cheerio.load(html);
    const issueLinks = $('.Link--primary.h4');
    let dataarr = [];

    for(let i=0;i<Math.min(10,issueLinks.length);i++)
    {
        const issueURL = $(issueLinks[i]).attr('href');
        const issueFullURL = `https://github.com${issueURL}`;
        console.log(issueFullURL);
        
        // adding url in json file
        // let data = ReadinFile(RepoFilePath);
        dataarr.push(issueFullURL);
        // data = JSON.stringify(data);
        // WriteinFile(RepoFilePath,data);
    }
    WriteinFile(RepoFilePath,JSON.stringify(dataarr));
}

module.exports = {extractIssues};