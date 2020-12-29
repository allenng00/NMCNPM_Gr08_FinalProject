const app = require('../app');
var express = require('express');
var router = express.Router();

const listController = require('../controllers/listController');
const cartController = require('../controllers/cartController');
/* GET list of books. */
router.get('/', listController.index);
router.get('/:id',listController.detail);
router.post('/:id',cartController.add_to_cart);
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('books/list', { title: 'Trang chủ' });
// });

module.exports = router;