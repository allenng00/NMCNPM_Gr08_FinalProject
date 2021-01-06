const app = require('../app');
const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('../');
    }
}

router.get('/', isLogged, indexController.renderIndex);



module.exports = router;