const queryString = require('query-string');
const userModel = require('../models/userModel');
const { ObjectId } = require('mongodb');

const ITEM_PER_PAGE = 10;

exports.renderUsers = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.txtSearch;
    const stt = req.query.stt;
    var filter = {};
    var nameSort = "Mặc định";

    if (search) {
        filter.username = new RegExp(search, 'i');
    }
    if (stt) {
        if (stt === "Mo") {
            filter.status = "Mở";
            nameSort = "Mở";
        }
        if (stt === "Khoa") {
            filter.status = "Khoá";
            nameSort = "Khoá";
        }
    }
    //filter.status = "Mở";

    const paginate = await userModel.listUser(filter, page, ITEM_PER_PAGE);
    const nextQuery = {...req.query, page: paginate.nextPage };
    const preQuery = {...req.query, page: paginate.prevPage };

    res.render('./users/users', {
        title: 'User',
        users: paginate.docs,
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        nextPageQueryString: queryString.stringify(nextQuery),
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        prevPageQueryString: queryString.stringify(preQuery),
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: ITEM_PER_PAGE,
        currentPage: paginate.page,
        Search: search,
        totalDocs: paginate.totalDocs,
        nameSort,
    });
};

exports.renderDetail = async(req, res, next) => {
    const user_user = await userModel.get(req.params.id);

    res.render('./users/userProfile', { title: 'Thông tin cá nhân', user_user });
};

exports.closeUser = async(req, res, next) => {
    await userModel.close(req.params.id);
    res.redirect('./');
};

exports.openUser = async(req, res, next) => {
    await userModel.open(req.params.id);
    res.redirect('./');
};