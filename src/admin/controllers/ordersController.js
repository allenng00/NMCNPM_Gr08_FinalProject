// const queryString = require('query-string');
// const orderModel = require('../models/orderModel');
// const { ObjectId } = require('mongodb');

// const ITEM_PER_PAGE = 3;


// exports.renderOrders = async(req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const search = req.query.txtSearch;
//     const stt = req.query.stt;
//     var filter = {};

//     if (search) {
//         filter.user = new RegExp(search, 'i');
//     }
//     if (stt) {
//         if (stt === "1")
//             filter.status = "Đợi duyệt";
//         if (stt === "2")
//             filter.status = "Đã duyệt";
//         if (stt === "3")
//             filter.status = "Đã giao";
//         if (stt === "4")
//             filter.status = "Đã huỷ";
//     }
//     //filter.status = "Mở";

//     const paginate = await orderModel.listUser(filter, page, ITEM_PER_PAGE);
//     const nextQuery = {...req.query, page: paginate.nextPage };
//     const preQuery = {...req.query, page: paginate.prevPage };

//     res.render('./orders/orders', {
//         title: 'User',
//         orders: paginate.docs,
//         hasNextPage: paginate.hasNextPage,
//         nextPage: paginate.nextPage,
//         nextPageQueryString: queryString.stringify(nextQuery),
//         hasPreviousPage: paginate.hasPrevPage,
//         prevPage: paginate.prevPage,
//         prevPageQueryString: queryString.stringify(preQuery),
//         lastPage: paginate.totalPages,
//         ITEM_PER_PAGE: ITEM_PER_PAGE,
//         currentPage: paginate.page,
//         Search: search,
//         totalDocs: paginate.totalDocs,
//     });
// };

// exports.renderDetail = async(req, res, next) => {
//     const order = await orderModel.get(req.params.id);
//     const delivering = order.status === "Đã duyệt";
//     const checking = order.status === "Đợi duyệt";


//     res.render('./orders/orderDetail', { title: 'Chi tiết giao hàng', order: order, delivering, checking });
// };


// exports.checked = async(req, res, next) => {
//     await orderModel.checked(req.params.id);
//     res.redirect('./');
// };

// exports.cancel = async(req, res, next) => {
//     await orderModel.cancel(req.params.id);
//     res.redirect('./');
// };

// exports.delivered = async(req, res, next) => {
//     await orderModel.delivered(req.params.id);
//     res.redirect('./');
// };