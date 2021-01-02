const { ObjectId } = require('mongodb');

const ordersCollection = require('./MongooseModel/ordersMongooseModel');

exports.listUser = async(filter, pageNumber, itemPerPage) => {
    let orders = await ordersCollection.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return orders;
}

exports.get = async(id) => {
    const order = await ordersCollection.findOne({ _id: ObjectId(id) })
    return order;
}

exports.delivered = async(id) => {
    await ordersCollection.updateOne({ _id: ObjectId(id) }, {
        status: "Đã giao"
    })
}

exports.checked = async(id) => {
    await ordersCollection.updateOne({ _id: ObjectId(id) }, {
        status: "Đã duyệt"
    })
}

exports.cancel = async(id) => {
    await ordersCollection.updateOne({ _id: ObjectId(id) }, {
        status: "Đã huỷ"
    })
}