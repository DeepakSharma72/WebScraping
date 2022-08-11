const cheerio = require('cheerio');
const request = require('request-promise');
const path = require('path');
const { extractIssues } = require('./issue');

async function generateRepos(topiclink, topicDirPath) {
    await request(topiclink, (err, res, html) => {
        if (err) {
            console.log(err);
        }
        else {
            extractRepos(html, topicDirPath);
        }
    })
}

async function extractRepos(html, topicDirPath) {
    const $ = cheerio.load(html);
    const RepoLinksTags = $('.text-bold.wb-break-word');
    for (let i = 0; i < Math.min(RepoLinksTags.length, 5); i++) {
        const RepoLink = $(RepoLinksTags[i]).attr('href');
        const RepoArr = RepoLink.split('/');
        const RepoUserName = RepoArr[RepoArr.length - 2].trim();
        const RepoName = RepoArr[RepoArr.length - 1].trim();
        const RepoFileName = `${RepoUserName}-${RepoName}`;
        const RepoPath = path.join(topicDirPath,`${RepoFileName}.pdf`);
        // console.log(RepoPath);
        const RepoissueURL = `https://github.com${RepoLink}/issues`;
        console.log(RepoFileName, RepoissueURL);
        extractIssues(RepoissueURL, RepoPath);
    }
}

module.exports = { generateRepos };
