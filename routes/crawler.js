var express = require('express');
var router = express.Router();

// POST crawler route
router.post('/crawler', function (req, res, next) {

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = req.body.url ;  //e.g. "http://www.reddit.com";
var SEARCH_WORD = req.body.query ; //e.g. "submitted";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
    if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        // this page has been visited already, so repeat the crawl
        crawl();
    } else {
        // New page that has not been visited
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    // Add page to  the set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function(error, response, body) {
        // Check for status code 200 HTTP OK
        console.log("Status code: " + response.statusCode);
        if(response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        var isWordFound = searchForWord($, SEARCH_WORD);
        if(isWordFound) {
            console.log('the word ' + '"' + SEARCH_WORD + '"'+' found at page ' + url);
            collectInternalLinks($);
            //  the callback is just calling crawl()
            callback();
        } else {
            collectInternalLinks($);
            //  the callback is just calling crawl()
            callback();
        }
    });
}

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($) {
    var allRelativeLinks = [];
    var allAbsoluteLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function() {
        allRelativeLinks.push($(this).attr('href'));

    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function() {
        allAbsoluteLinks.push($(this).attr('href'));
    });

    console.log("Found " + allRelativeLinks.length + " relative links");
    console.log("Found " + allAbsoluteLinks.length + " absolute links");
}

});

module.exports = router;