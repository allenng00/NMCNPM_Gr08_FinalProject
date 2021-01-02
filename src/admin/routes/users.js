const app = require('../app');
var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('../../');
    }
}

router.get('/', isLogged, usersController.renderUsers);

router.get('/detail/:id', isLogged, usersController.renderDetail);

router.get('/detail/:id/open', isLogged, usersController.openUser);
router.get('/detail/:id/close', isLogged, usersController.closeUser);



module.exports = router;