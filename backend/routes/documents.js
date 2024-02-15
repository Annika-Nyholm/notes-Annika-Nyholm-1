const express = require('express');
const router = express.Router();

/* GET documents listing. */
router.get('/', function(req, res, ) {
  res.send('Here will documents lie and wait for somebody...to lean on!');
});

module.exports = router;
