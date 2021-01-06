const formidable = require('formidable');
const queryString = require('query-string');
const postModel = require('../models/postModel');
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dpzszugjp',
    api_key: '163377278981499',
    api_secret: 'mQ8tpbcRdL84rx8Azz_VtCAJRZ0'
});

const ITEM_PER_PAGE = 5;
const categoriesCollection = require('../models/MongooseModel/categoriesMongooseModel');
const AllID = "5ff4814feb4a4a05dc5f4961";

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
exports.renderPostsAdmin = async(req, res, next) => {
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

    const paginate = await postModel.listBook(filter, page, ITEM_PER_PAGE);
    const nextQuery = {...req.query, page: paginate.nextPage };
    const preQuery = {...req.query, page: paginate.prevPage };
    const category = await postModel.listCategory();
    var nameCategory = "";
    var id_category = "";
    if (catid) {
        const categoryTemp = await categoriesCollection.findOne({ _id: ObjectId(catid) });
        nameCategory = categoryTemp.nameCategory;
        id_category = ObjectId(catid);
    } else {
        nameCategory = "Thể loại";
        id_category = "";
    }
    res.render('./posts/postsAdmin', {
        title: 'Bài viết admin',
        posts: paginate.docs,
        category: category,
        id_category: id_category,
        nameCategory: nameCategory,
        totalDocs: paginate.totalDocs,
        //Phân trang
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        nextPageQueryString: queryString.stringify(nextQuery),
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        prevPageQueryString: queryString.stringify(preQuery),
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: ITEM_PER_PAGE,
        currentPage: paginate.page
    });
};

// exports.renderTop10 = async(req, res, next) => {
//     const filter = {};
//     filter.isDeleted = false;
//     const paginate = await bookModel.listBookTop10(filter);

//     res.render('./products/top10', {
//         title: 'Top 10',
//         books: paginate.docs,
//     });
// };

// exports.renderUpdate = async(req, res, next) => {
//     const book = await bookModel.get(req.params.id);
//     res.render('./products/updatebook', { book, title: 'Cập nhật sản phẩm', fade: "fade" });
// };

// exports.renderAddbook = async(req, res, next) => {
//     const category = await bookModel.listCategory();
//     res.render('./products/addbook', { category, title: 'Thêm sản phẩm', fade: "fade" });
// };
// exports.add = async(req, res, next) => {
//     const form = formidable({ multiples: true });

//     form.parse(req, async(err, fields, files) => {
//         if (err) {
//             next(err);
//             return;
//         }
//         const title = await bookModel.checkTitle(showUnsignedString(fields.txtTitle).toLowerCase());
//         if (!title) {
//             return res.render('products/addbook', {
//                 title: "Thêm sách",
//                 messageTitle: "Tên sách đã tồn tại, vui lòng vào update!",
//                 fade: "fade",
//                 txtTitle: fields.txtTitle,
//                 txtImagePath: fields.txtImagePath,
//                 txtImagePath_more: fields.txtImagePath_more,
//                 txtDescription: fields.txtDescription,
//                 txtDetail: fields.txtDetail,
//                 txtOldPrice: fields.txtOldPrice,
//                 txtSalePrice: txtSalePrice,
//                 txtStatus: fields.txtStatus,
//                 txtCategory: fields.txtCategory,
//                 txtQty: fields.txtQty
//             });
//         }
//         const imageType = ["image/png", "image/jpeg"];
//         const coverImage = files.txtImagePath;
//         const listImage = files.txtImagePath_more;
//         const arr = [];
//         if (listImage && listImage.length > 0) {
//             for (var i in listImage) {
//                 if (imageType.indexOf(listImage[i].type) === -1)
//                     return res.render('products/addbook', {
//                         title: "Thêm sách",
//                         messageImage: "Phải là file ảnh!",
//                         fade: "fade",
//                         txtTitle: fields.txtTitle,
//                         txtImagePath: fields.txtImagePath,
//                         txtImagePath_more: fields.txtImagePath_more,
//                         txtDescription: fields.txtDescription,
//                         txtDetail: fields.txtDetail,
//                         txtOldPrice: fields.txtOldPrice,
//                         txtSalePrice: fields.txtSalePrice,
//                         txtStatus: fields.txtStatus,
//                         txtCategory: fields.txtCategory,
//                         txtQty: fields.txtQty
//                     });
//             }
//             for (var i in listImage) {
//                 cloudinary.uploader.upload(listImage[i].path, function(err, result) {
//                     arr.push(result.url);
//                 }).then(() => {
//                     if (arr.length === listImage.length) {
//                         if (imageType.indexOf(coverImage.type) >= 0) {
//                             cloudinary.uploader.upload(coverImage.path, function(err, result) {
//                                 fields.txtImagePath = result.url;
//                                 fields.txtImagePath_more = arr;
//                                 bookModel.post(fields).then(() => {
//                                     const category = bookModel.listCategory();
//                                     // Pass data to view to display list of books
//                                     res.render('./products/addbook', { category, title: 'Thêm sản phẩm', fade: "fade" });
//                                 });
//                             });
//                         } else {
//                             return res.render('products/addbook', {
//                                 title: "Thêm sách",
//                                 messageImage: "Phải là file ảnh!",
//                                 fade: "fade",
//                                 txtTitle: fields.txtTitle,
//                                 txtImagePath: fields.txtImagePath,
//                                 txtImagePath_more: fields.txtImagePath_more,
//                                 txtDescription: fields.txtDescription,
//                                 txtDetail: fields.txtDetail,
//                                 txtOldPrice: fields.txtOldPrice,
//                                 txtSalePrice: fields.txtSalePrice,
//                                 txtStatus: fields.txtStatus,
//                                 txtCategory: fields.txtCategory,
//                                 txtQty: fields.txtQty
//                             });
//                         }
//                     }
//                 });
//             }
//         } else {
//             if (listImage && listImage.size > 0) {
//                 if (imageType.indexOf(listImage.type) >= 0) {
//                     cloudinary.uploader.upload(listImage.path, function(err, result) {
//                         fields.txtImagePath_more = result.url;
//                     }).then(() => {
//                         if (imageType.indexOf(coverImage.type) >= 0) {
//                             cloudinary.uploader.upload(coverImage.path, function(err, result) {
//                                 fields.txtImagePath = result.url;

