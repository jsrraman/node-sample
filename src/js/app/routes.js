var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.send('Welcome to sample node server')
});

router.post('/', function (req, res) {
  console.log(req.body)
  res.send({success:true})
});

module.exports = router;