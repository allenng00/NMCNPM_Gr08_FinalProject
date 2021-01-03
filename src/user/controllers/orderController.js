const { ObjectId } = require('mongodb');

const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

exports.index = async (req, res, next) =>{
    //const listorder = await orderModel.getListOrder(req.user._id);
    const listorder_pending = await orderModel.getListOrderWithStatus(req.user._id, "Đợi duyệt");
    const listorder_delivering = await orderModel.getListOrderWithStatus(req.user._id, "Đang giao");
    const listorder_delivered = await orderModel.getListOrderWithStatus(req.user._id, "Đã giao");
    res.render('orders/order',{title: 'Đơn hàng', 
    orders_pending: listorder_pending, 
    orders_delivering: listorder_delivering, 
    orders_delivered: listorder_delivered
    });
};

exports.detailOrder = async (req, res, next) => {
    const orderID = req.params.id;
    const order = await orderModel.getOrder(orderID);
    const address = order.address +', ' + order.ward + ', ' + order.district + ', ' + order.city;
    res.render('orders/detailOrder', {title: 'Chi tiết đơn hàng', order: order, address: address});
};

exports.createOrder = async (req,res,next) => {
    const {firstName, lastName, phone, city, district, ward, address} = req.body;
    const cart = req.user.cart;
    const id = req.user._id;
    const username = req.user.username;
    const totalOrder = req.user.cart.totalPrice + parseInt(30000);
    const newOrder = {
        id, username, firstName, lastName, phone, city, district, ward, address, cart, totalOrder
    }
    await orderModel.createOrder(newOrder);
    await userModel.createCart(req.user._id, null);
    //req.flash('success','Đơn hàng đã đặt thành công');
    res.redirect('../../carts/listcart');
};
