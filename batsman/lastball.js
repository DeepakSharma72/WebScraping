const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const commentryURL = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/ball-by-ball-commentary";
const scorCardURL = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";

request(scorCardURL, cb);

function cb(err, res, html) {
    if (err) {
        console.log(err);
    }
    else {
        extractHTML(html);
    }
}

function getCommentry($) {
    const dataArray = $('.ds-items-baseline .ci-html-content');
    for (let i = 0; i < dataArray.length; i++) {
        const txt = $(dataArray[i]).text();
        const string = `${i + 1}: ${txt}\n`
        fs.writeFileSync('commentry.txt', string);
    }
}

function getLosserTeam($) {
    const LooserTeam = $('.ci-team-score.ds-flex.ds-text-typo-title.ds-mb-2.ds-opacity-50 span span').text();
    return LooserTeam;
}

function extractHTML(html) {
    const $ = cheerio.load(html);  // this acts like CSS selector tool...
    // getCommentry($);

    const LooserTeam = getLosserTeam($);
    const jsonData = getBowlerScoreBoardOfWinnerTeam($, LooserTeam);
    fs.writeFileSync('record.json',jsonData);

    
}

function getBowlerScoreBoardHTML($, LooserTeam) {
    const Teams = $('.ds-bg-fill-content-prime.ds-rounded-lg');
    const TeamNames = $('.ds-bg-fill-content-prime.ds-rounded-lg .ds-grow span.ds-uppercase');
    for (let i = 0; i < 2; i++) {
        let tname = $(TeamNames[i]).text().split(' INNINGS')[0];
        // console.log(tname);
        if (tname === LooserTeam) {
            const data = $(Teams[i]).find('table');
            const bowldata = $(data[1]).find('tbody');
            // console.log($(bowldata).html());
            return bowldata;
        }
    }
    return undefined;
}

function getBowlerScoreBoardOfWinnerTeam($, LooserTeam) {
    const ScoreBoard = getBowlerScoreBoardHTML($, LooserTeam);
    if (ScoreBoard === undefined)
        return;
    const ScoreRow = $(ScoreBoard).find('tr.ds-text-tight-s');
    // console.log(ScoreRow.length);
    const record = [];
    // here i got my rows which is containing data...
    for(let row of ScoreRow)
    {
        const data = $(row).find('td');
        console.log(data.length);
        const playerName = $(data[0]).text();
        const over = $(data[1]).text();
        const runs = $(data[3]).text();
        const wickets = $(data[4]).text();
        // console.log(playerName,over,runs,wickets);
        record.push({playerName,over,runs,wickets});
    }
    const jsonData = JSON.stringify(record);
    return jsonData;
}

