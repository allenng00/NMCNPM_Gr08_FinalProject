const postModel = require('../models/postModel');
const listController = require('../controllers/listController');

exports.index = async (req, res, next) => {
    const search = req.query.search;
    // Get posts from model
    const hotPosts = await postModel.listWithStatus("HOT");
    const newPosts = await postModel.listWithStatus("NEW");
    if (search)
    {
        res.redirect('/listpost?search='+search);
    }
    else
    // Pass data to view to display list of posts
        res.render('index', {title: "Trang chủ", hotPosts, newPosts});
};