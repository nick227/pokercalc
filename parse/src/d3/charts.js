'use strict'
const _ = require('underscore')
const handVals = require('../misc/handVals.js')

const handsStrength = require('./handsStrength.js')
const winToBb = require('./winToBb.js')
const raisesChart = require('./raisesChart.js')
const multiAtts = require('./multiAtts.js')
const winsTracker = require('./winsTracker.js')
const legend = require('./legend.js')

const o = {
	pie:require('./pieChart.js')
};
function make (data) {
  var html = `<script src="https://d3js.org/d3.v5.min.js"></script>`
  html += `<style>
				.chart{
						width:96%;
						min-height:500px;
						background:#1ab;
						overflow:auto;
						padding:4% 2%;;
						position:relative;
				}
				.custom-chart{
						background:#b1c;
				}
				.custom-chart-02{
						background:#4cc;
						min-height:550px;
				}
				.hands-graph{
						height:980px;
						background:#5a5;
				}
				.wins-chart{
						background:#fff;

				}
				.vpip-chart{
						background:#9a1;
				}
				.focus-chart{
						background:#5c6;
				}
				.line {
				    fill: none;
				    stroke-width:1;
				}
				.dot {
				}
				.bubble{
					background:green;
					float:left;
					margin:5px;
					border-radius:50%;
					text-align:center;
					display:flex;
					flex-direction:column;
					justify-content:center;
					align-item:center;
					font-weight:900;
					font-size:19px;
				}   
				.bar{
					border-top:12px solid #40a0ff;
			        background: #ffff40;
			        margin-bottom:26px;
			        padding:2px;
			        white-space:nowrap;
			    }
				.legend{
					z-index:2;
				}
				</style>`
  html += `<script>`
  var tournaments = JSON.stringify(data.rounds),
  	  rounds = JSON.stringify(_.flatten(_.pluck(data.rounds, 'rounds')).filter(function(d){return d.num_raises > 0;}))
  html += legend()
  html += `</script>`
  pieChart(data.rounds)/*tournaments*/
  //html += handsStrength()/*JSON.stringify(handVals)*/
  //html += multiAtts()/*JSON.stringify(data.summaries)*/
  //html += raisesChart()/*tournaments*/
  //html += winToBb()/*rounds*/
  //html += winsTracker()/*tournaments*/

  return html
}
module.exports = o
