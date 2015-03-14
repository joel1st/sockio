"use strict";
var express = require('express');
var passport = require('passport');
var router = express.Router();
/* GET users listing. */
router.get('/', passport.authenticate('local'), function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
