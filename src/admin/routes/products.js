// const app = require('../app');
// var express = require('express');
// var router = express.Router();
// const productsController = require('../controllers/productsController');
// const commentsController = require('../controllers/commentsController');

// function isLogged(req, res, next) {
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.redirect('../../');
//     }
// }

// router.get('/', isLogged, productsController.renderProducts);

// router.get('/top10', isLogged, productsController.renderTop10);


// router.get('/addbook', isLogged, productsController.renderAddbook);
// router.post('/addbook', productsController.add);

// router.get('/update/:id', isLogged, productsController.renderUpdate);
// router.post('/update/:id', productsController.update);

// router.get('/delete/:id', isLogged, productsController.delete);

// router.get('/comments/:id', isLogged, commentsController.renderComment);
// router.post('/comments/:id', isLogged, commentsController.add_comment);

// router.get('/comments/:id/delete/:index', isLogged, commentsController.delete);


// module.exports = router;