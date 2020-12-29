const app = require('../app');
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
//router.get('/add_to_cart/:id',cartController.add_to_cart);

router.get('/listcart',cartController.listcart);

router.get('/listcart/remove/:id', cartController.deleteItem);
module.exports = router;