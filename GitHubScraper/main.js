const cheerio = require("cheerio");
const request = require("request");
const path = require('path');
const {generateRepos} = require('./repo');
const  {CreateDirectory} = require('./util');


const URL = "https://github.com/topics";

request(URL,(err,res,html)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        ExtractHTML(html);
    }
});

async function ExtractHTML(html){
    const $ = cheerio.load(html);
    const topicTags = $('.topic-box>a');
    for(let i=0;i<topicTags.length;i++)
    {
        const topicLink = $(topicTags[i]).attr('href');
        const topicArr = topicLink.split('/');
        const topicName = topicArr[topicArr.length - 1].trim();
        console.log(topicName);
        const dirPath = path.join(__dirname,topicName);
        CreateDirectory(dirPath);
        const actualTopicLink = `https://github.com${topicLink}`;
        console.log(actualTopicLink);
        await generateRepos(actualTopicLink,dirPath);
    }
}