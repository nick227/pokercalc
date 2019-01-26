const D3Node = require('d3-node')
const legend = require('./legend')

function winToBb(data, width, height) {
    const d3n = new D3Node()
    var c10 = D3Node.d3.interpolateRainbow;
	var margin = {top: 20, right: 20, bottom: 20, left: 20};

    var topWinLoss = D3Node.d3.max(data, function(d) {
        return d.winLoss;
    });
    var botWinLoss = D3Node.d3.min(data, function(d) {
        return parseInt(d.winLoss);
    });
    var avgWin = D3Node.d3.mean(data, function(d){
        return parseInt(d.winLoss);
    });
    var top_num_bb = D3Node.d3.max(data, function(d) {
        return parseInt(d.raises_num_bb);
    });
    var avgBb = D3Node.d3.mean(data, function(d){
        return parseInt(d.raises_num_bb);
    });
    var bot_num_bb = D3Node.d3.min(data, function(d) {
        return parseInt(d.raises_num_bb);
    });
var xScale = D3Node.d3.scaleLinear()
    .domain([botWinLoss, topWinLoss]) // input
    .range([margin.left, width-margin.left]); // output

var yScale = D3Node.d3.scaleLinear()
    .domain([bot_num_bb, top_num_bb]) // input 
    .range([height-margin.top, margin.top]); // output 


var svg = d3n.createSVG(width,height+margin.top);

svg.append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(D3Node.d3.axisBottom(xScale)); // Create an axis component with D3Node.d3.axisBottom

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ", 0)")
    .call(D3Node.d3.axisLeft(yScale)); // Create an axis component with D3Node.d3.axisLeft

var winCount = 0;
var radiusRange = D3Node.d3.scaleLinear()
				    .domain([10, 1000]) // input 
				    .range([12, 4]); // output 

var rad = Math.max(radiusRange(Object.keys(data).length), 4);
svg.selectAll(".dot")
    .data(data.filter(function(e){return parseInt(e.raises_num_bb) > 0}))
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { 
    	if(d.winLoss > 0){
    		winCount++;
    	}
    	return xScale(d.winLoss) })
    .attr("cy", function(d) { return yScale(d.raises_num_bb) })
    .attr("fill", function(d) { 
    	var color = d.winLoss > 0 ? 'green' : 'red';
    	return color;
    	 })
    .attr("r", rad);

    var params = [{name:'top win: '+topWinLoss, color:'transparent'}, 
                    {name:'top loss: '+botWinLoss, color:'transparent'},
                    {name:'win/loss: '+avgWin.toFixed(0), color:'transparent'}, 
                    {name:'avg bb: '+avgBb.toFixed(2), color:'transparent'},
                    {name:'wins: '+winCount, color:'transparent'}, 
                    {name:'losses: '+(Object.keys(data).length - winCount), color:'transparent'}];

    legend(params, svg, 120, width, {x:0,y:0});
return  d3n.svgString()

};
module.exports = winToBb
