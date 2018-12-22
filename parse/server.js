const express = require('express');
const app = express();
const url = require('url');
const port = 8080;
const pokerParser = require('./parser');
const htmlWrap = require('./src/htmlWrap');
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var url1 = '../../../../Users/BaronJack/AppData/Local/PokerStars';
var url2 = '.';

app.get('/', (req, res) => {
	var queryString = url.parse(req.url).query;
	pokerParser(url2, function(history){
		history = htmlWrap(history);
		res.send(history);
	});
});




app.listen(port, () => console.log(`poker stars app listening on port ${port}!`));