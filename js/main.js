document.addEventListener("DOMContentLoaded", function() {
	init();
	var container = document.getElementById('cards-container');
  	shuffle(container);
	addListeners();



});
function addListeners(){
	/** keyboard shortcuts **/
	addKeyListeners();
	/** clear btn ****/
	var clearBtn = document.querySelector('.btn-clear');
	clearBtn.onclick = clear;
	/** card deck ****/
	var container = document.getElementById('cards-container');
	var cards = container.querySelectorAll('.card');
	cards.forEach(function(card, index){
		card.addEventListener('click', cardClick);
	});
}
var pokerVals = {
	totalHands:2598960
};
var probabilityCalcs = {
	/*
		C(n,r) = n! / r!(n-r)!
	*/
	'one-pair':function(cards){
		/*
			(13C1)(4C2)x(12C3)(4)(4)(4)
		*/
		var res={};
		res.outs = cards.length * 3;
		var lcd = reduce(res.outs, 52-cards.length);
		res.probability = Math.round(lcd[0]/lcd[1]*100, 2);
		return res;
	},
	'two-pair':function(cards){
		/*
			(13C2)(4c2)(4c2)x(11C1)(4c1)
		*/

		var res={outs:'',probability:''};
		return res;

	}
};
var handChecks = [{name:'High Card'/*0*/, val:1, fn:function(cards){
												cards = scoreHand(cards), res=[], res.push(cards[0]);
												return {has:true, res:res};
											}}, 
				 {name:'One Pair'/*1*/, val:2, fn:function(cards){
				 								var res = {has:false, res:null};
				 								var match = matchCheck(cards, 'card');
				 								if(match.matches === 1){
				 									res = {has:true, res:match.tmp};
				 									res.outs = '';
				 									res.probability = 100;
				 								}else{
				 									res.outs = probabilityCalcs['one-pair'](cards).outs;
				 									res.probability = probabilityCalcs['one-pair'](cards).probability;
				 								}
				 								return res;
				 						}
				 },
				 {name:'Two Pair'/*2*/, val:3, tmp:[], fn:function(cards){
				 								var res = {has:false, res:null}, matches=0, tmp=[];
				 								var match = matchCheck(cards, 'card');
				 								if(match.matches === 1){
				 									this.tmp.push(match.tmp);
				 									if(this.tmp.length > 1){

														this.tmp.sort(function(a,b){
															return a[0].val > b[0].val;
														});
				 										if(this.tmp.length > 2){
				 											this.tmp = this.tmp.splice(this.tmp.length-2,2);
				 										}
				 										res = {has:true, res:this.tmp};
				 									}else{
				 									res.outs = probabilityCalcs['two-pair'](cards).outs;
				 									res.probability = probabilityCalcs['two-pair'](cards).probability;

				 									}
				 								}
				 								return res;
				 							}}, 
				 {name:'Three of a Kind'/*3*/, val:4, fn:function(cards){
				 								var res = {has:false, res:null};
				 								var match = matchCheck(cards, 'card');
				 								if(match.matches === 2){
				 									res = {has:true, res:match.tmp};
				 								}
				 								return res;

				 }}, 
				 {name:'Straight'/*4*/, val:5, fn:function(cards){
						var res = {has:false, res:null}, tmp=[],cnt=1,prev=null, rcnt=0;
						if(cards.length < 5){return res;}
						cards.sort(function(a,b){
							return a.val > b.val;
						});
						cards.forEach( function(card, index){
							if(prev !== null && prev.val+1 === card.val){
								if(tmp.indexOf(prev) < 0 && prev.val+1 === card.val){
									tmp.unshift(prev);
								}
								tmp.push(card);
								rcnt = rcnt + card.val;
								cnt++;
							}else if(cnt < 5){
								cnt=1;
								rcnt=0;
							}
								prev = card;
						});
						if(cnt > 4){
						tmp.sort(function(a,b){
							return a.val > b.val;
						});
						if(tmp.length > 5){
							tmp = tmp.splice(tmp.length-5,tmp.length);
						}
							res = {has:true, res:tmp};
						}

						return res;

				 }}, 
				 {name:'Flush'/*5*/, val:6, fn:function(cards){
				 								var res = {has:false, res:null};
											 	if(cards.length < 5){
											 		return res;
											 	}
				 								var match = matchCheck(cards, 'suit');
				 								if(match.matches > 3){
				 									res = {has:true, res:match.tmp};
				 								}
				 								return res;

				 }},
				 {name:'Full House'/*6*/, val:7, fn:function(cards){
							var res = {has:false, res:null};
						 	if(cards.length < 5){
						 		return res;
						 	}
							var c = null, tmp=[], match=null;
							var obj = {two:{},three:{}};
							for (var i = 0; i < cards.length; i++) {
								c = cards.splice(0,1);
								cards.push(c[0]);
								match = matchCheck(cards, 'card');
				 				if(match.matches === 1){
				 					var j = extract(match.tmp, 'id').sort();
				 					obj.two[j] = match.tmp;
				 				}
				 				if(match.matches === 2){
				 					var j = extract(match.tmp, 'id').sort();
				 					obj.three[j] = match.tmp;
				 				}
							}
							if(Object.keys(obj.two).length && Object.keys(obj.three).length){
								var l2 = Object.values(obj.two), l3 = Object.values(obj.three);
								var r = l2[0].concat(l3[0]);
								var res = {has:true, res:r};
							}
				 			return res;

				 }},
				 {name:'Four of a Kind'/*7*/, val:8, fn:function(cards){
				 								var res = {has:false, res:null};
				 								var match = matchCheck(cards, 'card');
				 								if(match.matches === 3){
				 									res = {has:true, res:match.tmp};
				 								}
				 								return res;
				 }},
				 {name:'Straight Flush'/*8*/, val:9, fn:function(cards){
				 	var res = {has:false, res:null};
				 	if(cards.length < 5){
				 		return res;
				 	}
				 	var sc = handChecks[4].fn(cards),
				 		fc = handChecks[5].fn(cards);
				 	if(sc.has && fc.has && matchCheck(sc.res, 'suit').matches > 3){
				 		res = {has:true, res:sc.res};
				 	}
				 	return res;

				 }},
				 {name:'Royal Flush'/*9*/, val:10, fn:function(cards){
				 	var res = {has:false, res:null};
				 	if(cards.length < 5){
				 		return res;
				 	}
				 	var sc = handChecks[4].fn(cards),
				 		fc = handChecks[5].fn(cards);
				 	if(sc.has && fc.has && royalCheck(sc.res) && royalCheck(fc.res)){
				 		res = {has:true, res:sc.res};
				 	}
				 	return res;
				 }}];

