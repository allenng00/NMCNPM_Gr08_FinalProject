const app = require('../app');
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
//router.get('/add_to_cart/:id',cartController.add_to_cart);

router.get('/listcart',cartController.listcart);
router.get('/listcart/remove/:id', cartController.deleteItem);
router.get('/checkout',checkAuthentication, cartController.checkout);
router.post('/checkout',checkAuthentication, orderController.createOrder);

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/users/login");
    }
  }

module.exports = router;