//                                 bookModel.post(fields).then(() => {
//                                     const category = bookModel.listCategory();
//                                     // Pass data to view to display list of books
//                                     res.render('./products/addbook', { category, title: 'Thêm sản phẩm', fade: "fade" });
//                                 });
//                             });
//                         } else {
//                             return res.render('products/addbook', {
//                                 title: "Thêm sách",
//                                 messageImage: "Phải là file ảnh!",
//                                 fade: "fade",
//                                 txtTitle: fields.txtTitle,
//                                 txtImagePath: fields.txtImagePath,
//                                 txtImagePath_more: fields.txtImagePath_more,
//                                 txtDescription: fields.txtDescription,
//                                 txtDetail: fields.txtDetail,
//                                 txtOldPrice: fields.txtOldPrice,
//                                 txtSalePrice: fields.txtSalePrice,
//                                 txtStatus: fields.txtStatus,
//                                 txtCategory: fields.txtCategory,
//                                 txtQty: fields.txtQty
//                             });
//                         }
//                     });
//                 } else {
//                     return res.render('products/addbook', {
//                         title: "Thêm sách",
//                         messageImage: "Phải là file ảnh!",
//                         fade: "fade",
//                         txtTitle: fields.txtTitle,
//                         txtImagePath: fields.txtImagePath,
//                         txtImagePath_more: fields.txtImagePath_more,
//                         txtDescription: fields.txtDescription,
//                         txtDetail: fields.txtDetail,
//                         txtOldPrice: fields.txtOldPrice,
//                         txtSalePrice: fields.txtSalePrice,
//                         txtStatus: fields.txtStatus,
//                         txtCategory: fields.txtCategory,
//                         txtQty: fields.txtQty
//                     });
//                 }
//             } else {
//                 if (imageType.indexOf(coverImage.type) >= 0) {
//                     cloudinary.uploader.upload(coverImage.path, function(err, result) {
//                         fields.txtImagePath = result.url;
//                         bookModel.post(fields).then(() => {
//                             const category = bookModel.listCategory();
//                             // Pass data to view to display list of books
//                             res.render('./products/addbook', { category, title: 'Thêm sản phẩm', fade: "fade" });
//                         });
//                     });
//                 } else {
//                     return res.render('products/addbook', {
//                         title: "Thêm sách",
//                         messageImage: "Phải là file ảnh!",
//                         fade: "fade",
//                         txtTitle: fields.txtTitle,
//                         txtImagePath: fields.txtImagePath,
//                         txtImagePath_more: fields.txtImagePath_more,
//                         txtDescription: fields.txtDescription,
//                         txtDetail: fields.txtDetail,
//                         txtOldPrice: fields.txtOldPrice,
//                         txtSalePrice: fields.txtSalePrice,
//                         txtStatus: fields.txtStatus,
//                         txtCategory: fields.txtCategory,
//                         txtQty: fields.txtQty
//                     });
//                 }
//             }
//         }
//     });
// };

