
module.exports = `
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
<style>
html, body{
		width:100%;
		height:100%;

}
body{
		font-size:14px;
		font-family:Roboto;
		font-weight:100;
		margin:0;
		z-index:0;
	}
	h1{
		font-family:Courier;
		font-size:6em;
		margin:0;padding:0;
	}
	h2,h3,h4{
		padding:2x 5px;margin:0;
	}
	div.main{
		padding:25px;
		min-height:100%;
	}
	.flex-center{
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;

	}
	.nav{color:blue;cursor:pointer;text-decoration:underline;}
	a.nav-main{
		font-size:1.3em;
		border:1px solid lightgray;
		color:black;
		text-decoration:none;
		padding:5px 15px;
		transition: all 0.05s ease;
	}
	a.nav-main:hover{
		background:rgb(0,0,0);
		color:white;
	}
	.hidden{display:none;}
	ul{list-style-type:none;margin-bottom:10px;padding:0;}
	.chart{
			padding:0;
			position:relative;
			width:100%;
			margin:30px 0;
	}
	.preloader{
		background:#f44336;
		color:#fff;
		padding:3px;
		width:100%;
		height:160px;
		align-self:center;
		position:fixed;
	}
	.custom-chart{
	}
	.custom-chart-02{
	}
	.hands-graph{
	}
	.wins-chart{
	}
	.tournament-chart{
	}
	.vpip-chart{
	}
	.focus-chart{
	}
	.line {
	  fill: none;
	  stroke: steelblue;
	  stroke-width: 1px;
	}
	.bar{
		border-top:12px solid #40a0ff;
        background: #ffff40;
        margin-bottom:26px;
        padding:2px;
        white-space:nowrap;
    }
	.legend{
		background:#fff;
		height:30px;
		width:auto;
		padding:5px;
		overflow:hidden;
	}
	.circle-text{
		opacity:0;
	}
	.circle-text:hover{
		opacity:1;
	}
	.preload{
		display:none;
	}
	table{
		width:100%;
	}
	table tr td, th{
		white-space:nowrap;padding:4px;
		position:relative;
		z-index:0;
	}
	th{text-align:left;background:gray;color:#fff;}
	th select{
		margin-left:10px;
		z-index:2;
	}
	.main-list{
	}
	.main-list > li{
		padding:2px 10px;
		width:auto;
		float:left;
	}
	.list > li:nth-child(even){
		background:#afd6a2;
	}
	.list > li:nth-child(odd){
		background:#fff;
	}
	.action-row{
		cursor:pointer;
	}
	.action-row:hover{
		background:rgba(132, 245, 255,0.33);
		color:#000;
	}
	.sort-menu, .sortBy{
		margin:20px 0;
		padding:1%;
		width:98%;
		background:wheat;
	}
	.toggleNext{
		color:blue;
		cursor:pointer;
		text-decoration:underline;
	}
	li{
		list-style-type:none;
		margin:0;
	}
	li.rounds_item{
	}
	li.rounds_item > div > ul{
		width:100%;
		height:100%;
		display:flex;
		flex-direction:row;
		flex-wrap:wrap;
	}
	li.rounds_item > div > ul > li > div, .pre-flop div, .flop div, .turn div, .river div{
		display:block;
	}
	.pot_size_item, .winLoss_item, .status_item, .summary_item, .item-list-raise_totals, .num_hands_item{
	}
	.green-header{
		background:#01876a;
		padding:20px;
	}
	.board{
		background:#3B7434;
		color:#fff;
		height:30px;
		width:94%;
		padding:3%;
		min-width:200px;
	}
	.board img, .hole_cards_item img{
		width:22px;
	}
	.hole_cards_item{
		height: 40px;
		padding:10px 0 0 5px;
	}
	.item-list-raise_totals{
	}
	.item-list-rounds > li{
		padding:11px;
		position:relative;
	}
	.item-list-rounds > li > span{
		padding:5px;
	}
	.item-list-rounds{
	}
	.info_item{
	}
	.modal{
		position:fixed;
		width:96%;
		max-height:50%;
		overflow-y:auto;
		margin:1%;
		min-height:6000px;
		z-index:12;
		background:wheat;
		padding:20px;
		color:#000;
		top:0;
		left:0;
	}     
	.btn{
		font-size:2em;
		padding:10px 12px;
		text-align:center;
		border:1px solid #eff;
		border-radius:4px;
		cursor:pointer;
	}
	.btn:hover{
		background-color:#55AAb1;

	}
	.btn-close{
		background-color:#AAAAAA;
	}
	.box{
		padding:0;
		text-align:left;
	}
	.fold-preflop_item{background: #D6D6D6;border:1px solid #DdDdDd;}
	.fold-flop_item{background: #F98383;border:1px solid #F98383;}
	.fold-turn_item{background: #F8F360;border:1px solid #F8F360;}
	.fold-river_item{background: #FE3C3C;border:1px solid #FE3C3C; }
	.lost-showdown_item{background: #990000;color:white;border:1px solid #1D1A00; }
	.win-showdown_item{background: #07F54F;border:1px solid #07F54F;}
	.win-folds_item{background: #4DA6FF;border:1px solid #4DA6FF;}
	</style>`
