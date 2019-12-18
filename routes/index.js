var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '主页' });
});

router.get('/add', function(req, res, next) {
  res.render('/add', { title: '新增' });
});

module.exports = router;
