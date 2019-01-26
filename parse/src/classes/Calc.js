'use strict'
const _ = require('underscore')
const Users = require('./Users.js')
const usersObj = new Users()
class Calc {
  constructor (data) {
    this.data_length = null
    return this
  }
  totals(data){

  }
  rounds (data) {
    var res = {}
    this.data_length = Object.keys(data).length
    res.hc_val = (_.pluck(data, 'hc_val').reduce(function (a, b) { return parseFloat(a) + parseFloat(b) }) / data.length * 100).toFixed(2)
    res.num_all_ins = _.pluck(data, 'all_in').filter(function (i) { return i !== false }).length
    res.raise_totals = this.loop(data, this.raiseTotalsCalc, 'raises')
    res.num_bb_avg = (_.pluck(data, 'raises_num_bb').reduce(function (a, b) { return parseFloat(a) + parseFloat(b) }) / data.length).toFixed(2)
    res.status_history = this.loop(data, this.statusCalc, 'status')
    res.total_raises = (this.loop(data, this.raiseTotalCalc)).toFixed(0)
    res.rounds_raised = (this.loop(data, this.raiseRoundsCalc)).toFixed(0)
    res.raise_percent = (res.total_raises / (data.length * 4) * 100).toFixed(2)
    res.threeBet = ((this.loop(data, this.threeBetCalc) / this.data_length) * 100).toFixed(2)
    res.vpip = ((this.loop(data, this.vpipCalc) / this.data_length) * 100).toFixed(2)
    res.pfr = ((this.loop(data, this.pfrCalc) / this.data_length) * 100).toFixed(2)
    res.aggression = this.aggroCalc(data)

    return res
  }
  tournament (data) {
    var calculations = _.pluck(data, 'calculations')
    var keys = Object.keys(calculations[0])
    keys.sort()
    var res = {}
    res.num_tournaments = calculations.length
    _.each(keys, function (key) {
      let r = _.pluck(calculations, key).reduce(function (a, b) { return parseFloat(a) + parseFloat(b) })
      if (!isNaN(r)) {
        res[key] = (r / data.length).toFixed(2)
      }
    })
    keys = _.allKeys(data[0])
    _.each(keys, function (key) {
      if (key !== 'calculations' && key !== 'final_table') {
        var v = (_.pluck(data, key).reduce(function (a, b) { return parseFloat(a) + parseFloat(b) }) / data.length).toFixed(2)
        if (!isNaN(v)) {
          res[key] = v
        }
      }
      if (key === 'final_table') {
        var v = (_.pluck(data, key).reduce(function (a, b) { return parseFloat(a) + parseFloat(b) })).toFixed(0)
        if (!isNaN(v)) {
          res[key] = v
        }
      }
    })
    return { averages: res, summaries: this.summaries(data) }
  }
  summaries (data) {
    var res = []
    var obj = {}
    for (var i = 0, length1 = data.length; i < length1; i++) {
      var d = data[i]
      obj = {
        calculations:{
          buy_in: d.buy_in,
          prize_pool: d.prize_pool,
          final_table: d.final_table,
          rounds_raised: d.calculations.rounds_raised,
          rs_perc: d.calculations.raise_percent,
          total_raises: d.calculations.total_raises,
          vpip: d.calculations.vpip,
          pfr: d.calculations.pfr,
          agg: d.calculations.aggression.agg,
          af: d.calculations.aggression.af,
          bb_avg: d.calculations.num_bb_avg,
          pf_bb: d.calculations.raise_totals['pre-flop'].bb_avg,
          fp_bb: d.calculations.raise_totals['flop'].bb_avg,
          tn_bb: d.calculations.raise_totals['turn'].bb_avg,
          rv_bb: d.calculations.raise_totals['river'].bb_avg
        },
        date: d.date.split(' ')[0],
        winnings: d.winnings,
        placed: d.placed,

        num_players: d.num_players,
        hc_val: d.calculations.hc_val,
        num_hands: d.num_hands,
        pf_rp: ((d.calculations.raise_totals['pre-flop'].count / d.num_hands) * 100).toFixed(2),

        fp_rp: ((d.calculations.raise_totals['flop'].count / d.num_hands) * 100).toFixed(2),

        tn_rp: ((d.calculations.raise_totals['turn'].count / d.num_hands) * 100).toFixed(2),

        rv_rp: ((d.calculations.raise_totals['river'].count / d.num_hands) * 100).toFixed(2),

        checks: d.calculations.aggression.check,
        calls: d.calculations.aggression.call,
        bets: d.calculations.aggression.bet,
        raises: d.calculations.aggression.raise,

        loss_sd: d.calculations.status_history['lost-showdown'],
        fold_pf: d.calculations.status_history['fold-preflop'],
        fold_fl: d.calculations.status_history['fold-flop'],
        fold_tn: d.calculations.status_history['fold-turn'],
        fold_rv: d.calculations.status_history['fold-river'],
        win_fl: d.calculations.status_history['win-folds'],
        win_sd: d.calculations.status_history['win-showdown'],
        tournament_id: d.tournament_id
      }
      var ignore = ['date', 'winnings']
      for (var k in obj) {
        if (ignore.indexOf(k) === -1) {
          obj[k] = validate(obj[k])
        }
      }
      res.push(obj)
    }
    return res
  }
  positions (data) {
    var res = []
  }
  cards (data) {
    var rounds = _.pluck(data, 'rounds')
    var obj = {}; var res = []
    _.each(rounds, function (round, i) {
      var raises = _.pluck(round, 'raises')
      var winLoss = _.pluck(round, 'winLoss')
      var cards = _.pluck(round, 'dealt_cards')

      var positionsAll = _.pluck(round, 'position')
      _.each(cards, function (hc, i) {
        if (typeof obj[hc] === 'undefined') {
          obj[hc] = { num_bb: 0, count: 0, winLoss: 0, pf_raises: 0, positions: {}, history: [] }
        }
        let num_bb = raises[i].length ? _.pluck(raises[i], 'num_bb').reduce(function (a, b) { return parseFloat(a) + parseFloat(b) }) : 0
        obj[hc].num_bb = (typeof parseFloat(obj[hc].num_bb) === 'number' ? parseFloat(obj[hc].num_bb) : 0) + parseFloat(num_bb)
        obj[hc].count = obj[hc].count + 1
        obj[hc].num_bb_avg = obj[hc].num_bb / obj[hc].count
        obj[hc].winLoss = parseInt(obj[hc].winLoss) + (typeof !isNaN(parseInt(winLoss[i])) ? parseInt(winLoss[i]) : 0)
        obj[hc].positions[positionsAll[i]] = typeof obj[hc].positions[positionsAll[i]] === 'number' ? obj[hc].positions[positionsAll[i]]++ : 1
        obj[hc].pf_raises = raises[i].length ? obj[hc].pf_raises + _.filter(raises[i], function (e) {
          return e.round_name === 'pre-flop'
        }).length : obj[hc].pf_raises
      })
    })
    let cards = Object.keys(obj)
    _.each(cards, function (c) {
      if (c.length) {
        let o = { cards: c,
						 positions: obj[c].positions,
						 winLoss: obj[c].winLoss,
						 count: obj[c].count,
						 pf_raises: obj[c].pf_raises,
						 num_bb_avg: obj[c].num_bb_avg.toFixed(2),
						 num_bb: obj[c].num_bb.toFixed(2) }

        res.push(o)
      }
    })

    return res
  }
  loop (data, fn, key) {
    let data_len = this.data_length
    let o = {}
    let res = null
    if (typeof key === 'string') {
      o = _.pluck(data, key)
    } else {
      o = data
    }
    _.each(o, function (list, i) {
      if (typeof list === 'array') {
        _.each(list, function (item) {
          res = fn(item, res, data_len)
        })
      } else {
        res = fn(list, res, data_len)
      }
    })
    return res
  }
  betsCalc (item, res) {
    if (res === null) {
      res = 0
    }
    if (item.raises.length) {
      var raises = item.raises
      raises = _.filter(raises, function (obj) {
        return obj.type === 'raise' || obj.type === 'bet'
      })
      res = parseInt(res) + parseInt(raises.length)
    }
    return res
  }
  aggroCalc (data) {
    var raise = null; var obj = { check: 0, bet: 0, raise: 0, call: 0 }
    var raises = _.flatten(_.pluck(data, 'raises'))
    for (var i = 0, length1 = raises.length; i < length1; i++) {
      raise = raises[i]
      obj[raise.type] = obj[raise.type] + 1
    }
    obj.agg = ((obj.bet + obj.raise) / (obj.bet + obj.raise + obj.call + obj.check) * 100).toFixed(2)
    obj.af = ((obj.bet + obj.raise) / obj.call).toFixed(2)
    return obj
  }
  threeBetCalc (item, res) {
    if (res === null) {
      res = 0
    }

    return res
  }
  pfrCalc (item, res) {
    if (res === null) {
      res = 0
    }
    var raises = item.raises
    raises = _.filter(raises, function (obj) {
      return (obj.type === 'raise' || obj.type === 'bet') && obj.round_name === 'pre-flop'
    })
    if (raises.length) {
      res++
    }
    return res
  }
  vpipCalc (item, res) {
    if (res === null) {
      res = 0
    }
    if (item.raises.filter(function(i){return i.round_name === 'pre-flop' && i.type !== 'check'}).length > 0) {
      res++
    }
    return res
  }
  raiseRoundsCalc (item, res) {
    if (res === null) {
      res = 0
    }
    if (item.raises.length > 0) {
      res = res + 1
    }
    return res
  }
  raiseTotalCalc (item, res) {
    if (res === null) {
      res = 0
    }
    if (item.raises.length > 0) {
      res = res + parseInt(item.raises.length)
    }
    return res
  }
  statusCalc (item, res) {
    if (res === null) {
      res = {}
    }
    if (typeof res[item] !== 'number') {
      res[item] = 0
    }
    res[item]++
    return res
  }
  raiseTotalsCalc (items, res, total) {
    if (res === null) {
      res = { 'pre-flop': { count: 0, num_bb: 0, avg_bb: 0, avg: 0 },
        flop: { count: 0, num_bb: 0, avg_bb: 0, avg: 0 },
        turn: { count: 0, num_bb: 0, avg_bb: 0, avg: 0 },
        river: { count: 0, num_bb: 0, avg_bb: 0, avg: 0 } }
    }
    _.each(items, function (o, i) {
      res[o.round_name.toLowerCase()].count++
      res[o.round_name.toLowerCase()].num_bb = validate(parseInt(res[o.round_name.toLowerCase()].num_bb) + parseFloat(o.num_bb))
      res[o.round_name.toLowerCase()].bb_avg = validate((res[o.round_name.toLowerCase()].num_bb / res[o.round_name.toLowerCase()].count)).toFixed(2)
      res[o.round_name.toLowerCase()].avg = validate(((res[o.round_name.toLowerCase()].count / total) * 100).toFixed(2))
    })
    return res
  }
}
function validate (num) {
  return typeof num === 'undefined' ? 0 : typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num
}
module.exports = Calc
