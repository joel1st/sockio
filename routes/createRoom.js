"use strict";
var express = require('express');
var router = express.Router();
var ChatRoom = require("../models/chatRoom");
/* GET users listing. */
router.post('/', function(req, res) {
	var chat = new ChatRoom(req.body);

	//saves chatoom and replies with the chat room id.
	chat.save(function(err, data){
		if(!err){
			res.send(data._id);
		} else {
			res.status(400).send('did not validate');
		}
	});
});

module.exports = router;
