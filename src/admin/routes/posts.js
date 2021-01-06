const app = require('../app');
var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController');

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


//router.get('/admin/update/:id', isLogged, postsController.renderUpdatePost);
//router.post('/admin/update/:id', postsController.update);

//router.get('/top10', isLogged, productsController.renderTop10);
// router.get('/delete/:id', isLogged, productsController.delete);
// router.get('/comments/:id', isLogged, commentsController.renderComment);
// router.post('/comments/:id', isLogged, commentsController.add_comment);
// router.get('/comments/:id/delete/:index', isLogged, commentsController.delete);


module.exports = router;