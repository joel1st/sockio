"use strict";
var express = require('express');
var router = express.Router();
var ChatRoom = require("../models/chatRoom");
/* GET users listing. */
router.post('/', function(req, res) {
	console.log(req.body)
	var chat = new ChatRoom(req.body);
	chat.save(function(err, data){
		if(!err){
			res.send(data._id);
		} else {
			res.status(400).send('did not validate')
		}
	});
});

module.exports = router;
