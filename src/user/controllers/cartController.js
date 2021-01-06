
const { ObjectId } = require('mongodb');

const postModel = require('../models/postModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');

exports.add_to_cart = async (req, res, next) => {
    const postID = req.params.id;
    const qty = parseInt(req.body.qty);
    const user = req.user;
    var cart;
    const post = await postModel.get(postID);
    
    
    if (!post)
        return res.redirect('/');

    if (user)
    {
        cart = new cartModel(user.cart ? user.cart : {});
    }
    else
    {
        cart = new cartModel(req.session.cart ? req.session.cart : {});
    }

    cart.add(post, post._id, qty);
    
    if (user)
        userModel.createCart(user._id, cart);
    else
        req.session.cart = cart;
    res.redirect('../../listpost/' + postID);
    
};

exports.listcart = async (req, res, next) => {
    var cart;
    if (req.user)
    {
        if (!req.user.cart)
            return res.render('cart',{title: 'Giỏ hàng', posts: null});
        cart = new cartModel(req.user.cart);
    }
    else
    {
        if (!req.session.cart)
            return res.render('cart',{title: 'Giỏ hàng', posts: null});
        cart = new cartModel(req.session.cart);
    }
    res.render('cart',{title: 'Giỏ hàng', posts: cart.generateArray(), totalPrice: cart.totalPrice});
   
};

exports.deleteItem = async (req, res, next) => {
    const user = req.user;
    var cart;

    if (user)
    {
        cart = new cartModel(user.cart);
    }
    else 
        cart = new cartModel(req.session.cart);

    const post = await postModel.get(req.params.id);
    cart.deleteItem(post._id);

    if (user)
        userModel.createCart(user._id, cart);
    else
        req.session.cart = cart;

    res.redirect('../../listcart');
};

exports.checkout =async (req,res,next) =>{
    if (req.user.cart)
    {
        const cart = new cartModel(req.user.cart);
        res.render('checkout',{
        title: 'Mua hàng', 
        posts: cart.generateArray(), 
        totalPrice: cart.totalPrice,
        totalOrder: cart.totalPrice + parseInt(30000)
        })
    }
    else    
        res.render('cart',{title: 'Giỏ hàng'});
    
};

