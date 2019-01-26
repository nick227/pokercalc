'use strict'
const Users = require('./Users.js')
const usersObj = new Users()
var handValues = require('../misc/handVals.js')
var handChecker = require('../misc/handChecker.js')
class Round {
  constructor (data, index, tournament_id) {
    this.setProps(data)
    this.count = index
    this.tournament_id = tournament_id
    this.hand_id = this.getHandId()
    this.action = this.getAction()
    this.three_bets = this.get3Bets()
    this.num_players = this.getNumPlayers()
    this.position = this.getPosition()
    this.status = this.getStatus()
    this.all_in = this.getAllIn()
    this.big_blind = this.getBlinds()
    this.dealt_cards = this.getDealt()
    this.stack = this.getStack()
    this.hc_val = this.getHcVal()
    this.made_hand = this.getMadeHand()
    this.winLoss = this.getWinLoss()
    this.pot_size = this.getPotSize()
    this.raises = this.getBets()
    this.opponent_num_bb = this.getOpponentBets()
    this.num_raises = this.raises.length
    this.show_down = this.getShowCards()
    this.raises_num_bb = this.getNumBB()
    this.winning_hand = this.getWinningHand()
    return { 
      hole_cards: this.hole_cards,
      board: this.board,
      winLoss: this.winLoss,
      pot_size: this.pot_size,
      stack: this.stack,
      status: this.status,
      num_players: this.num_players,
      big_blind: this.big_blind,
      position: this.position,
      all_in: this.all_in,
      num_raises: this.num_raises,
      raises_num_bb: this.raises_num_bb,
      count: this.count,
      hand_name: this.made_hand.name,
      dealt_cards: this.dealt_cards,
      tournament_id: this.tournament_id,
      hand_id: this.hand_id,
      hand_rank: this.made_hand.rank,
      hc_val: this.hc_val,
      hand_odds: this.made_hand.val,
      action: this.action,

      raises: this.raises,
      opponent_raises: this.opponent_num_bb,
      show_down: this.show_down
    }
  }
  getWinningHand(){
    var id = this.show_down.findIndex(function(line){return line.indexOf('shows')});
    var shows  = id > -1 ? this.show_down[id].substring(this.show_down[id].indexOf("[")+1, this.show_down[id].indexOf("]")) : false;
        console.log(shows);
        return shows;
  }
  get3Bets(){
    var action = this.action
    var res = []; var line = ''
    var end1 = action.findIndex(function(l){return l.indexOf("*** FLOP ***") > -1;})
    var end2 = action.findIndex(function(l){return l.indexOf("*** TURN ***") > -1;})
    var end3 = action.findIndex(function(l){return l.indexOf("*** RIVER ***") > -1;})
    var end4 = action.findIndex(function(l){return l.indexOf("*** SHOW DOWN ***") > -1;}) > 1 ? action.findIndex(function(l){return l.indexOf("*** SHOW DOWN ***") > -1;}) : action.length

    let pf = end1 > -1 ? action.slice(0, end1) : []
    let f = end1 > -1 && end2 > -1 ? action.slice(end1+1, end2) : []
    let t = end2 > -1 && end3 > -1 ? action.slice(end2+1, end3) : []
    let r = end3 > -1 && end2 > -1  && end3 > -1 ? action.slice(end3+1, end4) : []
    let events = [pf, f, t, r], e=null
    for(var i = 0, length1 = events.length; i < length1; i++){
      e = events[i]
      res.push(this.parse3(e));
    }
    return res;
  }