// exports.update = async(req, res, next) => {
//     const form = formidable({ multiples: true });
//     const book = await bookModel.get(req.params.id);
//     form.parse(req, async(err, fields, files) => {
//         if (err) {
//             next(err);
//             return;
//         }
//         const title = await bookModel.checkTitle_2(showUnsignedString(fields.txtTitle).toLowerCase(), req.params.id);
//         //const title = 1;
//         if (!title) {
//             return res.render('products/updatebook', {
//                 title: "Cập nhật sách",
//                 messageTitle: "Tên sách đã tồn tại, vui lòng vào update!",
//                 fade: "fade",
//                 book: book
//             });
//         }
//         const imageType = ["image/png", "image/jpeg"];
//         const coverImage = files.txtImagePath;
//         const listImage = files.txtImagePath_more;
//         const arr = [];
//         if (listImage && listImage.length > 0) {
//             for (var i in listImage) {
//                 if (imageType.indexOf(listImage[i].type) === -1)
//                     return res.render('products/updatebook', {
//                         title: "Cập nhật sách",
//                         messageImage: "Phải là file ảnh!",
//                         fade: "fade",
//                         book: book
//                     });
//             }
//             for (var i in listImage) {
//                 cloudinary.uploader.upload(listImage[i].path, function(err, result) {
//                     arr.push(result.url);
//                 }).then(() => {
//                     if (arr.length === listImage.length) {
//                         fields.txtImagePath_more = arr;
//                         if (coverImage && coverImage.size > 0) {
//                             if (imageType.indexOf(coverImage.type) >= 0) {
//                                 cloudinary.uploader.upload(coverImage.path, function(err, result) {
//                                     fields.txtImagePath = result.url;
//                                     bookModel.update_1_1(fields, req.params.id).then(() => {
//                                         return res.redirect('../../products');
//                                     });
//                                 });
//                             } else {
//                                 return res.render('products/updatebook', {
//                                     title: "Cập nhật sách",
//                                     messageImage: "Phải là file ảnh!",
//                                     fade: "fade",
//                                     book: book
//                                 });
//                             }
//                         } else {
//                             bookModel.update_1_0(fields, req.params.id).then(() => {
//                                 return res.redirect('../../products');
//                             });
//                         }
//                     }
//                 });
//             }
//         } else {
//             if (listImage && listImage.size > 0) {
//                 if (imageType.indexOf(listImage.type) >= 0) {
//                     cloudinary.uploader.upload(listImage.path, function(err, result) {
//                         fields.txtImagePath_more = result.url;
//                     }).then(() => {
//                         if (coverImage && coverImage.size > 0) {
//                             if (imageType.indexOf(coverImage.type) >= 0) {
//                                 cloudinary.uploader.upload(coverImage.path, function(err, result) {
//                                     fields.txtImagePath = result.url;
//                                     bookModel.update_1_1(fields, req.params.id).then(() => {
//                                         return res.redirect('../../products');
//                                     });
//                                 });
//                             } else {
//                                 return res.render('products/updatebook', {
//                                     title: "Cập nhật sách",
//                                     messageImage: "Phải là file ảnh!",
//                                     fade: "fade",
//                                     book: book
//                                 });
//                             }
//                         } else {
//                             bookModel.update_1_0(fields, req.params.id).then(() => {
//                                 return res.redirect('../../products');
//                             });
//                         }

//                     });
//                 } else {
//                     return res.render('products/updatebook', {
//                         title: "Cập nhật sách",
//                         messageImage: "Phải là file ảnh!",
//                         fade: "fade",
//                         book: book
//                     });
//                 }


//             } else {
//                 if (coverImage && coverImage.size > 0) {
//                     if (imageType.indexOf(coverImage.type) >= 0) {
//                         cloudinary.uploader.upload(coverImage.path, function(err, result) {
//                             fields.txtImagePath = result.url;
//                             bookModel.update_0_1(fields, req.params.id).then(() => {
//                                 return res.redirect('../../products');
//                             });
//                         });
//                     } else {
//                         return res.render('products/updatebook', {
//                             title: "Cập nhật sách",
//                             messageImage: "Phải là file ảnh!",
//                             fade: "fade",
//                             book: book
//                         });
//                     }
//                 } else {
//                     bookModel.update_0_0(fields, req.params.id).then(() => {
//                         return res.redirect('../../products');
//                     });
//                 }
//             }
//         }
//         // Get books from model
//     });
// };

// exports.delete = async(req, res, next) => {
//     // Get books from model
//     await bookModel.delete(req.params.id);
//     // Pass data to view to display list of books
//     res.redirect('../../products');
// };