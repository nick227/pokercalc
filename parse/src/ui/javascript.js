var js = `document.addEventListener("DOMContentLoaded", function() {

	updatePreload();
	function updatePreload(){

						var preloads = document.querySelectorAll('.preload');
						var preloader = document.querySelectorAll('.preloader');
						var main =  document.querySelector('.main');
						for(var i = 0, length1 = preloads.length; i < length1; i++){
							preloads[i].style.display = 'block';
						}
						for(var i = 0, length1 = preloader.length; i < length1; i++){
							preloader[i].style.display = 'none';
						}
						main.classList.remove('flex-center');
						/****************/
						window.addEventListener('beforeunload', function(e) {
						main.classList.add('flex-center');
						for(var i = 0, length1 = preloads.length; i < length1; i++){
							preloads[i].style.display = 'none';
						}
							
						});


	}
						/****************/

						var tourneys = document.getElementsByClassName('item-list-rounds');
						for(var i = 0, length1 = tourneys.length; i < length1; i++){
							var t = tourneys[i];
							var nav = t.previousSibling;
							makeSortable(t, nav);
						}
						function makeSortable(tournament, nav){
							var links = nav.getElementsByTagName('a');
							for(var i = 0, length1 = links.length; i < length1; i++){
								var a = links[i];
								a.onclick = sort;
							}
							function sort(key){
								var items = Array.prototype.slice.call(key.target.parentNode.nextSibling.children);
								var dir = key.target.getAttribute('data-dir') === 'asc' ? 'desc' : 'asc';
								key.target.setAttribute('data-dir', dir);
								var selector = key.target.getAttribute('data-selector');
								var sorted = items.sort(function(a,b){
									if(dir === 'asc'){
										return (a.querySelector('.'+selector).innerHTML) - (b.querySelector('.'+selector).innerHTML);
									}else{
										return (b.querySelector('.'+selector).innerHTML) - (a.querySelector('.'+selector).innerHTML);
									}
								});
								tournament.innerHTML = '';
								for(var i = 0, length1 = sorted.length; i < length1; i++){
									tournament.appendChild(sorted[i]);
								}
							}
						};
						/****************/
						var btns = document.querySelectorAll('.thead-select');
						for(var i = 0, length1 = btns.length; i < length1; i++){
							var btn = btns[i];
							btn.onchange = filterTable;
						}
						function filterTable(e){
							e.preventDefault()
							var colIndex = e.target.parentNode.cellIndex
							var val = e.target.options[e.target.selectedIndex].value
							var tbl = e.target.parentNode.parentNode.parentNode.parentNode
							var rows = tbl.getElementsByTagName('tr'), row=null, cells=null
							for(var i = 1, length1 = rows.length; i < length1; i++){
								row = rows[i]
								if(val==='reset_rows'){
										row.classList.remove('hidden')
								}else{
									if(row.cells[colIndex].innerHTML !== val){
										row.classList.add('hidden')
									}else{
										row.classList.remove('hidden')
									}

								}
							}
						}
						/****************/
					  	var toggleBtns = document.querySelectorAll('.toggleNext');
					  	addToggles(toggleBtns);
						/****************/
					  	var tableRows = document.querySelectorAll('.action-row');
					  	for(var i = 0, length1 = tableRows.length; i < length1; i++){
					  		var row = tableRows[i];
					  		row.onclick = showModal;
					  	}
					  	function showModal(e){
					  			var sid  = e.target.parentNode.getAttribute('data-sid');
					  			var html = document.querySelector('.sid'+sid).cloneNode(true);
					  			html.style.display = 'block';
					  			var closeDiv = document.createElement('div');
					  			closeDiv.innerHTML = "close";
					  			closeDiv.onclick = closeModal;
					  			closeDiv.classList.add('btn');
					  			closeDiv.classList.add('btn-close');
					  			var modal = document.createElement('div');
					  			modal.style.top = document.documentElement.scrollTop || document.body.scrollTop;
					  			modal.classList.add('modal');
					  			modal.appendChild(html);
					  			modal.insertBefore(closeDiv, modal.firstChild);
							  	var toggleBtns = modal.querySelectorAll('.toggleNext');
							  	addToggles(toggleBtns);
					  			document.querySelector('body').appendChild(modal);
					  	}

					});
					function closeModal(){
						var modal = document.querySelector('.modal');
						modal.parentNode.removeChild(modal);
					}

					function addToggles(toggleBtns){
					  	for(var i = 0, length1 = toggleBtns.length; i < length1; i++){
					  		var btn = toggleBtns[i];
					  		btn.onclick = function(e){
					  			var elm = this.nextSibling;
					  			if(elm.classList.contains('hidden')){
					  				if(elm.parentNode.classList.contains('rounds_item') || elm.parentNode.parentNode.classList.contains('item-list-tournament')){
					  					//elm.parentNode.parentNode.parentNode.style.width = '100%';
					  					elm.parentNode.parentNode.parentNode.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
					  				}
					  				elm.classList.remove('hidden');
					  			}else{
					  				if(elm.parentNode.classList.contains('rounds_item') || elm.parentNode.parentNode.classList.contains('item-list-tournament')){
					  					//elm.parentNode.parentNode.parentNode.style.width = 'auto';
					  				}
					  				elm.classList.add('hidden');
					  			}
					  		}
					  	}
					}`;
module.exports = js;