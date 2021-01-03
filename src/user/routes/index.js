const app = require('../app');
const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');
const listController = require('../controllers/listController');
const userController = require('../controllers/userController');

const listbookRouter = require('../routes/listbook');
const userRouter = require('../routes/users');

/* GET list of books. */
router.get('/', indexController.index);
router.get('/home', indexController.index);
//router.get('/account', userController.index);
//router.get('/listbook', listController.index);
//router.get('/account', userController.account);
router.use('/listbook', listbookRouter);
router.use('/account',userRouter);
router.get('/:id',listController.detail );

//router.get('/:id', listController.detail);
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('books/list', { title: 'Trang chủ' });
// });

module.exports = router;
