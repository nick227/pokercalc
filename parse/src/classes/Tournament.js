'use strict'
var Round = require('./Round.js')
var Calc = require('./Calc.js')
var calcObj = new Calc()
const Users = require('./Users.js')
const utils = require('../misc/utils.js')
const usersObj = new Users()
class Tournament {
  constructor (history, summary) {
  		const all_rounds = utils.clearBlanks(history.split('\r\n\r\n\r\n\r\n'))
  		if (summary.length) {
  			this.summary = summary.split('\r\n').filter(Boolean)
      this.tournament_name = this.summary[0].split('\r\n')[0]
      this.tournament_id = this.tournament_name.split(' ')[2].replace(',', '').replace('#', '')
  			this.num_hands = all_rounds.length
      this.num_players = this.summary[2].split(' ')[0]
  			var x = this.summary.findIndex(function (line) {
  				return usersObj.check(line)
  			})
  			this.winnings = (this.summary[x].split(' ')[6]).length ? this.summary[x].split(' ')[6].replace(/,/g, '') : 0
      this.buy_in = this.summary[1].substring(8, this.summary[3].length - 1)
      this.prize_pool = this.summary[3].substring(18, this.summary[3].length - 1)
      this.summary = this.summary[this.summary.length - 1]
      this.placed = parseInt(this.summary.split(' ')[3].replace('th', '').replace('st', '').replace('nd', '').replace('rd', ''))
      this.placed = typeof this.placed === 'number' ? this.placed : 'eliminated'
  		} else {
      this.summary = all_rounds[all_rounds.length - 1].split('\r\n').reverse().filter(function (line) {
        return usersObj.check(line)
      })[1]
      this.tournament_name = all_rounds[0].split('\r\n')[0]
      this.tournament_id = this.tournament_name.split(' ')[2].replace(',', '').replace('#', '')
  			this.num_hands = all_rounds.length
      this.buy_in = 'unknown'
      this.num_players = 'unknown'
      this.prize_pool = 'unknown'
      var x = all_rounds[all_rounds.length - 1].substring(0, all_rounds[all_rounds.length - 1].indexOf('*** SUMMARY ***')).split('\r\n').reverse().findIndex(function (line) {
        return usersObj.check(line)
      })
      this.placed = 'unknown'// this.summary.split(" ")[2];
  		}
  		this.final_table = this.placed < 11 ? 1 : 0
  		let ll = all_rounds[0].split('\r\n')[0].split(' - ')
  		this.date = ll[ll.length - 1]
  		var rounds = this.parse(all_rounds)
    this.calculations = calcObj.rounds(rounds)
  		this.rounds = rounds

  		return this
  }
  get (id) {
    return typeof id === 'string' ? this[id] : this
  }
  parse (data) {
	  var rounds = []
	  for (var i = 0; i < data.length; i++) {
	  	var e = data[i]
	  	if (e.length) {
		    var roundObj = new Round(e, i, this.tournament_id)
		  	rounds.push(roundObj)
	  	}
	  }
	  return rounds
  }
}

module.exports = Tournament
