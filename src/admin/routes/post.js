const app = require('../app');
var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.renderposts);

router.get('/addpost', postsController.renderAddpost);
router.post('/addpost', postsController.add);

router.get('/update/:id', postsController.renderUpdate);
router.post('/update/:id', postsController.update);

router.get('/delete/:id', postsController.delete);

module.exports = router;