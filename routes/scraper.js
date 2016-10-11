var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs'); //save scraped data to .txt


// POST  scraper route
router.post('/scraper', function (req, res, next) {

    //test scrape:
var url = req.body.url;
request(url, function(error, response, body) {
    if(error) {
        console.log("Error: " + error);
    }
    console.log("Status code: " + response.statusCode);

    var $ = cheerio.load(body);

    $('div#siteTable > div.link').each(function( index ) {
        var title = $(this).find('p.title > a.title').text().trim();
        var score = $(this).find('div.score.unvoted').text().trim();
        var user = $(this).find('a.author').text().trim();
        console.log("Title: " + title);
        console.log("Score: " + score);
        console.log("User: " + user);
        fs.appendFileSync('reddit.txt', title + '\n' + score + '\n' + user + '\n');
    });

});


});

module.exports = router;