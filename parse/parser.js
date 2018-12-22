var fs = require('fs');
var _ = require('underscore');

var Tournament = require('./src/Tournament.js');
var Users = require('./src/Users.js');
var userObj = new Users();
var usernames = userObj.get();
module.exports = parser;

function parser(dirname, callback){
  var res = [];
    for(var i = 0, length1 = usernames.length; i < length1; i++){
      var username = usernames[i];
      res = res.concat(load(dirname, username));
    }
    callback(res);
}
function load(dirname, username){
  var res = [];
  var tourneySumFiles = [];
  var sumDirName = dirname+'/TournSummary/'+username+'/';
  var handsDirName = dirname+'/HandHistory/'+username+'/';
  fs.readdirSync(sumDirName).forEach(file => {
    tourneySumFiles.push(file);
      });
    fs.readdirSync(handsDirName).forEach(filename => {
      var summary = findMatch(sumDirName, filename, tourneySumFiles);
          var d = fs.readFileSync(handsDirName + filename, 'utf-8');
          var tourney = new Tournament(d, summary);
          res.push(tourney);
      });
    return res;
}
function findMatch(dirname, filename, tourneySumFiles){
  var tourneyId = filename.substring(filename.indexOf('T'), filename.indexOf(" ", filename.indexOf('T')));
  for(var i = 0, length1 = tourneySumFiles.length; i < length1; i++){
    var sumFile = tourneySumFiles[i];
    if(sumFile.indexOf(tourneyId) > -1){
        var d = fs.readFileSync(dirname + sumFile, 'utf-8');
        return d;
    }
  }
  return '';
}