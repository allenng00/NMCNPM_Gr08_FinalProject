const app = require('../app');
var express = require('express');
var router = express.Router();
const productsController = require('../controllers/productsController');

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('../../');
    }
}

router.get('/', isLogged, productsController.renderProducts);

router.get('/addbook', isLogged, productsController.renderAddbook);
router.post('/addbook', productsController.add);

router.get('/update/:id', isLogged, productsController.renderUpdate);
router.post('/update/:id', productsController.update);

router.get('/delete/:id', isLogged, productsController.delete);


module.exports = router;