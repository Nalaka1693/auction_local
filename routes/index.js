var express = require('express');
var router = express.Router();


var exp = 'New Express';
var test = 'New Test';
var flink = 'http://localhost:3000/';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: exp, test: test, flink: flink});
});

module.exports = router;
