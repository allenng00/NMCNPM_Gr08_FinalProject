const { ObjectId} = require('mongodb');
const orderCollection = require('./MongooseModel/orderMongooseModel');

exports.createOrder = async (newOrder) => {
    await orderCollection.create({
        userID: ObjectId(newOrder.id),
        username: newOrder.username,
        firstName: newOrder.firstName,
        lastName: newOrder.lastName,
        phone: newOrder.phone,
        city: newOrder.city,
        district: newOrder.district,
        ward: newOrder.ward,
        address: newOrder.address,
        cart: newOrder.cart,
        totalOrder: newOrder.totalOrder,
        status: "Đợi duyệt"
    });
};

exports.getOrder = async (id) =>{
    const order = await orderCollection.findOne({_id: ObjectId(id)});
    return order;
};

exports.getListOrderWithStatus = async (id, status) =>{
    const listOrder = await orderCollection.find({userID: ObjectId(id), status: status});
    return listOrder;
};