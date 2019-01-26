const express = require('express');
const app = express();
const url = require('url');
const port = 8080;
const pokerParser = require('./src/parser');
const htmlWrap = require('./src/ui/htmlWrap');
var cache = require('memory-cache');
var url1 = '../../../../Users/BaronJack/AppData/Local/PokerStars';
var url2 = '.',
    html = '';
var active_url = url1;
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    var limit = !isNaN(req.query.limit) ? req.query.limit : (!isNaN(req.query.l) ? req.query.l : 10);
        pokerParser.parser(active_url, limit, function(data, i) {
            res.send(htmlWrap(data));
        });

});
app.listen(port, () => console.log(`poker stars app listening on port ${port}!`));