const app = require('../app');
var express = require('express');
var router = express.Router();

const postsController = require('../controllers/postsController');
const commentsController = require('../controllers/commentsController');

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('../../');
    }
}

router.get('/admin', isLogged, postsController.renderPostsAdmin);
router.get('/user', isLogged, postsController.renderPostsUser);

router.get('/admin/addpost', isLogged, postsController.renderAddPost);
router.post('/admin/addpost', postsController.add);


router.get('/admin/update/:id', isLogged, postsController.renderUpdatePost);
router.post('/admin/update/:id', postsController.update);

router.get('/user/update/:id', isLogged, postsController.renderUpdatePost2);
router.post('/user/update/:id', postsController.update2);

router.get('/admin/comments/:id', isLogged, commentsController.renderComment);
router.post('/admin/comments/:id', isLogged, commentsController.add_comment);

router.get('/user/comments/:id', isLogged, commentsController.renderComment2);
router.post('/user/comments/:id', isLogged, commentsController.add_comment);

router.get('/admin/comments/:id/delete/:index', isLogged, commentsController.delete);
router.get('/user/comments/:id/delete/:index', isLogged, commentsController.delete);

//router.get('/top10', isLogged, productsController.renderTop10);

module.exports = router;