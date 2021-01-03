const app = require('../app');
var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

/* GET home page. */

router.get('/', isLogged, indexController.renderIndex);

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('../');
    }
}


module.exports = router;