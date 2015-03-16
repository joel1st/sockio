"use strict";
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res) {
	console.log(req.session.userSet)
	var user = req.body.name;
	
	if(typeof user === 'string' && user.length > 0 && user.length <= 15 && !req.session.userSet){
		req.session.userName = user;
		req.session.userSet = true;
		console.log('ayooo')
		res.json(req.session.userName);
	} else {
		res.status(400).send('Incorrect Data Type!');
	}
	
});

module.exports = router;
