"use strict";
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { user:{
  	set: req.session.userSet,
  	name: req.session.userName
  }});
});

module.exports = router;
