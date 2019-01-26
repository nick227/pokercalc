const electron = require('electron')
const {app, BrowserWindow, Menu} = electron
const url = require("url");
const path = require("path");
const htmlWrap = require('../src/ui/htmlWrap');
require('electron-debug')();
let win; /*must be global*/
const pokerParser = require('../src/parser');
const db = require("./src/db.js");

const {ipcMain: ipc} = require('electron');
 
ipc.on('update-directory', async (event, dirName) => {
    const res = await handleMsg(dirName);
    event.sender.send('update-directory-response', res);
});
function handleMsg(msg){
	console.log("oo", msg);
	return "ok";
}
	var url1 = '../../../../../Users/BaronJack/AppData/Local/PokerStars', url2 = '../';
	var active_url = url1;
	var limit = 20;

function createWindow() { 
	//start(function(data){
		const screenElectron = electron.screen;
		const mainScreen = screenElectron.getPrimaryDisplay();
		const dimensions = mainScreen.size;
       		win = new BrowserWindow({width: dimensions.width, height: dimensions.height}) 
	   		win.loadFile("app.html");
			win.webContents.openDevTools()
			win.on("closed", function() {
	    		win = null
	  		})
	//})
	//win.loadURL("data:text/html;charset=utf-8," + encodeURI(data)
}
app.on('ready', createWindow)
app.on("window-all-closed", function() {
  app.quit();
})

function start(callback){

	var fileNameStr = pokerParser.checkDir(active_url);

	db.modified.remove({type:'last-modified', value:fileNameStr}, function(err, doc){
		doc = doc!==null ? doc.value : false;
		console.log(doc, fileNameStr);
		if(doc === fileNameStr){
			db.tournaments.findOne({}, function(err,data){
				console.log("found:", typeof data, data);
				callback(data.html);
			});
		}else{
			pokerParser.parser(active_url, limit, function(data, i) {
				var html = htmlWrap(data);
				db.tournaments.remove({});
				console.log("writing:", data.length, html.length);
			    db.tournaments.insert({html:html}, function(err, res){
			    	if(err){
			    		console.log("db err:", err);
			    	}else{
			    		console.log("db insert:", res.length);
			    		callback(html);
			    	}
			    });


			});
			db.modified.update({type:'last-modified'},{$set:{value:fileNameStr}}, {upsert:true}, function(e,r){
				console.log('last-modified update');
			});
		}
	});

}