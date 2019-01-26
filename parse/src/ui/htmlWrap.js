'use strict'
var _ = require('underscore')
var charts = require('../d3/generator.js')
var jscript = require('./javascript.js')
var stylesheet = require('./stylesheet.js')
function htmlWrap (data) {
  var multiAts = ['vpip', 'pfr', 'num_bb_avg', 'hc_val', 'agg', 'win_fl', 'win_sd', 'loss_sd','fold_pf', 'fold_fl', 'fold_tn', 'fold_rv'];
  var vpipObj = data.rounds.map(function(o){return {vpip:o.calculations.vpip, winnings: o.winnings}});
  var chartW = 1200;
  var chartH = 600;
  var tournAggObj = data.rounds.map(function(obj){
    var res = {}
    res.id = obj.tournament_id
    res.winnings = obj.winnings
    res.placed = obj.placed
    res.num_hands = obj.num_hands
    res.date = obj.date
    res.num_players = obj.num_players
    res.bets = obj.rounds.map(function(o){
      return {stack:o.stack, winLoss:o.winLoss, raises_num_bb:o.raises_num_bb, hole_cards:o.hole_cards, count:o.count, hand_odds:o.hand_odds}
    });
    return res
  });
  var roundsAll = _.flatten(_.pluck(data.rounds, 'rounds'))
  var raiseChartObj = roundsAll.filter(function(d){return d.num_raises > 0;})
  //var raiseTableObj = updateRaisesData(data)
  var html = getHead()
      html += getPreloader()
      html += '<div class="section main flex-wrap">';
      html += '<h1 class="">Poker Report</h1>';
      html += '<div class="section">';
      html += '<a class="toggleNext nav-main preload">averages</a><div class="">'+getList(data.calculations)+'</div>';
      /*html += '<a class="toggleNext nav-main preload">tournament charts</a><div class="hidden chart section">'+charts('tourn_agg', [tournAggObj, chartW, chartH])+'</div>'
      html += '<a class="toggleNext nav-main preload">vpip chart</a><div class="hidden vpip-chart chart section">'+charts('bubble', [vpipObj, 'winnings', ['vpip'], chartW, chartH])+'</div>'
      html += '<a class="toggleNext nav-main preload">attributes chart</a><div class="hidden custom-chart chart section">'+charts('bubble', [data.summaries, 'winnings', multiAts, chartW, chartH])+'</div>'
      html += '<a class="toggleNext nav-main preload">wins charts</a><div class="hidden wins-chart chart section">'+charts('wins', [data.rounds, chartW])+'</div>'
      html += '<a class="toggleNext nav-main preload">raises chart</a><div class="hidden raises-chart chart section">'+charts('win_bb', [raiseChartObj, chartW, chartH])+'</div>'
      html += '<a class="toggleNext nav-main preload">hole cards</a><div class="hidden hands-graph chart section">'+charts('hand_strength', [chartW, chartH*2])+'</div>'
      html += '<a class="toggleNext nav-main preload">straights helper</a><div class="hidden section">' + require('../misc/straightsHtml.js') + '</div>'
      html += '<a class="toggleNext nav-main preload">card history</a><div class="hidden section">'+getTable(data.cards)+'</div>'
    	html += '<a class="toggleNext nav-main preload">table tournaments</a><div class="hidden section">' + getTable(data.summaries) + '</div>'*/
      html += '<a class="toggleNext nav-main preload">table hands</a><div class=" section">' + getTable(roundsAll) + '</div>'/*
    	html += '<a class="toggleNext nav-main preload">tournament grid</a><div class="hidden section">' + getList(data.rounds, true, true) + '</div>'*/

      html += '</div">';
      html += '</div">';
      html += getJs(data)
      html += closeBody()

  return html
}
function getPreloader () {
  return '<div class="preloader section">loading...</div>'
}
function getTable (data) {
  var ignore = ['calculations', 'action', 'raises', 'show_down', 'opponent_raises', 'dealt_cards', 'all_in', 'hand_rank', 'hc_val', 'hand_odds', 'hand_id']
  var keys = Object.keys(data[0])
  var tableObj = getTableBody(data, keys, ignore)
  var html = '<table class="sortable">'
      html += tableObj.thead
      html += tableObj.tbody
      html += '</table>'
      return html
}
function getTableBody(data, keys, ignore){
  var tbody = '', val=null, id = null, className = null, selects = {}
  _.each(data, function (item) {
    id = typeof item.tournament_id === 'number' ? item.tournament_id : typeof item.hand_id === 'string' ? item.hand_id : ''
    className = id ? 'action-row' : 'row'
    tbody += '<tr class="' + className + '" data-sid="' + id + '">'
    _.each(keys, function (k) {
      if (ignore.indexOf(k) === -1) {
        if (typeof item[k] === 'object') {
          item[k] = JSON.stringify(item[k]).replace(/"/g, '').replace(/{/g, '').replace(/}/g, '')
        }
        val = (isNaN(item[k]) ? item[k] : parseInt(item[k]).toFixed(0))
        tbody += '<td>' + val + '</td>'
        if(typeof selects[k] !== 'object'){ selects[k] = [];  }
        if(selects[k].indexOf(val) === -1){
          selects[k].push(val);
        }
      }
    })
    tbody += '</tr>'
  })
  var thead = getTableHead(keys, selects, ignore)
  return {thead: thead, tbody:tbody, selects:selects};
}
function getSelectHtml(obj){
  var html = '<select class="thead-select">', o=null
    html += '<option>...</option>';
  for(var i = 0, length1 = obj.length; i < length1; i++){
    o = obj[i]
    html += '<option value="'+o+'">'+o+'</option>';
  }
  html += '<option value="reset_rows">reset</option></select>';
  return html;
}
function getTableHead(keys, selects, ignore){
  var html = '<tr>'
  _.each(keys, function (key) {
    if (ignore.indexOf(key) === -1) {
     html += '<th>' + key + getSelectHtml(selects[key]) + '</th>'
    }
  })
  html += '</tr>'

  return html
}
function getList (data, sort, chart) {
  var htmlC = ''
  if (typeof Object.values(data)[0] !== 'object') {
    htmlC = '<ul>'
    for (var k in data) {
      data[k] = typeof data[k] === 'number' ? data[k].toFixed(2) : data[k]
      htmlC += '<li>' + k + ': ' + data[k] + '</li>'
    }
    htmlC += '</ul>'
  }
  /**************************/
  var html = '';
  if(data.length){
    var className = sort ? 'list' : ''
    html += '<ul class="main-list ' + className + '">'; var obj = []
    for (var i = 0, length1 = data.length; i < length1; i++) {
      var tournament = data[i]
      html += '<li class="sid' + tournament.tournament_id + '">'
      html += wrapTournament(tournament, 'tournament')
      html += '</li>'
    }
    html += '</ul>'
  }
  /**************************/
  var html0 = addSort(sort, data);
  /**************************/

  return htmlC + html0 + html
}
function addSort(check, data){
  var res = '';
  if (check) {
    var keys = []
    _.each(data[0], function (d, k) {
      keys.push(k)
    })
    _.each(data[0].calculations, function (d, k) {
      if (!isNaN(d)) {
        keys.push(k)
      }
    })
    res = '<div class="sortBy">sort:<BR>'
    for (var i = 0, length1 = keys.length; i < length1; i++) {
      var op = keys[i]
      res += '<a class="sort nav" data-sort="' + op + '">' + op + '</a> <BR />'
    }
    res += '</div>'

    res += `<script>document.addEventListener("DOMContentLoaded", function() {
            var options = {
                  valueNames:`;
    res += "['" + keys.join("','") + "']};"
    res += `var list = new List('poker-res', options);});</script>`;


  }
  return res;
}
function wrapTournament (obj, id) {
  var links = ['action', 'rounds', 'raise_totals', 'status_history', 'raises', 'show_down', 'opponent_raises']
  var html = '<ul class="item-list-' + id + '">';
  if (typeof obj.rounds === 'object' && run !== true) {
    var run = true
    html += '<li><a class="toggleNext nav preload">table view</a><div class="hidden">' + getTable(obj.rounds) + '</div></li>'
  }

  _.each(obj, function (item, key) {
    key = typeof key === 'string' ? key : typeof item.status === 'string' ? item.status : ''

    html += '<li class="' + key + '_item">'

    if(typeof item !== 'object'){
      if (key === 'hole_cards') {
        html += '<h2>' + item.split(' ')[0].split('')[0] +
            '<img alt="' + item.split(' ')[0].split('')[1] + '" src="./images/' + imgName(item.split(' ')[0].split('')[1]) + '" />' +
            item.split(' ')[1].split('')[0] + '<img alt="' + item.split(' ')[1].split('')[1] + '" src="./images/' + imgName(item.split(' ')[1].split('')[1]) + '" /></h2>'
      }
      if (key === 'board') {
        var cards = typeof item === 'string' ? item.split(' ') : []
        html += '<h2 class="board">'
        for (var i = 0, length1 = cards.length; i < length1; i++) {
          var c = cards[i]

          var cv = c.split('')[0]
          var cs = c.split('')[1]
          if (cv && cs) {
            html += cv + '<img alt="' + cs + '" src="./images/' + imgName(cs) + '" />'
          }
        }
        html += '</h2>'
      }
      if (key !== 'board' && key !== 'hole_cards') {
          html += '<div>' + key + ': ' + '<span class="' + key + '">' + item + '</span></div>'
      }
    }//end !== 'object'

    if (typeof item === 'object') {
      if (links.indexOf(key) > -1) {
        var l = typeof item === 'object' ? Object.values(item).length : !isNaN(item.length) ? item.length : ''
        var sid = key === 'action' ? obj.hand_id : ''
        html += '<a class="toggleNext">' + key + ': ' + l + '</a><div class="hidden sid' + sid + '">'
        html += key !== 'raises' ? getSortMenu(_.allKeys(item[0]).filter(function (v) { return !isNaN(item[0][v]) })) : ''
      } else {
        html += '<div class="">'
      }
      html += wrapTournament(item, key)
      html += '</div>'
    }//end === 'object'
    html += '</li>'
  })
  html += '</ul>'

  return html
}
function getSortMenu (vars) {
  var html = '<div class="sort-menu">sort:<BR />'
  _.each(vars, function (item, i) {
    html += '<a class="sortable nav" data-selector="' + item + '">' + item + '</a> | '
  })
  html += '</div>'
  return html
}
function closeBody () {
  return '</body></html>';
}
function getJs (data) {
  var html = '<script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js"></script><script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js"></script><script>'
      html += jscript
      html += '</script>'
  return html
}
function getHead () {
  return `<!DOCTYPE html>
      <html>
<head>
  <title>PokerStars Report</title>
  ` + stylesheet + `
</head><body id="poker-res">`
}

function imgName (k) {
  var obj = { d: 'diamond',
           s: 'spade',
           h: 'heart',
           c: 'club' }
  return obj[k] + '.png'
}
function updateRaisesData(data){
    var rounds = _.flatten(_.pluck(data.rounds, 'rounds')).filter(function(d){return d.raises_num_bb > 0;})
    /*var keys = ['pre-flop', 'flop', 'turn', 'river'];
    _.each(rounds, function(round, i){
      _.each(keys, function(k){
        var v = _.reject(_.where(round.raises, {round_name:k}), function(item){return item.type==='call'});
        round[k] = 0;
        round[k] = v.length ? _.reduce(v, function(a,b){return parseFloat(a.num_bb) + parseFloat(b.num_bb)}).num_bb : 0;
      })
    })*/
    return rounds;
}
module.exports = htmlWrap
