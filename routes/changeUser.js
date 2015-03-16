"use strict";
var express = require('express');
var router = express.Router();
var ChatRoom = require("../models/chatRoom");
/* GET users listing. */
router.post('/', function(req, res) {
	console.log(req.body.name)
	var user = req.body.name;
	if(typeof user === 'string' && user.length > 0 
		&& user.length <= 15 && !req.session.userSet){
		
		req.session.userName = user;
		req.session.userSet = true;
		res.send(req.session.userName);
	}
	res.send('Incorrect user type');
});

module.exports = router;
