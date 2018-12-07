module.exports = genHTML;
var _ = require('underscore');

function genHTML(data){
var luckAll = _.pluck(data, 'luck');
var luckAvg = _.reduce(luckAll, function(m,i){
	return parseFloat(m)+parseFloat(i.split(" ")[0]);
});
luckAvg = luckAvg/data.length;

var raisedAll = _.pluck(data, 'raised');
var raisedAvg = _.reduce(raisedAll, function(m,i){
	return parseInt(m)+parseInt(i);
});
var counter = 0;
_.map(data, function(i){
	counter = counter + i.items.length;
});
raisedAvg = raisedAvg/counter;	 

var dealLucks = _.pluck(data, 'dealLuck');
var dealLuckAvg = _.reduce(dealLucks, function(m,i){
	return parseFloat(m)+parseFloat(i);
});
dealLuckAvg = dealLuckAvg/data.length;

var handRanks = _.pluck(data, 'handRanks');
var handRanksAvg = _.reduce(handRanks, function(m,i){
	return parseInt(m)+parseInt(i);
});
handRanksAvg  = handRanksAvg/data.length;

	var html = `<html><body><style>
					body{width:100%;height:100%;font-size:18px;font-family:tahoma}
					h1,h2,h3,h4,h5{margin:0}
					.hidden{display:none !important;}
					.toggleNext{color:blue;text-decoration:underline;cursor:pointer;width: 100%;}
					.bottom{position:absolute;bottom:5px;left:0}
					.bgdarker{background-color:rgba(0,0,0,.2)}
					.fold-preflop{background:#7b7c7c;color:#fff;}
					.fold-postflop{background:#c40b0b;color:#fff;}
					.fold-turn{background:#e80467;color:#fff;}
					.fold-river{background:#510303;color:#fff;}
					.won-folds{background:#1d68e0;color:#fff;}
					.won-showdown{background:green;color:#fff;}
					.lost-showdown{background:#000;color:#fff;}
					.sitting-out{background:#acg;color:#fff;}
					.row{display:flex;}.row > div{}
					.row a{padding:0 8px;text-decoration:underline;}
					.nav{cursor:pointer;}
					.nav:hover{background:gray;white-space:nowrap;}
					.grid{display:flex;flex-wrap:wrap;  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);}
					.div-hole-cards{font-size:28px;background:white;color:black;padding-left:0 !important;}
					.div-hole-cards img{height:20px;margin:0 2px;}
					.full-width{width:100% !important; flex: 1 1 100% !important;}
					.item{border:6px solid white;margin:0;padding:0;overflow-x:hidden;overflow-y:auto;display:flex;flex-direction:row;text-align:center;position:relative;width:100%;}
					.item > div{border:1px solid #fff;padding:7px 25px 0 15px; white-space:nowrap;min-width:133px;text-align:center;}
					ul{list-style-type:none;padding:0;display:flex; flex-wrap: wrap;}
					li{flex: 1 1 20%;padding:11px;}
					.sortBy{}
					hr{clear:both; width:100%;height:6px;background:black;}
					hr.small{height:1px;background:gray;}
					#poker-res{padding:0 1%}
					</style>
					<script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js"></script>
					<script>
					document.addEventListener("DOMContentLoaded", function() {
						var options = {
    							valueNames: [ 'status', 'num-hands', 'luck-deal', 'luck-board', 'hand-rank', 'raised','all-ins', 'tourny-date', 'aggression', 'type', 'folds-preflop', 'folds-turn', 'folds-river', 'lost-showdowns', 'wins-all', 'win-folds', 'won-showdowns' ]
							};
						var list = new List('poker-res', options);
					  	document.querySelector('.sortBy').style.display = 'flex';
					  	var toggleBtns = document.querySelectorAll('.toggleNext');
					  	for(var i = 0, length1 = toggleBtns.length; i < length1; i++){
					  		var btn = toggleBtns[i];
					  		btn.onclick = function(e){
					  			var elm = this.nextSibling;
					  			if(elm.classList.contains('hidden')){
					  				elm.classList.remove('hidden');
					  				if(elm.classList.contains('toggle-width')){
					  					elm.parentNode.classList.add('full-width');
					  				}
					  				elm.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
					  			}else{
					  				elm.classList.add('hidden');
					  				elm.parentNode.classList.remove('full-width');
					  			}
					  		}
					  	}
					});
					</script><div id="poker-res">`;		

	html += 'tournaments: ' + data.length;
	html += '<BR>deal luck avg: ' + luckAvg.toFixed(2);
	html += '<BR>board luck avg: ' + dealLuckAvg.toFixed(0);
	html += '<BR>hand rank avg: ' + handRanksAvg.toFixed(5);
	html += '<BR>raise average: ' + (raisedAvg*100).toFixed(0)+'%';
	var sortOps = ["status", "tourny-date", "type", "luck-deal", "luck-board", "hand-rank", "all-ins", "raised", "aggression", "num-hands", "lost-showdowns", "folds-preflop", "folds-turn", "folds-river", "wins-all", "win-folds", "won-showdowns"];
	sortOps.sort();
	html += '<div class="row sortBy">sort by:';
	for(var i = 0, length1 = sortOps.length; i < length1; i++){
		var op = sortOps[i];
		html += '<a class="sort nav" data-sort="'+op+'">'+op+'</a>';
	}
	html += '</div>';
	html += `<HR>
					<ul class="list">`;
	data.forEach(function(item){
		html += '<li><div style=""><h4 class="type" style="">'+item.details+'</h4>';
		html += '<div class="tourny-date" style="display:none;">'+item.details.substring(item.details.lastIndexOf('-')+2)+'</div>';
		html += '<div class="status">'+item.tourneySum+'</div></div>';
		html += '<hr class="small">';
		html += '<div style="">deal luck: <span class="luck-deal">'+item.luck+'</span></div>';
		html += '<div style="">board luck: <span class="luck-board">'+item.dealLuck+'</span></div>';
		html += '<div style="">hand ranks: <span class="hand-rank">'+item.handRanks.toFixed(3)+'</span></div>';
		html += '<hr class="small">';
		html += '<div class="num-hands row" style="">num hands: '+item.items.length+'</div>';
		html += '<div class="row">total raises: '+item.raises+ ' / ' + ((item.raises/(item.items.length*4))*100).toFixed(0) + '%</div>';
		html += '<div class="row">rounds raised: <span class="raised"> '+item.raised+ ' / ' + ((item.raised/item.items.length)*100).toFixed(0) + '%</span></div>';
		html += '<div class="aggression">aggression: '+(item.raises/item.items.length).toFixed(4)+'</div>';
		html += '<div class="all-ins">all ins: '+item.allins+'</div>';
		html += '<hr class="small">';
		html += '<div style="">';
		for(var k=0;k<item.counter.length;k++){
			html += '<div class="row"><div>' + item.counter[k].key+': </div><div class="'+item.counter[k].key+'-s">'+ (item.counter[k].val==undefined ? 0 : item.counter[k].val) +'</div></div>';
		}
		html += '</div>';
		html += '<hr class="small">';
		html += '<div style="height:100px;overflow-y:auto;"><div class="row played" style="">played: ';
		var tmp = [];
				item.items.forEach(function(line){
					if(line.event.res !== 'fold-preflop'){
						if(tmp.indexOf(line.hc) === -1){
						tmp.push(line.hc);
						}
					}
				});
				html += tmp.join(', ');
		html += '</div>';
		html += '<div class="row folded" style="">folded: ';
		var tmp = [];
				item.items.forEach(function(line){
					if(line.event.res === 'fold-preflop'){
						if(tmp.indexOf(line.hc) === -1){
							tmp.push(line.hc);
						}
					}
				});
				html += tmp.join(', ');
		html += '</div></div>';
		html += '<hr class="small">';
		html += wrapItem(item.items);
		html += '<hr></li>';
	});
	html += '</ul></div></body></html>';
	return html;
}
function imgName(k){
	var obj = {d:'diamond',
			   s:'spade',
			   h:'heart',
			   c:'club'};
	return obj[k]+'.png';
}
function limitStr(str, limit){
	if(str.length > limit){
		return str.substring(0, limit) + '..';
	}
	return str;
}
function wrapItem(data){
	var html = '<a class="toggleNext">show all hands</a>';
	html += '<div class="hidden toggle-width ">';
	var sortByObjsInner = ["hand-status", "pot-size", "win-loss", "ev", "hand-value"];
	data.forEach(function(line){
		html += '<div title="" class="'+ line.event.res +' item" style="'+ (line.action.user.toString().indexOf("all-in") > -1 ? 'border-color:red' : (line.action.user.toString().indexOf("raises") > -1 || line.action.user.toString().indexOf("bets") > -1 ? 'border-color:#43ff38' : '')) +'">';
			var operat = line.event.res === 'won-folds' || line.event.res === 'won-showdown' ? '+' : '-';

			/*******************************/
			html += '<div class="div-hole-cards">';
				html += line.hc.split(" ")[0].split("")[0]+'<img src="./images/'+imgName(line.hc.split(" ")[0].split("")[1])+'" />'+line.hc.split(" ")[1].split("")[0]+'<img src="./images/'+imgName(line.hc.split(" ")[1].split("")[1])+'" />';
			html += '</div>';
			/*******************************/
			html += '<div>';
				html += line.board.length ? line.board : 'n/a';
			html += '</div>';
			/*******************************/
			html += '<div title="'+line.handStatus + ' ' + line.handValue + ':1'+'">';
				html += limitStr(line.handStatus + ' ' + line.handValue + ':1', 15);
			html += '</div>';
			/*******************************/
			html += '<div>';
			html += (operat === '+' ? 'won:' : 'lost: ') + operat + '$' + line.winloss;
			html += '</div>';
			/*******************************/
			html += '<div>';
				html += 'pot: $'+line.pot_size.replace(/Main pot/g, '/').replace(/Side pot/g, '/').substring(0, 11);
				html += line.pot_size.replace(/Main pot/g, '/').replace(/Side pot/g, '/').length > 11 ? '..' : '';
			html += '</div>';
			/*******************************/
			html += '<div>';
				html += 'stack: $' + line.stacksize;
			html += '</div>';
			/*******************************/
			html += '<div>';
				html += line.event.res.replace("-", " ");
			html += '</div>';
			/*******************************/
			html += '<div>';
			html += 'num players: ' + line.numPlayers;
			html += '</div>';
			/*******************************/
			html += '<div>[';
				html += line.position;
			html += ']</div>';
			/*******************************/
			html += '<div>';
				html += 'ev: ' + line.hcVal;
			html += '</div>';
			/*******************************/
			html += '<div>';
			html += 'BB' + line.ante;
			html += '</div>';
			/*******************************/
			html += '<div>';
			html += 'num raises: ' + line.numRaises;
			html += '</div>';
			/*******************************/
			html += '<div>';
			html += 'num calls: ' + line.numCalls;
			html += '</div>';
			/*******************************/
			var userAction = line.action.user.length ? line.action.user.toString() : 'n/a';
			html += '<div title="'+userAction+'">';
			html += limitStr(userAction, 30);
			html += '</div>';
			/*******************************/
		html += '</div>';
		if(line.action.all.length){
		html += '<div class="hand-details full-width">';
			html += '<a class="toggleNext ">show action</a>';
			html += '<div class="hidden bgdarker">';
			for(var i = 0, length1 = line.action.all.length; i < length1; i++){
				var l = line.action.all[i]
				html += '<div>' + l + '</div>';
			}
			html += '</div>';
		html += '</div>';
		}

	});










	html += '</div>';
return html;
}