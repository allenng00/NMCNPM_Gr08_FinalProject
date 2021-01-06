const express = require('express');
const router = express.Router();
const passport = require('../passport');

const adminController = require('../controllers/adminController');

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

router.get('/profile/:id', isLogged, adminController.renderProfile);
router.post('/profile/:id', isLogged, adminController.saveProfile);

router.get('/changePassword/:id', isLogged, adminController.renderChangePassword);
router.post('/changePassword/:id', isLogged, adminController.changePassword);

module.exports = router;