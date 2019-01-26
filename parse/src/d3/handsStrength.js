const D3Node = require('d3-node')
var handVals = require('../misc/handVals.js')
module.exports = function (width, height) {
const d3n = new D3Node()
var sw = width;
var c10 = d3n.d3.interpolateRainbow;
    var vals = Object.values(handVals);
    var keys = [];
    var vals_i = [];
    var num_cols = 4;
    var yCount = 0,
        y = 0;
    vals.sort();
    vals.forEach(function(v) {
        var k = getKey(v);
        if (keys.indexOf(k) === -1) {
            keys.push(k);
        }
        if (vals_i.indexOf(v) === -1) {
            vals_i.push(v);
        }
    });
    var xScale = d3n.d3.scaleLinear()
        .domain([d3n.d3.min(vals_i, function(d) {
            return d;
        }), d3n.d3.max(vals_i, function(d) {
            return d;
        })])
        .range([15, 115]);

    var svg = d3n.createSVG(width,height).append("svg").attr("width", width).attr("height", height);

    svg.selectAll("circle")
        .data(vals_i)
        .enter()
        .append("circle")
        .attr("r", function(d) {
            return xScale(d);
        })
        .attr("cx", findX)
        .attr("cy", findY)
        .attr("fill", c10);
    y = 0;
    svg.selectAll("text")
        .data(keys)
        .enter()
        .append("text")
        .text(function(d, i) {
            return d;
        })
        .attr("dx", findX)
        .attr("dy", findY)
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .attr("fill", "black");



    var w = 20;

    function findX(val, i) {
        w = (i % num_cols === 0) ? xScale(vals_i[i]) : w + Math.max(xScale(vals_i[i]) * 2, 20);
        if (keys.indexOf(val) > -1) {
            w = w - 3;
        }
        return w;
    }

    function findY(val, i) {
        y = (i % num_cols === 0) ? y + Math.max(xScale(vals_i[i]) * 2, 50) : y;
        return y;
    }

    function getKey(val) {
        for (var k in handVals) {
            if (handVals[k] === val) {
                return k;
            }
        }
        return false;
    }
    return  d3n.svgString()

};
