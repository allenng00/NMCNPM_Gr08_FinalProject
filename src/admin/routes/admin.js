const app = require('../app');
var express = require('express');
var router = express.Router();
const passport = require('../passport');

const adminController = require('../controllers/adminController');

/* GET users listing. */

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('../');
    }
}

router.get('/', adminController.renderLogin);

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.get('/logout', isLogged, function(req, res, next) {
    req.logOut();
    res.redirect('/');
});

router.get('/profile/:id', adminController.renderProfile);
router.post('/profile/:id', adminController.saveProfile);



module.exports = router;