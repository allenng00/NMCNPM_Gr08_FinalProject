const formidable = require('formidable');
const fs = require('fs');
const queryString = require('query-string');
const postModel = require('../models/postModel');
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'ptudw',
    api_key: '565745748995287',
    api_secret: '4uJ07atrvww7jJ0-BBVUodS1Q98'
});
const ITEM_PER_PAGE = 4;
const categoryCollection = require('../models/MongooseModel/categoryMongooseModel');
const postsCollection = require('../models/MongooseModel/postMongooseModel');
const AllID = "5fceeb7ed1d96a1a74e255fe";

function showUnsignedString(search) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var input = search;
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function(m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}
exports.renderposts = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const catid = req.query.catID;
    const search = req.query.txtSearch;
    var filter = {};

    if (search) {
        filter.titleUnsigned = new RegExp(showUnsignedString(search), 'i');
    }
    if (catid) {
        if (catid != ObjectId(AllID)) {
            filter.categoryID = ObjectId(catid);
        }
    }
    filter.isDeleted = false;

    const paginate = await postModel.listPost(filter, page, ITEM_PER_PAGE);
    const nextQuery = {...req.query, page: paginate.nextPage };
    const preQuery = {...req.query, page: paginate.prevPage };
    const category = await postModel.listCategory();
    var nameCategory = "";
    var id_category = "";
    if (catid) {
        const categoryTemp = await categoryCollection.findOne({ _id: ObjectId(catid) });
        nameCategory = categoryTemp.nameCategory;
        id_category = ObjectId(catid);
    } else {
        nameCategory = "Thể loại";
        id_category = "";
    }
    res.render('./posts/posts', {
        title: 'posts',
        posts: paginate.docs,
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        nextPageQueryString: queryString.stringify(nextQuery),
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        prevPageQueryString: queryString.stringify(preQuery),
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: ITEM_PER_PAGE,
        currentPage: paginate.page,
        category: category,
        id_category: id_category,
        nameCategory: nameCategory,
        Search: search,
        totalDocs: paginate.totalDocs,
    });
};

exports.renderUpdate = async(req, res, next) => {
    const post = await postModel.get(req.params.id);
    res.render('./posts/updatepost', { post, title: 'update' });
};

exports.renderAddpost = async(req, res, next) => {
    const category = await postModel.listCategory();
    res.render('./posts/addpost', { category, title: 'addpost' });
};
exports.add = (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const coverImage = files.txtImagePath;
        if (coverImage && coverImage.size > 0) {
            cloudinary.uploader.upload(coverImage.path, function(err, result) {
                fields.txtImagePath = result.url;

                postModel.post(fields).then(() => {
                    const category = postModel.listCategory();
                    // Pass data to view to display list of posts
                    res.render('./posts/addpost', { category, title: 'addpost' });
                });
            });
        } else {
            const category = postModel.listCategory();
            // Pass data to view to display list of posts
            res.render('./posts/addpost', { category, title: 'addpost' });
        }
    });
};

exports.update = (req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const coverImage = files.txtImagePath;
        if (coverImage && coverImage.size > 0) {
            cloudinary.uploader.upload(coverImage.path, function(err, result) {
                fields.txtImagePath = result.url;
                postModel.update(fields, req.params.id).then(() => {
                    // Pass data to view to display list of posts
                    res.redirect('../../posts');
                });
            });
        } else {
            postModel.update_no_image(fields, req.params.id).then(() => {
                // Pass data to view to display list of posts
                res.redirect('../../posts');
            });
        }
        // Get posts from model


    });
};

exports.delete = async(req, res, next) => {
    // Get posts from model
    await postModel.delete(req.params.id);
    // Pass data to view to display list of posts
    res.redirect('../../posts');
};