const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { WriteJsonToxlsx, ReadxlsxtoJson, DirectoryCreator } = require('./excel');


function extractPlayerDetails(html) {
    //    IPL -> Team -> Player file -> (data)
    const $ = cheerio.load(html);
    let str = $('.ds-border-line  .ds-grow>.ds-text-tight-m').text();
    const arr = str.split(',');
    const venue = arr[1].trim();
    const Date = `${arr[2].trim()} ${arr[3].trim()}`;
    const result = $('.ds-font-regular.ds-text-typo-title>span').text();
    const innings = $('.ds-bg-fill-content-prime.ds-rounded-lg>.ds-mb-4');

    for (let i = 0; i < innings.length; i++) {
        const teamName = $(innings[i]).find('span.ds-text-tight-s.ds-font-bold').text().split(' INNINGS')[0];
        const opponentTeamName = $(innings[1 - i]).find('span.ds-text-tight-s.ds-font-bold').text().split(' INNINGS')[0];

        const rows = $(innings[i]).find('.ci-scorecard-table>tbody>tr.ds-text-tight-s');
        for (let j = 0; j < rows.length - 1; j++) {
            const cols = $(rows[j]).find('td');
            const PlayerName = $(cols[0]).text().trim();
            const runs = $(cols[2]).text().trim();
            const balls = $(cols[3]).text().trim();
            const fours = $(cols[5]).text().trim();
            const sixes = $(cols[6]).text().trim();
            const strikerate = $(cols[7]).text().trim();

            // console.log(venue, Date, result, PlayerName, runs, balls, fours, sixes, strikerate, teamName);
            processPlayer(teamName, PlayerName, venue, Date, result, runs, balls, fours, sixes, strikerate, opponentTeamName);
        }
    }
    return true;
}

function processPlayer(teamName, PlayerName, venue, Date, result, runs, balls, fours, sixes, strikerate, opponentTeamName) {
    const teamPath = path.join(__dirname, `IPL/${teamName}`);
    DirectoryCreator(teamPath);
    const filePath = path.join(teamPath, `${PlayerName}.xlsx`);
    const content = ReadxlsxtoJson(filePath, PlayerName);
    let palyerObj = { teamName, PlayerName, runs, balls, fours, sixes, strikerate, opponentTeamName, venue, Date }
    content.push(palyerObj);
    WriteJsonToxlsx(PlayerName, content, filePath);
}



async function extractMatchDetails(link) {
    const data = await request(link, (err, res, html) => {
        if (err) {
            console.log(err);
        }
        else {
            extractPlayerDetails(html);
        }
    });
    return true;
}


module.exports = extractMatchDetails;