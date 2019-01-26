var fs = require('fs')
var _ = require('underscore')
const db = require("../app/src/db.js");

var Tournament = require('./classes/Tournament.js')
var Users = require('./classes/Users.js')
var Calc = require('./classes/Calc.js')
var calcObj = new Calc()
var userObj = new Users()
var usernames = userObj.get()

function checkDir(dirname){
  var res = [], handsHistory=null, handsDirName='', username='';
  for (var i = 0, length1 = usernames.length; i < length1; i++) {
    username = usernames[i]
    handsDirName = dirname + '/HandHistory/' + username + '/'
    handsHistory = fs.readdirSync(handsDirName)
    handsHistory.sort(function (a, b) {
      return fs.statSync(handsDirName + a).ctime < fs.statSync(handsDirName + b).ctime
    })
    res.push(handsHistory[0]);
  }
  return JSON.stringify(res);

}
function parser (dirname, limit, callback) {
  var res = []
  res = load(dirname, limit, usernames[0])
  callback(res)
}
function load (dirname, limit, username) {
  var res = []; var counter = 0
  var tourneySumFiles = []
  var sumDirName = dirname + '/TournSummary/' + username + '/'
  var handsDirName = dirname + '/HandHistory/' + username + '/'
  limit = !isNaN(limit) ? limit : 10
  tourneySumFiles = fs.readdirSync(sumDirName)
  var handsHistory = fs.readdirSync(handsDirName)
  handsHistory.sort(function (a, b) {
    return fs.statSync(handsDirName + a).ctime < fs.statSync(handsDirName + b).ctime
  })
  _.each(handsHistory, function (filename) {
    var summary = findMatch(sumDirName, filename, tourneySumFiles)
    if (summary && counter < limit) {
      var d = fs.readFileSync(handsDirName + filename, 'utf-8')
      var tourney = new Tournament(d, summary)
      res.push(tourney)
      counter++
    }
  })
  var tournamentCalc = calcObj.tournament(res)
  var cardsCalc = calcObj.cards(res)
  return { rounds: res, calculations: tournamentCalc.averages, cards: cardsCalc, summaries: tournamentCalc.summaries }
}
function findMatch (dirname, filename, tourneySumFiles) {
  var tourneyId = filename.substring(filename.indexOf('T'), filename.indexOf(' ', filename.indexOf('T')))
  for (var i = 0, length1 = tourneySumFiles.length; i < length1; i++) {
    var sumFile = tourneySumFiles[i]
    if (sumFile.indexOf(tourneyId) > -1) {
      var d = fs.readFileSync(dirname + sumFile, 'utf-8');
      return d
    }
  }
  return ''
}

module.exports = {parser:parser, checkDir:checkDir}