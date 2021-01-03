var express = require('express');
const { route } = require('.');
var router = express.Router();

const indexController = require('../controllers/listController');
const userController = require('../controllers/userController');
const listController = require('../controllers/listController');
/* GET list of books. */
router.get('/', indexController.index);
//router.get('/account', userController.account);
router.get('/:id',listController.detail);
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('books/list', { title: 'Trang chủ' });
// });

module.exports = router;
