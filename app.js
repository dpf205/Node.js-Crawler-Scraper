var express =  require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var app = express();
var  port  = 8080;

// set up view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// set up middleware
app.use(express.static(__dirname + '/public'));

//set up web crawler route
var crawlerRoutes = require('./routes/crawler');
app.use('/crawler', crawlerRoutes);

//set up web scraper route
var scraperRoutes = require('./routes/scraper');
app.use('/scraper', scraperRoutes);

//set up home route
var indexRoute = require('./routes/index');
app.use('/', indexRoute);


app.listen(port, function () {
    console.log('express server on port ' + port)
});