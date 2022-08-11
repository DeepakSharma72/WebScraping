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


function getLosserTeam($) {
    const LooserTeam = $('.ci-team-score.ds-flex.ds-text-typo-title.ds-mb-2.ds-opacity-50 span span').text();
    return LooserTeam;
}

function extractHTML(html) {
    const $ = cheerio.load(html);  // this acts like CSS selector tool...
    const LooserTeam = getLosserTeam($);
    getBatsManDetailsofWinnerTeam($, LooserTeam);
    // fs.writeFileSync('record.json',jsonData);    
}

function getBatsManScoreBoardHTML($, LooserTeam) {
    const Teams = $('.ds-bg-fill-content-prime.ds-rounded-lg');
    const TeamNames = $('.ds-bg-fill-content-prime.ds-rounded-lg .ds-grow span.ds-uppercase');
    for (let i = 0; i < 2; i++) {
        let tname = $(TeamNames[i]).text().split(' INNINGS')[0];
        if (tname !== LooserTeam) {
            const data = $(Teams[i]).find('table');
            const bowldata = $(data[0]).find('tbody');
            return bowldata;
        }
    }
    return undefined;
}

function getBatsManDetailsofWinnerTeam($, LooserTeam) {
    const ScoreBoard = getBatsManScoreBoardHTML($, LooserTeam);
    if (ScoreBoard === undefined)
        return;

    const ScoreRow = $(ScoreBoard).find('tr.ds-text-tight-s');

    // here i got my rows which is containing data...
    for (let row of ScoreRow) {
        const anchorTag = $(row).find('.ds-min-w-max .ds-inline-flex.ds-items-center.ds-leading-none');
        if ($(anchorTag).html()) {
            const anchorLink = $(anchorTag).html().split('"')[1];
            const bastmanHttpsURL = `https://www.espncricinfo.com/${anchorLink}`;
            request(bastmanHttpsURL, getBatsManPage);
        }
    }
}

function getBatsManPage(err, res, html) {
    if (err) {
        console.log(err);
    }
    else {
        const $ = cheerio.load(html);
        const bioData = $('.ds-grow .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4 .ds-p-4 .ds-gap-4.ds-mb-8 h5');
        console.log('Player Name : ', $(bioData[0]).text());
        console.log('Birth Place : ', $(bioData[1]).text());
        console.log('Age         : ', $(bioData[2]).text());
        console.log('--------------------------------');
    }
}

