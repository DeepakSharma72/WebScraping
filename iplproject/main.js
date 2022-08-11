const request = require("request");
const cheerio = require("cheerio");
const path = require('path');
const URL = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const extractMatchDetails = require('./scorecard');
const {DirectoryCreator} = require('./excel');

request(URL, (err, res, html) => {
    if (err) {
        console.log(err);
    }
    else {
        extractHTML(html);
    }
});

function extractHTML(html) {
    const $ = cheerio.load(html);
    const anchEle = $("a[class = 'ds-block ds-text-center ds-uppercase ds-text-ui-typo-primary ds-underline-offset-4 hover:ds-underline hover:ds-decoration-ui-stroke-primary ds-block']");
    const link = `https://www.espncricinfo.com${anchEle.attr("href")}`;
    console.log(link);
    request(link, (err, res, html) => {
        if (err) {
            console.log(err);
        }
        else {
            getMatchAllLink(html);
        }
    })

}

async function getMatchAllLink(html) {
    const $ = cheerio.load(html);
    const anchorLink = $('.ds-flex.ds-flex-wrap .ds-px-4.ds-py-3>a');
    const IPLpath = path.join(__dirname,'IPL');
    DirectoryCreator(IPLpath);
    for(let aL of anchorLink)
    {
        const suffix = $(aL).attr('href');
        const link = `https://www.espncricinfo.com${suffix}`;
        console.log(link);
        await extractMatchDetails(link);
    }
}