function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}


function royalCheck(cards){
	var def = 'TJQKA', str = '';
	for (var i = 0; i < cards.length; i++) {
		str = str + cards[i].card;
	}
	return def === str;
}
function evalHand(){
	var cards = getVisibleCards(), obj=null;
	if(!cards){return false;}

	for (var i = 0; i < handChecks.length; i++){

		var obj = handChecks[i], res = obj.fn(cards);
		var elmName = '.'+obj.name.replace(/\s+/g, '-').toLowerCase(),
		div = document.querySelector(elmName);
		if(res.has){
			div.classList.add(res.has);	
		}
		updateLog(res, div);
		updateStats(res, div);
	}
}
function updateStats(res, elm){
	var o = elm.querySelector('.outs'),
		p = elm.querySelector('.probability');
	if(typeof res.probability === 'number' && p.innerHTML !== '100%'){
		o.innerHTML = res.outs;
		p.innerHTML = res.probability+'%';
	}
}
function updateLog(res, panel){
		if(res.has && res.res !== null && typeof res.res === 'object'){
		var log = panel.querySelector('.log');
			log.innerHTML = '';
			for(var key in res.res){
				if(Array.isArray(res.res[key])){
					for (var i = 0; i < res.res[key].length; i++) {
						var o = res.res[key][i];
						if(typeof o.card === 'string'){
							dealCard(o.card, o.suit, log);
						}
					}
				}else{
					dealCard(res.res[key].card, res.res[key].suit, log);
				}
			}
		}

};
function getHoleCards(){
	var e = document.querySelectorAll('.hole-cards .card'), res=[];
	e.forEach( function(element, index) {
		res.push(element.getAttribute('data-card')+element.getAttribute('data-suit').substring(0, 1));
	});
	return res;
}
function getTableCards(){
	var e = document.querySelectorAll('.table-cards .card'), res=[];
	e.forEach( function(element, index) {
		res.push(element.getAttribute('data-card')+element.getAttribute('data-suit').substring(0, 1));
	});
	return res;
}
function getOdds(cards){}
function getVisibleCards(){
	var faceVals = {'T':10,'J':11,'Q':12,'K':13,'A':14};
	var ac = document.querySelectorAll('.visible-cards .card'), res=[];
	if(ac.length < 2){
		return false;
	}
	ac.forEach(function(i){
		var v = isNaN(i.getAttribute('data-card')) ? faceVals[i.getAttribute('data-card')] : parseInt(i.getAttribute('data-card'));
		res.push({card:i.getAttribute('data-card'), 
				  suit:i.getAttribute('data-suit'), 
				  id:i.getAttribute('data-card')+i.getAttribute('data-suit'), 
				  val:v});
	});
	return res;

}
function matchCheck(cards, type){
		var newCard = cards[cards.length-1], matches=0, tmp=[];
		cards.forEach( function(card, index) {
			if(newCard[type] === card[type] && newCard[type==='suit' ? 'card' : 'suit'] !== card[type==='suit' ? 'card' : 'suit']){

				if(tmp.indexOf(newCard) < 0){
					tmp.push(newCard);
				}
				tmp.push(card);
				matches++;
			}
		});

	tmp.sort(function(a,b){
		return a.val > b.val;
	});
	if(tmp.length > 5){
		tmp = tmp.splice(tmp.length-5,tmp.length);
	}
		return {matches:matches, tmp:tmp};
}
function extract(obj, name){
	var res = [];
	obj.forEach(function(e,i){
		res.push(e[name]);
	});
	return res;
}
function uniq(arr) {
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}
function scoreHand(cards){
	var faceVals = {'T':10,'J':11,'Q':12,'K':13,'A':14};
	var res = [], r=null;
	cards.forEach(function(e, i) {
		r = isNaN(e.card) ? faceVals[e.card] : parseInt(e.card);
			res.push({card:e.card, suit:e.suit, val:r});	
	});
	res.sort(function(a,b){
		return a.val < b.val;
	});
	return res;
}
function shuffle(container){
var suits = ['heart', 'club', 'diamond', 'spade'];
var cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
	for (var i = 0; i < suits.length; i++) {
		var s = suits[i];
			getCards(s, container);
	}
	function getCards(suit, container){
		var card=null, c=null;
		for (var i = 0; i < cards.length; i++) {
			c = cards[i];
			card = c + suit;
			dealCard(c, suit, container);
		}
	}
}
function clear(){
	location.reload();
}
function cardClick(e){
	if(typeof e.target === 'object'){
		e = e.target;
	}
	var active = e.classList.contains('active');
	if(active){
		return false;	
	}

	var hc = document.getElementById('cards-hole'),
		tc = document.getElementById('cards-table'),
		count = hc.querySelectorAll('.card').length,
		count2 = tc.querySelectorAll('.card').length,
		container = null;
		if(count === 2){
			if(count2 === 5){
				return false;
			}else{
				container = tc;
			}
		}else{
			container = hc;
		}

	e.setAttribute('data-checked', 'true');
	e.classList.add('active');		

	var s = e.getAttribute('data-suit');
	var c = e.getAttribute('data-card');
	dealCard(c,s,container);
	evalHand();
}
function dealCard(card, suit, container){
	var d = document.createElement('div');
	d.innerHTML = card;
	d.setAttribute('data-card', card);
	d.setAttribute('data-suit', suit);
	d.id = '_'+card+suit;

	d.classList.add('card');
	d.classList.add(card);
	d.classList.add(suit);
	container.appendChild(d);
}
function init(){
	var container = document.querySelector('.info-box');
	container.innerHTML = '';
	for (var i = 0; i < handChecks.length; i++) {
		obj = handChecks[i],
		    div = document.createElement('div'),
		    div2 = document.createElement('div'),
			h3 = document.createElement('h3'),
			span1 =document.createElement('span'),
			span2 =document.createElement('span'),
			span3 =document.createElement('span'),
			span4 =document.createElement('span'),
			row1 =document.createElement('div'),
			row2 =document.createElement('div'),
			row3 =document.createElement('div'),
			row4 =document.createElement('div'),
			link =document.createElement('a'),
			txt = document.createTextNode(obj.name);

		div.classList.add(obj.name.replace(/\s+/g, '-').toLowerCase());
		div.classList.add('panel');
		div2.classList.add('log');
		row1.classList.add('row');
		row2.classList.add('row');
		row3.classList.add('row');
		row4.classList.add('row');

		span1.innerHTML = 'hand value:' + obj.val;
		row1.appendChild(span1);
		span3.classList.add('outs');
		span4.classList.add('probability');
		row3.appendChild(document.createTextNode('outs:'));
		row4.appendChild(document.createTextNode('probability:'));
		row2.appendChild(span2);
		row3.appendChild(span3);
		row3.appendChild(span3);
		row4.appendChild(span4);
		h3.appendChild(txt);
		div.appendChild(h3);
		div.appendChild(row1);
		div.appendChild(row2);
		div.appendChild(row3);
		div.appendChild(row4);
		div.appendChild(div2);
		container.appendChild(div);

	}

}
function getDeck(){
	var suits = ['heart', 'club', 'diamond', 'spade'];
	var cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
	var res = [];
	for (var i = 0; i < suits.length; i++) {
		var s = suits[i];
		for (var ix = 0; ix < cards.length; ix++) {
			c = cards[ix];
			card = c + s;
			res.push(card);
		}
	}
	return res;
}
function addKeyListeners(){
	var keyMap = {
		50:2,
		51:3,
		52:4,
		53:5,
		54:6,
		55:7,
		56:8,
		57:9,
		84:'T',
		74:'J',
		81:'Q',
		75:'K',
		65:'A',
		68:'diamond',
		67:'club',
		72:'heart',
		83:'spade'
	};
var timer = null;
var lastPress = null;
var deck = getDeck();
var container = document.getElementById('cards-container');

document.addEventListener('keyup', function (e) {
	if(typeof keyMap[e.keyCode] !== 'undefined'){
		var ch = keyMap[e.keyCode];
		if(lastPress !== null && deck.indexOf(lastPress+ch) > -1){
			var elm = container.querySelector('#_'+lastPress+ch);
			cardClick(elm);
			lastPress=null;
		}else{
			lastPress=null;
		}
		lastPress = ch;
	}else{
		lastPress = null;
	}
 });


}