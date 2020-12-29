const app = require('../app');
var express = require('express');
var router = express.Router();

const listController = require('../controllers/listController');
const cartController = require('../controllers/cartController');

router.get('/', listController.index);
router.get('/:id',listController.detail);
router.post('/:id',cartController.add_to_cart);


module.exports = router;