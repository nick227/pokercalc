"use strict";
var _ = require('underscore');
class Calc{
	constructor(data){
		this.deal_luck_avg = (_.pluck(data, 'hc_val').reduce(function(a,b){return parseFloat(a)+parseFloat(b);}) / data.length * 100).toFixed(2);
		this.board_luck_total = _.pluck(data, 'made_hand_val').reduce(function(a,b){return parseFloat(a)+parseFloat(b);}, 0).toFixed(2);
		this.board_luck_avg = (this.board_luck_total / data.length).toFixed(2);
		this.num_all_ins = _.pluck(data, 'all_in').filter(function(i){return i!==false;}).length;
		this.raise_totals = this.loop(data, this.raiseTotalsCalc, 'raises');
		
		this.status_history = this.loop(data, this.statusCalc, 'status');
		this.rounds_raised = this.loop(data, this.raiseRoundsCalc);
		this.vpip = this.loop(data, this.vpipCalc);
	}
	loop(data, fn, key){
		let o = {};
		let res = null;
		if(typeof key==='string'){
			o = _.pluck(data, key);
		}else{
			o = data;
		}
		_.each(o, function(list, i){
			if(typeof list === 'array'){
				_.each(list, function(item){
					res = fn(item, res);
				});
			}else{
				res = fn(list, res);
			}
		});
		return res;
	}
	vpipCalc(item, res){

	}
	raiseRoundsCalc(item, res){
		if(res===null){
			res = 0;	
		}
		if(item.raises.length > 0){
			res = res + 1;
		}
		return res;
	}
	statusCalc(item, res){
		if(res===null){
			res = {};	
		}
		if(typeof res[item] !== 'number'){
			res[item] = 0;
		}
		res[item]++;
		return res;

	}
	raiseTotalsCalc(items, res){
		if(res === null){
			console.log('res');
			res = {flop:{total_bet:0,count:0}, 'pre-flop':{total_bet:0,count:0, avg_bet:0}, turn:{total_bet:0,count:0, avg_bet:0}, river:{total_bet:0,count:0, avg_bet:0}};	
		}
		_.each(items, function(o, i){
				res[o.round_name.toLowerCase()].total_bet = res[o.round_name.toLowerCase()].total_bet + parseInt(o.amount);
				res[o.round_name.toLowerCase()].count++;
				res[o.round_name.toLowerCase()].avg_bet = (res[o.round_name.toLowerCase()].total_bet / res[o.round_name.toLowerCase()].count).toFixed(2);

		});
		return res;
	}
}
module.exports = Calc;