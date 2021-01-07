const app = require('../app');
var express = require('express');
var router = express.Router();

const listController = require('../controllers/listController');
const cartController = require('../controllers/cartController');
const commentController = require('../controllers/commentController');
/* GET list of books. */
router.get('/', listController.index);
router.get('/:id',listController.detail);
//router.post('/:id',cartController.add_to_cart);
router.post('/add_comment/:id', commentController.add_comment);

module.exports = router;