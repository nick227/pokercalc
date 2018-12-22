"use strict";
var Round = require("./Round.js");
var Calc = require("./Calc.js");
const Users = require("./Users.js");
const utils = require("./utils.js");
const usersObj = new Users();
class Tournament{
	constructor(history, summary){
  		const all_rounds = utils.clearBlanks(history.split("\r\n\r\n\r\n\r\n"));
  		this.num_hands = all_rounds.length;
  		let ll = all_rounds[0].split("\r\n")[0].split(' - ');
  		this.date = ll[ll.length-1];

  		if(!summary){
			this.tournament_name = all_rounds[0].split("\r\n")[0];
			this.buy_in = 'unknown';
			this.num_players = 'unknown';
			this.prize_pool = 'unknown';
			var x = all_rounds[all_rounds.length-1].substring(0, all_rounds[all_rounds.length-1].indexOf("*** SUMMARY ***")).split("\r\n").reverse().findIndex(function(line){
				return usersObj.check(line);
			});
			this.summary = all_rounds[all_rounds.length-1].substring(0, all_rounds[all_rounds.length-1].indexOf("*** SUMMARY ***")).split("\r\n").reverse()[x];
  		}else{
  			this.summary = summary.split("\r\n").filter(Boolean);
			this.tournament_name = this.summary[0].split("\r\n")[0];
			this.buy_in = this.summary[1].substring(8, this.summary[3].length-1);
			this.num_players = this.summary[2].split(" ")[0];
			this.prize_pool = this.summary[3].substring(18, this.summary[3].length-1);
			this.summary = this.summary[this.summary.length-1];
  		}
  		this.parse(all_rounds);

  		return this;
	}
	get(id){
		return typeof id === 'string' ? this[id] : this;
	}
	parse(data){
	  var rounds = [];
	  for(var i=0;i<data.length;i++){
	  	var e = data[i];
	  	if(e.length){
		    var roundObj = new Round(e);
		  	rounds.push(roundObj);
	  	}
	  }
	  this.information = new Calc(rounds);
	  this.rounds = rounds;
	}
}

module.exports = Tournament;