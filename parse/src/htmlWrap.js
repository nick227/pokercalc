"use strict";
var _ = require('underscore');
var links = ['action', 'rounds', 'raise_totals', 'status_history', 'raises'];
var keys = [];
function htmlWrap(data){
var html = getHead();
html += getCss();
html += getBody(data);
html += getJs(data);
html += closeBody();

return html;
}
function getHead(){
	return `<!DOCTYPE html>
			<html>
<head>
  <title>PokerStars Report</title>
</head><body id="poker-res">`;

}
function getCss(){
	return `<style>
	html, body{
		width:98%;
		height:100%;
		padding:0 1%;
	}
	li.rounds > div > ul >li{
		padding:20px 10px;
	}
	.toggleNext{
		color:blue;
		cursor:pointer;
		text-decoration:underline;
	}
	li.rounds > div > ul{
		width:100%;
		height:100%;
		display:flex;
		flex-direction:row;
		flex-wrap:wrap;
		padding:15px;
	}
	li.rounds > div > ul li{
		width:240px;
	}
	li.rounds > div > ul > li > div, .pre-flop div, .flop div, .turn div, .river div{
		display:block;
	}
	.rounds img{
		width:22px;
	}
	.main-list{
	}
	.fold-preflop{background:lightgray}
	.fold-flop{background:pink;}
	.fold-turn{background:yellow;}
	.fold-river{background:red; color:white;}
	.lost-showdown{background:darkred; color:white;}
	.win-showdown{background:green;color:white;}
	.win-folds{background:lightblue;}
	.nav{color:blue;text-decoration:none;margin-right:4px;cursor:pointer}
	.nav:hover{text-decoration:underline;}
	.hidden{display:none;}
	.main-list > li{border-top:25px solid blue; padding-top:4px;margin-top:5px;}
	ul{list-style-type:none;margin-bottom:10px;padding:0;border-bottom:1px solid gray}
	ul.list > li > ul > li{border-bottom:1px solid gray}</style>`;
}
function getBody(data){
	var html = '<ul class="main-list list">', obj=[];
	for(var i = 0, length1 = data.length; i < length1; i++){
		var tournament = data[i];
			html += '<li>';
			html += wrapItem(tournament);
			html += '</li>';
	}
		html += '</ul>';

	var html2 = '<div class="row sortBy">sort by:';
	for(var i = 0, length1 = keys.length; i < length1; i++){
		var op = keys[i];
		html2 += '<a class="sort nav" data-sort="'+op+'">'+op+'</a> ';
	}
	html2 += '</div>';


	return html2+html;
}
function wrapItem(obj){
	var html = '<ul>';
	var counter = 0;
	_.each(obj, function(item, key){
		key = typeof key === 'string' ? key : typeof item.status === 'string' ? item.status : '';
		if(keys.indexOf(key) === -1){
			keys.push(key);
		}
		html += '<li class="'+key+'">';
		if(typeof item === 'object'){
			if(links.indexOf(key) > -1){
				html += '<a class="toggleNext">'+key+'</a><div class="hidden">';	
			}else{
				html += '<span class="">'+key+'</span><div class="">';	
			}
				html += wrapItem(item);
				html += '</div>';	
		}else{
			if(key === 'hole_cards'){
				html += '<h2>' + item.split(" ")[0].split("")[0]+'<img src="./images/'+imgName(item.split(" ")[0].split("")[1])+'" />'+item.split(" ")[1].split("")[0]+'<img src="./images/'+imgName(item.split(" ")[1].split("")[1])+'" /></h2>';
			}else{
				html += key + ': ' + '<span class="'+key+'">' + item + '</span>';	
			}

		}
		html += '</li>';
	});
		html += '</ul>';

	return html;


}
function imgName(k){
	var obj = {d:'diamond',
			   s:'spade',
			   h:'heart',
			   c:'club'};
	return obj[k]+'.png';
}
function closeBody(){
	return `</body></html>`;
}
function getJs(data){
	keys.sort();
	var html = `<script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js"></script>
					<script>
					document.addEventListener("DOMContentLoaded", function() {
						var options = {
    							valueNames: `;
    				html += "['" + keys.join("','") + "']";
					html += `};
						var list = new List('poker-res', options);
					  	var toggleBtns = document.querySelectorAll('.toggleNext');
					  	for(var i = 0, length1 = toggleBtns.length; i < length1; i++){
					  		var btn = toggleBtns[i];
					  		btn.onclick = function(e){
					  			var elm = this.nextSibling;
					  			if(elm.classList.contains('hidden')){
					  				elm.classList.remove('hidden');
					  				//elm.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
					  			}else{
					  				elm.classList.add('hidden');
					  			}
					  		}
					  	}
					});
					</script>`;
	return html;
}
module.exports = htmlWrap;