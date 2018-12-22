"use strict";
const Users = require("./Users.js");
const usersObj = new Users();
var handValues = require('../handVals.js');
var handChecker = require('../handChecker.js');
class Round{
	constructor(data){
    this.setProps(data);
    this.hand_id = this.getHandId();
    this.action = this.getAction();
    this.num_players = this.getNumPlayers();
    this.postion = this.getPosition();
    this.status = this.getStatus();
    this.all_in = this.getAllIn();
    this.raises = this.getBets();
    this.stack = this.getStack();
    this.hc_val = this.getHcVal();
    this.made_hand = this.getMadeHand();
    this.winLoss = this.getWinLoss();
    this.pot_size = this.getPotSize();

    return {hand_id:this.hand_id, 
            action:this.action, 
            num_players:this.num_players, 
            postion:this.postion, 
            status:this.status, 
            all_in:this.all_in, 
            raises:this.raises, 
            stack:this.stack, 
            hc_val:this.hc_val, 
            made_hand_name:this.made_hand.name, 
            made_hand_val:this.made_hand.val, 
            made_hand_rank:this.made_hand.rank, 
            winLoss:this.winLoss, 
            board:this.board,
            /*flop_cards:this.flop_cards,
            turn_card:this.turn_card,
            river_card:this.river_card,*/
            hole_cards:this.hole_cards,
            pot_size:this.pot_size
          };
	}
  setProps(data){
    this.lines = data.split("\r\n").filter(Boolean);
    var linesAll = this.lines;
    var self = this;
    self.cards = {};
      const props = [{name:'flop_cards', term:'*** FLOP ***'},
            {name:'turn_card', term:'*** TURN ***'},
            {name:'river_card', term:'*** RIVER ***'},
            {name:'hole_cards', term:'Dealt to '},
            {name:'board', term:'Board '}
      ];
      props.forEach(function(prop){
          var x = linesAll.findIndex(function(line){
            return line.indexOf(prop.term) > -1;
          });
          self[prop.name] = typeof linesAll[x]==='string' ? linesAll[x].substring(linesAll[x].lastIndexOf('[')+1, linesAll[x].lastIndexOf(']')) : '';
      });
  }
  getHandId(){
    var linesAll = this.lines, total=0;
    return linesAll[0].substring(linesAll[0].indexOf('#')+1, linesAll[0].indexOf(':'));
  }
  getPotSize(){
    var linesAll = this.lines, total=0;
    let x = linesAll.findIndex(function(line){
      return line.indexOf('Total pot') > -1;
    });
    return linesAll[x].split(" ")[2];

  }
  getWinLoss(){
    var linesAll = this.lines, total=0;
    var x = linesAll.findIndex(function(line){
      return usersObj.check(line) && line.indexOf('collected') > -1;
    });
    for(var i = 0, length1 = linesAll.length; i < length1; i++){
      var line = linesAll[i]
      if(usersObj.check(line) && (line.indexOf('calls') > -1 || line.indexOf('bets')> -1)){
        var val = line.split(" ")[2];
        total = parseInt(total) + parseInt(val);
      }
      if(usersObj.check(line) && (line.indexOf('posts the ante') > -1 || line.indexOf('posts the big blind') > -1 || line.indexOf('posts the small blind') > -1 || line.indexOf('raises') > -1)){
        var parts = line.split(" ");
        var val = parts[parts.length-1];
        total = parseInt(total) + parseInt(val);
      }
    }
    if(x === -1 && total > 0){
      total = total *-1;
    }
    return total;
  }
  getMadeHand(){
    var cards = (this.board + ' ' + this.hole_cards).split(" ");
    var res = handChecker(cards);
    return res;
  }
  getHcVal(){
    var suitVals = {'T':10, 'J':11, 'Q':12, 'K':13, 'A':14};
    var card1 = this.hole_cards.split(" ")[0][0];
    var card2 = this.hole_cards.split(" ")[1][0];
    var card1s = this.hole_cards.split(" ")[0][1];
    var card2s = this.hole_cards.split(" ")[1][1];
    var card1V = typeof suitVals[card1] === 'number' ? suitVals[card1] : card1;
    var card2V = typeof suitVals[card2] === 'number' ? suitVals[card2] : card2;
    var h = card1 + card2;
    if(card2V > card1V){
      h = card2 + card1;
    }
    if(card1s === card2s){
      h = h + 's';
    }
    return handValues[h];
  }
  getStack(){
    var linesAll = this.lines, br=null, res=[],amount=null;
    var x = linesAll.findIndex(function(line){
      return usersObj.check(line);
    });
    return linesAll[x].substring(linesAll[x].indexOf('(')+1, linesAll[x].indexOf(')')).split(" ")[0];

  }
  getBets(){
    var linesAll = this.lines, br=null, res=[],amount=null,type=null;
    for(var i = 0, length1 = linesAll.length; i < length1; i++){
      var line = linesAll[i];
      if(line.indexOf('*** HOLE CARDS ***') > -1 || line.indexOf('*** FLOP ***') > -1 || line.indexOf('*** TURN ***') > -1 || line.indexOf('*** RIVER ***') > -1){
        var br = line.substring(4, line.indexOf(' ***')).replace('HOLE CARDS', 'PRE-FLOP').toLowerCase();
      }
      if(usersObj.check(line) && (line.indexOf('raises') > -1 || line.indexOf('bets') > -1 || line.indexOf('calls') > -1)){
        amount = line.split(" ");
        amount = amount[2];
        type = line.indexOf('raises') > -1 ? 'raise' : line.indexOf('calls') > -1 ? 'call' : line.indexOf('bets') ? 'bet' : '';
        res.push({round_name:br, amount:amount, type:type, handId:this.hand_id});
      }
    }
    return res;
  }
  getAllIn(){
    var linesAll = this.lines;
    var x = linesAll.findIndex(function(line){
      return usersObj.check(line) && line.indexOf('all-in') > -1;
    });
    return x > -1 ? linesAll[x] : false;
  }
  getAction(){
    var linesAll = this.lines;
    var start = linesAll.findIndex(function(line){
        return line.indexOf("*** HOLE CARDS ***") > -1;
      })+1;
    var end = linesAll.findIndex(function(line){
        return line.indexOf("*** SUMMARY ***") > -1;
      });
    var lines = linesAll.slice(start, end);
    return lines;
  }
  getStatus(linesAll){
    var linesAll = this.lines;
    var start = linesAll.findIndex(function(line){
        return line.indexOf("*** SUMMARY ***") > -1;
      })+1;
    var lines = linesAll.slice(start, linesAll.length);
    var x = lines.findIndex(function(line){
      return usersObj.check(line);
    });
    var details = lines[x];
    var event = 'unknown';
    event = details.indexOf('collected') > -1 ? 'win-folds' : event;
    event = details.indexOf('won') > -1 ? 'win-showdown' : event;
    event = details.indexOf('lost') > -1 ? 'lost-showdown' : event;
    event = details.indexOf('mucked') > -1 ? 'lost-showdown' : event;
    event = details.indexOf("folded before Flop") > -1 ? 'fold-preflop' : event;
    event = details.indexOf("folded before the Draw") > -1 ? 'sitting-out' : event;
    event = details.indexOf('folded on the Flop') > -1 ? 'fold-flop' : event;
    event = details.indexOf('folded on the Turn') > -1 ? 'fold-turn' : event;
    event = details.indexOf('folded on the River') > -1 ? 'fold-river' : event;
    return event;
  }
  getNumPlayers(){
    var linesAll = this.lines;
    var lines = linesAll.slice(2, linesAll.length);
    var stop = lines.findIndex(function(line){
      return line.indexOf('Seat ') === -1;
    });
    lines = lines.slice(0, stop);
    return lines.length;
  }
  getPosition(){
    var linesAll = this.lines;
      var position = null;
      var start = linesAll.findIndex(function(line){
        return line.indexOf("Dealt to ") > -1;
      })+1;
      var stop = linesAll.findIndex(function(line){
        return line.indexOf("*** FLOP ***") > -1;
      });
      var lines = linesAll.slice(start, stop);
      var x = lines.findIndex(function(line){
        return usersObj.check(line);
      });
      if(x === 0){
        position = 'UTG';
      }
      if(x === this.num_players-1){
        position = 'big blind';
      }
      if(x === this.num_players-2){
        position = 'small blind';
      }
      if(x === this.num_players-3 || (this.num_players === 2 && x === 0)){
        position = 'button';
      }
      if(x > 0 && x < this.num_players-3){
        position = 'UTG+' + (x-1);
      }
    return position;
  }
  convHand(obj){
    var suitVals = {'T':10, 'J':11, 'Q':12, 'K':13, 'A':14};
    var card1 = obj.split(" ")[0][0];
    var card2 = obj.split(" ")[1][0];
    var card1s = obj.split(" ")[0][1];
    var card2s = obj.split(" ")[1][1];
    var card1V = typeof suitVals[card1] === 'number' ? suitVals[card1] : card1;
    var card2V = typeof suitVals[card2] === 'number' ? suitVals[card2] : card2;
    var h = card1 + card2;
    if(card2V > card1V){
      h = card2 + card1;
    }
    if(card1s === card2s){
      h = h + 's';
    }
    return h;
  }
}


module.exports = Round;