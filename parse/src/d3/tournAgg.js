const D3Node = require('d3-node')
const lineChart = require('./line_chart')
const legend = require('./legend')
const _ = require('underscore')

function tournAgg(data, width, height){
    var res = data.map(function(obj){
    	let chart = getChart(obj, width, height);
    	return chart;
    });
	return res;

}
function getChart(obj, width, height){
	var yObjs = Object.keys(obj.bets[0]).filter(function(o){return o !== 'hole_cards' && o !== 'count'});
	var xKey = 'count', html = '';
	var labelList = _.pluck(obj.bets, 'hole_cards');
    	html = '<div class="section" data-sid="'+obj.id+'"">';
    	html += '<a class="action-row nav">tournament: ' + obj.id + '</a>';
    	html += '<h4>date: ' + obj.date + '</h4>';
    	html += '<h4>winnings: ' + obj.winnings + '</h4>';
    	html += '<h4>num_hands:' + obj.num_hands + '</h4>';
    	html += '<h4>placed: ' + obj.placed + '</h4>';
    	html += '<h4>num_players: ' + obj.num_players + '</h4>';
    	html += '<div class="tournament-chart chart">';
    	html += lineChart(obj.bets, xKey, yObjs, width, height);
    	html += '</div></div>';
    return html;
}
module.exports = tournAgg;