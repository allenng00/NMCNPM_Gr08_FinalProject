const app = require('../app');
var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController');

/* GET users listing. */

router.get('/', loginController.renderLogin);

router.use('/home', require('./index'));

router.post('/', loginController.renderAdmin);


module.exports = router;