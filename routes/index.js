"use strict";
var express = require('express');
var router = express.Router();
var config = require('../config');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { user:{
  	set: req.session.userSet,
  	name: req.session.userName,
  	port: config.port
  }});
});

module.exports = router;
