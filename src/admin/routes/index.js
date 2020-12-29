const app = require('../app');
var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

/* GET home page. */

router.get('/', indexController.renderIndex);

router.use('/products', require('./product'));


module.exports = router;