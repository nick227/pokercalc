var html = `function multiAts(data) {
    var sw = window.innerWidth*0.9;
    var height = 480;
    var margin = {top:25};
    var topWin = d3.max(data, function(d) {
        return typeof d.winnings === 'string' ? parseFloat(d.winnings.replace(/,/g, "")) : d.winnings;
    });
    var params = [{
            name: 'vpip',
            color: 'black'
        },
        {
            name: 'bb_avg',
            color: 'green'
        },
        {
            name: 'fold_pf',
            color: 'gray'
        },
        {
            name: 'hc_val',
            color: 'orange'
        },
        {
            name: 'rs_perc',
            color: 'red'
        },
        {
            name: 'pfr',
            color: 'blue'
        },
        {
            name: 'agg',
            color: 'purple'
        },
        {
            name: 'total_raises',
            color: 'orange'
        },
        {
            name: 'checks',
            color: 'KHAKI'
        },
        {
            name: 'win_fl',
            color: 'LIME'
        },
        {
            name: 'win_sd',
            color: 'SEAGREEN'
        },
        {
            name: 'loss_sd',
            color: 'CRIMSON'
        },
        {
            name: 'fold_pf',
            color: 'DARKOLIVEGREEN'
        },
        {
            name: 'fold_fl',
            color: 'MEDIUMAQUAMARINE'
        },
        {
            name: 'fold_tn',
            color: 'LIGHTSEAGREEN'
        },
        {
            name: 'fold_rv',
            color: 'TEAL'
        }
    ];

    for (var i = 0, length1 = params.length; i < length1; i++) {
        var p = params[i];
        attachDots(data, p.name, '.custom-chart', p.color, topWin, height);
    }

    var x = d3.scaleLinear().domain([0, topWin])
        .range([0, sw]);

    var y = d3.scaleLinear().range([height, 0]);

    var svg = d3.select('.custom-chart');

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    attachLegend(params, ".custom-chart", 70, {x:40, y:20});


function attachDots(data, key, selector, color, topWin, height) {
    var svg = d3.select(selector).append("svg");
    var topVar = d3.max(data, function(d) {
        return d[key];
    });
    var bottomVar = d3.min(data, function(d) {
        return d[key];
    });
 
    var xScale = d3.scaleLinear()
        .domain([0, topWin])
        .range([25, sw * 0.8]);  
    var yScale = d3.scaleLinear()
        .domain([100, 0])
        .range([margin.top, height-margin.top]);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", function(d) {
            return 5;
        })
        .attr("cx", findX)
        .attr("cy", findY)
        .attr("fill", color)
        .on("mouseover", function(v, i){
            var k = ".dot_text_" + key + '_' + i;
            document.querySelector(k).style.opacity = 1;
        })
        .on("mouseout", function(v, i){
            var k = ".dot_text_" + key + '_' + i;
            document.querySelector(k).style.opacity = 0;
        });
    
        svg.selectAll("text")
           .data(data)
           .enter()
           .append("text")
           .text(function(d,i) {
                return key+': '+ (d[key] === 'undefined' ? '0.00' : d[key]);
           })
            .attr("class", function(val, i){
                return "dot_text_" + key + '_' + i;
            })
            .style("opacity", 0)
           .attr("x", function(v,i){return findX(v,i,16)})
           .attr("y", function(v,i){return findY(v,i,5)})
           .attr("font-family", "sans-serif")
           .attr("font-size", "14px")
           .attr("fill", "black");

    function findX(val, i, spacer) {
        var res = xScale(typeof val.winnings === 'string' ? parseFloat(val.winnings.replace(/,/g, '')) : val.winnings);
        if (typeof spacer === 'number') {
            res = res + spacer;
        }
        return res;
    }


    function findY(val, i, spacer) {
        var res = yScale(val[key]);
        if (typeof spacer === 'number') {
            res = res + spacer;
        }
        return Math.max(45, !isNaN(res) ? res : 45);
    }

}
}`
module.exports = function (data) {
  var res = html
  res += 'multiAts(' + data + ');'
  return res
}
