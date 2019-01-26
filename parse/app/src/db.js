'use strict';
const Datastore = require('nedb'); 
const db = { 
	   tournaments: new Datastore({ filename: './data/tournaments.db', autoload: true }),
	   modified: new Datastore({ filename: './data/modified.db', autoload: true })
	}

module.exports = db;