
const { ObjectId } = require('mongodb');

const bookModel = require('../models/bookModel');
const cartModel = require('../models/cartModel');

exports.add_to_cart = async (req, res, next) => {
    const bookID = req.params.id;
    const qty = parseInt(req.body.qty);
    console.log(qty);
    const cart = new cartModel(req.session.cart ? req.session.cart : {});
 
    const book = await bookModel.get(bookID);
        if (!book)
            return res.redirect('/');

        cart.add(book, book._id, qty);
        req.session.cart = cart;
        res.redirect('../../listbook/' + bookID);
    
};

exports.listcart = async (req, res, next) => {
    if (!req.session.cart)
        return res.render('cart',{title: 'Giỏ hàng', books: null});
    const cart = new cartModel(req.session.cart);
    res.render('cart',{title: 'Giỏ hàng', books: cart.generateArray(), totalPrice: cart.totalPrice});
};

exports.deleteItem = async (req, res, next) => {
    var cart = new cartModel(req.session.cart);
    const book = await bookModel.get(req.params.id);
    cart.deleteItem(book._id);
    req.session.cart = cart;
    res.redirect('../../listcart');
};
