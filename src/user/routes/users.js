const express = require('express');
const router = express.Router();

const passport = require('../passport');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const orderRouter = require('../routes/order');
/* GET users listing. */
// router.get('/', function(req, res, next){
//   const message = req.flash('error');
//   res.render('users/login',{title: 'Đăng nhập', message, hasErr: message.length > 0});
// });

router.get('/', function(req, res, next){
  const message = req.flash('error');
  res.render('error',{title: 'Error', message, hasErr: message.length > 0});
});

router.get('/switch_login', function(req, res, next){
  req.logout();
  res.redirect('login');
});

router.get('/login', function(req, res, next){
  const message = req.flash('error');
  res.render('users/login',{title: 'Đăng nhập', message, hasErr: message.length > 0});
});

router.post('/login', passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true}));

router.get('/register', function(req, res, next){
  res.render('users/register',{title: 'Đăng ký'});
})
router.post('/register', userController.addUser);

router.get('/profile/:id', checkAuthentication, userController.profile);
router.post('/profile/:id', userController.update_profile);

router.get('/mypost', checkAuthentication, userController.mypost);

router.get('/addpost', checkAuthentication, userController.addpost_page);
router.post('/addpost', userController.addpost);

router.get('/logout', checkAuthentication, function(req,res,next){
  req.logout();
  res.redirect('/');
});

router.use('/order', checkAuthentication , orderRouter);

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      next();
  } else{
      res.redirect("/users/login");
  }
}
module.exports = router;
