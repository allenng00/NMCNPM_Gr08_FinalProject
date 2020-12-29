
const { ObjectId } = require('mongodb');

const postModel = require('../models/postModel');
const cartModel = require('../models/cartModel');

exports.add_to_cart = async (req, res, next) => {
    const postID = req.params.id;
    const qty = parseInt(req.body.qty);
    console.log(qty);
    const cart = new cartModel(req.session.cart ? req.session.cart : {});
 
    const post = await postModel.get(postID);
        if (!post)
            return res.redirect('/');

        cart.add(post, post._id, qty);
        req.session.cart = cart;
        res.redirect('../../listpost/' + postID);
    
};

exports.listcart = async (req, res, next) => {
    if (!req.session.cart)
        return res.render('cart',{title: 'Giỏ hàng', posts: null});
    const cart = new cartModel(req.session.cart);
    res.render('cart',{title: 'Giỏ hàng', posts: cart.generateArray(), totalPrice: cart.totalPrice});
};

exports.deleteItem = async (req, res, next) => {
    var cart = new cartModel(req.session.cart);
    const post = await postModel.get(req.params.id);
    cart.deleteItem(post._id);
    req.session.cart = cart;
    res.redirect('../../listcart');
};
