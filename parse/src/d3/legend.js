const D3Node = require('d3-node')
module.exports = function attachLegend(params, svg, offset, width, position) {
 const d3n = new D3Node()
        var keys = [],
            colors = [];
        params.forEach(function(e, i) {
            keys.push(e.name);
            colors.push(e.color);
        });
        var svgLegned4 = svg.append("div").attr("class", "legend").style("width", width+'px').append("svg").attr("width", width);
        var dataL = 0;
        var legend4 = svgLegned4.selectAll('.legend')
            .data(keys)
            .enter().append('g')
            .attr("transform", function(d, i) {
                if (i === 0) {
                    dataL = d.length + offset
                    return "translate(0,0)"
                } else {
                    var newdataL = dataL
                    dataL += d.length + offset
                    return "translate(" + (newdataL) + ",0)"
                }
            })
        legend4.append('circle')
            .attr("r", function(d) {
                return 6;
            })
            .attr("cx", typeof position==='object' ? position.x : 0)
            .attr("cy", typeof position==='object' ? position.y : 0)
            .style("fill", function(d, i) {
                return colors[i];
            })
        legend4.append('text')
            .attr("x", typeof position==='object' ? position.x+10 : 10)
            .attr("y", typeof position==='object' ? position.y+10 : 10)
            .text(function(d, i) {
                return d
            });
    };
