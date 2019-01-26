const D3Node = require('d3-node')
const legend = require('./legend')

function winsTracker(data, width, height) {
    const d3n = new D3Node()
    var tournament=null;
    var className = '.wins-chart',
        margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        };
    var maxWin = d3n.d3.max(data, function(d,i){ return parseInt(d.winnings); });

        var xScale = d3n.d3.scaleLinear()
            .domain([0, maxWin])
            .range([0, 95]);

    var svg = d3n.createSVG(0,0).attr("height", 10);
    svg.selectAll("div")
      .data(data)
        .enter()
        .append("div")
        .attr("class", "bar")
        .style("width", function(d) { return xScale(d.winnings) + "%"; })
        .text(function(d) {
            var profit = parseInt(d.winnings) - (parseInt(d.buy_in.split("/")[0]) + parseInt(d.buy_in.split("/")[1]));
            var sym = profit > 0 ? '+'  : '-';
            var txt = '#' + d.placed  + ' | ' + d.date + ' | won: $' + d.winnings + ' | profit: '+ sym +'$'+ profit +' | vpip:' + d.calculations.vpip +' | agg:' + d.calculations.aggression.agg + ' | af:' + d.calculations.aggression.af + ' | pfr:' + d.calculations.pfr;
            return txt; 
        });
    return  d3n.svgString()
};
module.exports = winsTracker;
