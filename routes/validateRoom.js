"use strict";
var express = require('express');
var router = express.Router();
var ChatRoom = require("../models/chatRoom");
/* GET users listing. */
router.post('/', function(req, res) {
	console.log(req.body)
	var chat = new ChatRoom(req.body);
	chat.save(function(err, data){
		console.log(err);
		console.log(data);
		res.send(data._id);
	});
	
});

module.exports = router;
