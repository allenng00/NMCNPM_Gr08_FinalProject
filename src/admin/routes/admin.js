const app = require('../app');
var express = require('express');
var router = express.Router();
const passport = require('../passport');

const loginController = require('../controllers/loginController');

/* GET users listing. */

router.get('/', loginController.renderLogin);

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
);

module.exports = router;