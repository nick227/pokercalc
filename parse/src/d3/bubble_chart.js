const D3Node = require('d3-node')
const legend = require('./legend')
const _ = require('underscore')
const margin = {top:20, left:40, right:20, bottom:20};
var d3n = null;

function bubbleChart(data, xKey, yKeysObj, width, height, labelList){
    d3n = new D3Node()
    var yk=null, yCount=yKeysObj.length
    var legend_params = []

    const svg = d3n.createSVG(width+margin.left+margin.right,height+margin.bottom+margin.top).append("svg").attr("width", width+margin.left+margin.right).attr("height", height+margin.bottom+margin.top)

    var yScale = getyScale(data, yKeysObj, width, height);
    var xScale = getxScale(data, xKey, width, height);
    for(var i = 0, length1 = yKeysObj.length; i < length1; i++){
        let yKey = yKeysObj[i]
        let color = d3n.d3.schemePaired[i]
        legend_params.push({name:yKey, color:color})
        addShapes(data, svg, xKey, yKey, xScale, yCount, width, height, color)

    }

    addAxes(svg, xScale, yScale, width, height)
    legend(legend_params, svg, 90, width, {x:30,y:10})

    return  d3n.svgString()
}
function addAxes(svg, xScale, yScale, width, height){
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height+margin.bottom) + ")")
        .call(d3n.d3.axisBottom(xScale));
    
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+margin.left+","+margin.top+")")
        .call(d3n.d3.axisLeft(yScale));
}

function getyScale(data, yKeysObj, width, height){
    var ct=0, cm=0, top=null, bot=null
    for(var i = 0, length1 = yKeysObj.length; i < length1; i++){
        let yKey = yKeysObj[i]
        //--
        ct = d3n.d3.max(data, function(d) {
            return isNaN(d[yKey]) ? 0 : parseFloat(d[yKey])
        });
        top = Math.max(ct, top);
        //--
        cm = d3n.d3.min(data, function(d) {
            return isNaN(d[yKey]) ? 0 : parseFloat(d[yKey])
        });
        bot = Math.min(cm, bot)
        //--
    }
    var yScale = d3n.d3.scaleLinear()
        .domain([top, bot])
        .range([margin.top, height-margin.bottom]); 

        return yScale
}
function getxScale(data, xKey, width, height){
    var topXval = d3n.d3.max(data, function(d) {
        return parseFloat(d[xKey]);
    });
    var botXval = d3n.d3.min(data, function(d) {
        return parseFloat(d[xKey]);
    });
    var xScale = d3n.d3.scaleLinear()
        .domain([botXval, topXval])
        .range([margin.left, width-margin.right-margin.left]);

        return xScale;
}



function addShapes(data, svg, xKey, yKey, xScale, yCount, width, height, color){
    svg = svg.append("g");

    var yScale = getyScale(data, [yKey], width, height);

    var radiusRange = d3n.d3.scaleLinear()
                        .domain([1, 20])
                        .range([9, 1]); 
    var rad = Math.max(radiusRange(yCount), 1);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", function(d) {
            return rad;
        })
        .attr("cx", findX)
        .attr("cy", findY)
        .attr("fill", color)
        .attr("class", "circle");

        svg.selectAll("text")
           .data(data)
           .enter()
           .append("text")
           .text(function(d,i) {
                return yKey + ': ' + d[yKey];
           })
            .attr("class", "circle-text")
           .attr("x", findX)
           .attr("y", findY)
           .attr("font-family", "sans-serif")
           .attr("font-size", "12px")
           .attr("fill", "black");

    function mouseHover(val, i){
            var k = "dot_text_" + yKey + '_' + i;
            document.querySelector(k).style.opacity = 1;
        }
    function findX(val, spacer) {
        var res = xScale(val[xKey]);
        return res;
    }
    function findY(val, spacer) {
        var res = yScale(Math.round(parseFloat(val[yKey])));
        return res.toFixed(3);
    }


}
module.exports = bubbleChart;



