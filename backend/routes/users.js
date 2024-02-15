const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Here will users lie around and wait for soething better to do');
});

module.exports = router;