  parse3(obj){
    var line = '', uraise=0, oraise=0
    for(var i = 0, length1 = obj.length; i < length1; i++){
      line = obj[i]
      if(line.indexOf("raises") > -1 || line.indexOf("bets") > -1){
        if(usersObj.check(line)){
          if(oraise){
            uraise++
          }else{
            uraise=1
          }
        }else{
          oraise++
        }
      }
    }
    return uraise;
  }
  getOpponentBets () {
    var action = this.action
    var res = []; var r = {}
    for (var i = 0, length1 = action.length; i < length1; i++) {
      var a = action[i].split(' ')
      if ((a.indexOf('raises') > -1 || a.indexOf('bets') > -1) && (!usersObj.check(a[0]))) {
        r[a[0]] = typeof r[a[0]] === 'number' ? r[a[0]] : 0
        if (a.length === 3) {
          r[a[0]] = parseInt(r[a[0]]) + parseInt(a[2])
        }
        if (a.length === 5 || a.length === 8) {
          r[a[0]] = parseInt(r[a[0]]) + (parseInt(a[4]) - parseInt(a[2]))
        }
      }
    }
    for (var k in r) {
      r[k] = (r[k] / this.big_blind)
      res.push({name:k, num_bb:r[k]})
    }
    return res
  }
  getShowCards () {
    var start = this.lines.findIndex(function (line) {
      return line.indexOf('*** SHOW DOWN ***') > -1
    })
    var end = this.lines.findIndex(function (line) {
      return line.indexOf('*** SUMMARY ***') > -1
    })
    var res = start > -1 ? this.lines.slice(start + 1, end) : []
    return res
  }
  getBets () {
    var linesAll = this.lines; var br = null; var res = []; var amount = null; var type = null; var num_bb = 0
    for (var i = 0, length1 = linesAll.length; i < length1; i++) {
      var line = linesAll[i]
      if (line.indexOf('*** HOLE CARDS ***') > -1 || line.indexOf('*** FLOP ***') > -1 || line.indexOf('*** TURN ***') > -1 || line.indexOf('*** RIVER ***') > -1) {
        var br = line.substring(4, line.indexOf(' ***')).replace('HOLE CARDS', 'PRE-FLOP').toLowerCase()
      }
      if (usersObj.check(line) && (line.indexOf('raises') > -1 || line.indexOf('bets') > -1 || line.indexOf('calls') > -1)) {
        amount = line.split(' ')
        amount = amount[2]
        type = line.indexOf('raises') > -1 ? 'raise' : line.indexOf('calls') > -1 ? 'call' : line.indexOf('bets') ? 'bet' : ''
        num_bb = isNaN(amount) ? 0 : amount / this.big_blind
        res.push({ round_name: br, amount: amount, type: type, num_bb: num_bb })
      }
      if (usersObj.check(line) && (line.indexOf('checks') > -1)) {
        res.push({ round_name: br, amount: 0, type: 'check', num_bb: 0 })
      }
    }
    return res
  }
  getNumBB () {
    var total = 0
    for (var i = 0, length1 = this.raises.length; i < length1; i++) {
      total = total + this.raises[i].num_bb
    }
    return isNaN(total) ? 0 : total
  }
  getBlinds () {
    var linesAll = this.lines; var total = 0
    let x = linesAll.findIndex(function (line) {
      return line.indexOf('posts big blind') > -1
    })
    return typeof linesAll[x] === 'string' ? parseInt(linesAll[x].split(' ')[linesAll[x].split(' ').length - 1]) : 0
  }
  setProps (data) {
    this.lines = data.split('\r\n').filter(Boolean)
    var linesAll = this.lines
    var self = this
    self.cards = {}
    const props = [{ name: 'flop_cards', term: '*** FLOP ***' },
      { name: 'turn_card', term: '*** TURN ***' },
      { name: 'river_card', term: '*** RIVER ***' },
      { name: 'hole_cards', term: 'Dealt to ' },
      { name: 'board', term: 'Board ' }
    ]
    props.forEach(function (prop) {
      var x = linesAll.findIndex(function (line) {
        var j = line.indexOf(prop.term) > -1 ? line.indexOf(prop.term) : ''
        return line.indexOf(prop.term) > -1
      })
      let val = typeof linesAll[x] === 'string' ? linesAll[x].substring(linesAll[x].lastIndexOf('[') + 1, linesAll[x].lastIndexOf(']')) : ''
      if (prop.name === 'hole_cards') {
        val = self.sortCards(val)
      }
      self[prop.name] = val
    })
  }
  getDealt () {
    var suitVals = { 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 }
    var card1 = this.hole_cards.split(' ')[0][0]
    var card2 = this.hole_cards.split(' ')[1][0]
    var card1s = this.hole_cards.split(' ')[0][1]
    var card2s = this.hole_cards.split(' ')[1][1]
    var card1V = typeof suitVals[card1] === 'number' ? suitVals[card1] : card1
    var card2V = typeof suitVals[card2] === 'number' ? suitVals[card2] : card2
    var h = card1 + card2
    if (card2V > card1V) {
      h = card2 + card1
    }
    if (card1s === card2s) {
      h = h + 's'
    }
    return h
  }
  sortCards (hole_cards) {
    var suitVals = { 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 }
    var card1 = hole_cards.split(' ')[0][0]
    var card2 = hole_cards.split(' ')[1][0]
    var card1s = hole_cards.split(' ')[0][1]
    var card2s = hole_cards.split(' ')[1][1]
    var card1V = typeof suitVals[card1] === 'number' ? suitVals[card1] : card1
    var card2V = typeof suitVals[card2] === 'number' ? suitVals[card2] : card2
    var h = hole_cards
    if (card2V > card1V) {
      h = card2 + card2s + ' ' + card1 + card1s
    }
    return h
  }
  getHandId () {
    var linesAll = this.lines; var total = 0
    return linesAll[0].substring(linesAll[0].indexOf('#') + 1, linesAll[0].indexOf(':'))
  }
  getPotSize () {
    var linesAll = this.lines; var total = 0
    let x = linesAll.findIndex(function (line) {
      return line.indexOf('Total pot') > -1
    })
    return !isNaN(linesAll[x].split(' ')[2]) ? linesAll[x].split(' ')[2] : 0
  }
  getWinLoss () {
    var linesAll = this.lines; var total = 0
    var x = linesAll.findIndex(function (line) {
      return usersObj.check(line) && line.indexOf('collected') > -1
    })
    var collected = linesAll[x]
    if (collected) {
      total = linesAll[x].split(' ')[2]
    } else {
      total = this.getLoss()
    }
    return total
  }
  getLoss () {
    var linesAll = this.lines; var total = 0; var line = ''
    var x = linesAll.findIndex(function (line) {})
    for (var i = 0, length1 = linesAll.length; i < length1; i++) {
      line = linesAll[i]
      if (usersObj.check(line) && (line.indexOf('calls') > -1 || line.indexOf('bets') > -1)) {
        var val = line.split(' ')[2]
        total = parseInt(total) + parseInt(val)
      }
      if (usersObj.check(line) && (line.indexOf('posts the ante') > -1 || line.indexOf('posts the big blind') > -1 || line.indexOf('posts the small blind') > -1 || line.indexOf('raises') > -1)) {
        var parts = line.split(' ')
        var val = parts[parts.length - 1]
        total = parseInt(total) + parseInt(val)
      }
    }
    total = !isNaN(total) ? total * -1 : 0
    return total
  }
  getMadeHand () {
    var cards = (this.board + ' ' + this.hole_cards).split(' ')
    var res = handChecker(cards)
    return res
  }
  getHcVal () {
    var suitVals = { 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 }
    var card1 = this.hole_cards.split(' ')[0][0]
    var card2 = this.hole_cards.split(' ')[1][0]
    var card1s = this.hole_cards.split(' ')[0][1]
    var card2s = this.hole_cards.split(' ')[1][1]
    var card1V = typeof suitVals[card1] === 'number' ? suitVals[card1] : card1
    var card2V = typeof suitVals[card2] === 'number' ? suitVals[card2] : card2
    var h = card1 + card2
    if (card2V > card1V) {
      h = card2 + card1
    }
    if (card1s === card2s) {
      h = h + 's'
    }
    return handValues[h]
  }
  getStack () {
    var linesAll = this.lines; var br = null; var res = []; var amount = null
    var x = linesAll.findIndex(function (line) {
      return usersObj.check(line)
    })
    return linesAll[x].substring(linesAll[x].indexOf('(') + 1, linesAll[x].indexOf(')')).split(' ')[0]
  }
  getAllIn () {
    var linesAll = this.lines
    var x = linesAll.findIndex(function (line) {
      return usersObj.check(line) && line.indexOf('all-in') > -1
    })
    return x > -1
  }
  getAction () {
    var linesAll = this.lines
    var start = linesAll.findIndex(function (line) {
      return line.indexOf('*** HOLE CARDS ***') > -1
    }) + 1
    var end = linesAll.findIndex(function (line) {
      return line.indexOf('*** SUMMARY ***') > -1
    })
    var lines = linesAll.slice(start, end)
    return lines
  }
  getStatus (linesAll) {
    var linesAll = this.lines
    var start = linesAll.findIndex(function (line) {
      return line.indexOf('*** SUMMARY ***') > -1
    }) + 1
    var lines = linesAll.slice(start, linesAll.length)
    var x = lines.findIndex(function (line) {
      return usersObj.check(line)
    })
    var details = lines[x]
    var event = ''
    event = details.indexOf('collected') > -1 ? 'win-folds' : event
    event = details.indexOf('won') > -1 ? 'win-showdown' : event
    event = details.indexOf('lost') > -1 ? 'lost-showdown' : event
    event = details.indexOf('mucked') > -1 ? 'lost-showdown' : event
    event = details.indexOf('folded before Flop') > -1 ? 'fold-preflop' : event
    event = details.indexOf('folded before the Draw') > -1 ? 'sitting-out' : event
    event = details.indexOf('folded on the Flop') > -1 ? 'fold-flop' : event
    event = details.indexOf('folded on the Turn') > -1 ? 'fold-turn' : event
    event = details.indexOf('folded on the River') > -1 ? 'fold-river' : event
    return event
  }
  getNumPlayers () {
    var linesAll = this.lines
    var lines = linesAll.slice(2, linesAll.length)
    var stop = lines.findIndex(function (line) {
      return line.indexOf('Seat ') === -1
    })
    lines = lines.slice(0, stop)
    return lines.length
  }
  getPosition () {
    var linesAll = this.lines
    var position = null
    var start = linesAll.findIndex(function (line) {
      return line.indexOf('Dealt to ') > -1
    }) + 1
    var stop = linesAll.findIndex(function (line) {
      return line.indexOf('*** FLOP ***') > -1
    })
    var lines = linesAll.slice(start, stop)
    var x = lines.findIndex(function (line) {
      return usersObj.check(line)
    })
    if (x === 0) {
      position = 'UTG'
    }
    if (x === this.num_players - 1) {
      position = 'big blind'
    }
    if (x === this.num_players - 2) {
      position = 'small blind'
    }
    if (x === this.num_players - 3 || (this.num_players === 2 && x === 0)) {
      position = 'button'
    }
    if (x > 0 && x < this.num_players - 3) {
      position = 'UTG+' + (x)
    }
    return position
  }
  convHand (obj) {
    var suitVals = { 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 }
    var card1 = obj.split(' ')[0][0]
    var card2 = obj.split(' ')[1][0]
    var card1s = obj.split(' ')[0][1]
    var card2s = obj.split(' ')[1][1]
    var card1V = typeof suitVals[card1] === 'number' ? suitVals[card1] : card1
    var card2V = typeof suitVals[card2] === 'number' ? suitVals[card2] : card2
    var h = card1 + card2
    if (card2V > card1V) {
      h = card2 + card1
    }
    if (card1s === card2s) {
      h = h + 's'
    }
    return h
  }
}

module.exports = Round
