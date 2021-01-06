// const { ObjectId } = require('mongodb');

// const ordersCollection = require('./MongooseModel/ordersMongooseModel');
// const booksCollection = require('./MongooseModel/bookMongooseModel');


// exports.listUser = async(filter, pageNumber, itemPerPage) => {
//     let orders = await ordersCollection.paginate(filter, {
//         page: pageNumber,
//         limit: itemPerPage,
//     });
//     return orders;
// }

// exports.get = async(id) => {
//     const order = await ordersCollection.findOne({ _id: ObjectId(id) })
//     return order;
// }

// exports.delivered = async(id) => {
//     await ordersCollection.updateOne({ _id: ObjectId(id) }, {
//         status: "Đã giao"
//     })
// }

// exports.checked = async(id) => {
//     await ordersCollection.updateOne({ _id: ObjectId(id) }, {
//         status: "Đã duyệt"
//     })
// }

// exports.cancel = async(id) => {
//     const order = await ordersCollection.findOne({ _id: ObjectId(id) });
//     const arr = order.order.items;
//     for (var i in arr) {
//         const book = await booksCollection.findOne({ _id: ObjectId(arr[i].item._id) });
//         const qty = book.qty + arr[i].qty;
//         const qtySelled = book.qtySelled - arr[i].qty;
//         await booksCollection.updateOne({ _id: ObjectId(arr[i].item._id) }, {
//             qty: qty,
//             qtySelled: qtySelled
//         })
//     }
//     await ordersCollection.updateOne({ _id: ObjectId(id) }, {
//         status: "Đã huỷ"
//     })
// }