
const handChart 	= require('../d3/handsStrength.js')
const bubbleChart 	= require('./bubble_chart.js')
const winsTracker 	= require('./winsTracker.js')
const winToBb 		= require('./winToBb.js')
const lineChart 	= require('../d3/line_chart.js')
const tournAgg 	= require('./tournAgg.js')

var charts = {
	bubble:bubbleChart,
	hand_strength:handChart,
	wins:winsTracker,
	win_bb:winToBb,
	line_chart:lineChart,
	tourn_agg:tournAgg
};
function gen(type, vars){
	return charts[type](...vars)
}
module.exports = gen;