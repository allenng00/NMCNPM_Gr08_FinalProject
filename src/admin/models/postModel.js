const formidable = require('formidable');
const { ObjectId } = require('mongodb');

const postsCollection = require('./MongooseModel/postsMongooseModel');
const categoriesCollection = require('./MongooseModel/categoriesMongooseModel');

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

exports.get = async(id) => {
    const post = await postsCollection.findOne({ _id: ObjectId(id) })
    return post;
}

exports.listPost = async(filter, pageNumber, itemPerPage) => {
    let posts = await postsCollection.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return posts;
}

exports.listCategory = async() => {
    const categories = await categoriesCollection.find({});
    return categories;
}


// exports.list = async() => {
//     const books = await booksCollection.find({}).toArray();
//     return books;
// }

// exports.listBookTop10 = async(filter) => {
//     let books = await booksCollection.paginate(filter, {
//         page: 1,
//         limit: 10,
//         sort: { qtySelled: -1 },
//     });
//     return books;
// }

// exports.checkTitle = async(title) => {
//     const books = await booksCollection.find({});
//     for (var i in books) {
//         const titleUnsigned = books[i].titleUnsigned.toLowerCase();
//         books[i].titleUnsigned = titleUnsigned;
//         if (books[i].titleUnsigned === title)
//             return null;
//     }
//     return 1;
// };

// exports.checkTitle_2 = async(title, id) => {
//     const books = await booksCollection.find({ _id: { $ne: ObjectId(id) } });
//     for (var i in books) {
//         const titleUnsigned = books[i].titleUnsigned.toLowerCase();
//         books[i].titleUnsigned = titleUnsigned;
//         if (books[i].titleUnsigned === title)
//             return null;
//     }
//     return 1;
// };

// exports.post = async(req) => {
//     const txtTitle = req.txtTitle;
//     const txtImagePath = req.txtImagePath;
//     const txtDescription = req.txtDescription;
//     const txtDetail = req.txtDetail;
//     const txtOldPrice = parseInt(req.txtOldPrice);
//     const txtSalePrice = parseInt(req.txtSalePrice);
//     const txtTheLoai = req.txtCategory;
//     const txtStatus = req.txtStatus;
//     const listImages = req.txtImagePath_more;
//     const txtQty = req.txtQty;

//     const category1 = await categoryCollection.findOne({ nameCategory: txtTheLoai });

//     if (!category1) {
//         await categoryCollection.create({
//             nameCategory: txtTheLoai
//         });
//     }

//     const category2 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     const id_category = ObjectId(category2._id);

//     await booksCollection.create({
//         cover: txtImagePath,
//         title: txtTitle,
//         listImages: listImages,
//         decription: txtDescription,
//         detail: txtDetail,
//         oldPrice: txtOldPrice,
//         salePrice: txtSalePrice,
//         isDeleted: false,
//         nameCategory: txtTheLoai,
//         categoryID: id_category,
//         titleUnsigned: showUnsignedString(txtTitle),
//         status: txtStatus,
//         qty: txtQty,
//         qtySelled: 0
//     });
// }

// exports.update_1_1 = async(req, id, arr) => {
//     const txtTitle = req.txtTitle;
//     const txtDescription = req.txtDescription;
//     const txtDetail = req.txtDetail;
//     const txtOldPrice = parseInt(req.txtOldPrice);
//     const txtSalePrice = parseInt(req.txtSalePrice);
//     const txtTheLoai = req.txtCategory;
//     const txtStatus = req.txtStatus;
//     const txtQty = req.txtQty;

//     const txtImagePath = req.txtImagePath;
//     const listImages = req.txtImagePath_more;

//     const category1 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     if (!category1) {
//         await categoryCollection.create({
//             nameCategory: txtTheLoai
//         });
//     }
//     const category2 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     const id_category = ObjectId(category2._id);

//     await booksCollection.updateOne({ _id: ObjectId(id) }, {
//         $set: {
//             listImages: listImages,
//             cover: txtImagePath,
//             title: txtTitle,
//             decription: txtDescription,
//             detail: txtDetail,
//             oldPrice: txtOldPrice,
//             salePrice: txtSalePrice,
//             nameCategory: txtTheLoai,
//             categoryID: id_category,
//             titleUnsigned: showUnsignedString(txtTitle),
//             status: txtStatus,
//             qty: txtQty
//         }
//     })
// }

// exports.update_1_0 = async(req, id, arr) => {
//     const txtTitle = req.txtTitle;
//     const txtDescription = req.txtDescription;
//     const txtDetail = req.txtDetail;
//     const txtOldPrice = parseInt(req.txtOldPrice);
//     const txtSalePrice = parseInt(req.txtSalePrice);
//     const txtTheLoai = req.txtCategory;
//     const txtStatus = req.txtStatus;
//     const listImages = req.txtImagePath_more;
//     const txtQty = req.txtQty;

//     const category1 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     if (!category1) {
//         await categoryCollection.create({
//             nameCategory: txtTheLoai
//         });
//     }
//     const category2 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     const id_category = ObjectId(category2._id);

//     await booksCollection.updateOne({ _id: ObjectId(id) }, {
//         $set: {
//             listImages: listImages,
//             title: txtTitle,
//             decription: txtDescription,
//             detail: txtDetail,
//             oldPrice: txtOldPrice,
//             salePrice: txtSalePrice,
//             nameCategory: txtTheLoai,
//             categoryID: id_category,
//             titleUnsigned: showUnsignedString(txtTitle),
//             status: txtStatus,
//             qty: txtQty
//         }
//     })
// }

// exports.update_0_1 = async(req, id) => {
//     const txtTitle = req.txtTitle;
//     const txtDescription = req.txtDescription;
//     const txtDetail = req.txtDetail;
//     const txtOldPrice = parseInt(req.txtOldPrice);
//     const txtSalePrice = parseInt(req.txtSalePrice);
//     const txtTheLoai = req.txtCategory;
//     const txtStatus = req.txtStatus;
//     const txtImagePath = req.txtImagePath;
//     const txtQty = req.txtQty;

//     const category1 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     if (!category1) {
//         await categoryCollection.create({
//             nameCategory: txtTheLoai
//         });
//     }
//     const category2 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     const id_category = ObjectId(category2._id);
//     await booksCollection.updateOne({ _id: ObjectId(id) }, {
//         $set: {
//             title: txtTitle,
//             cover: txtImagePath,
//             decription: txtDescription,
//             detail: txtDetail,
//             oldPrice: txtOldPrice,
//             salePrice: txtSalePrice,
//             nameCategory: txtTheLoai,
//             categoryID: id_category,
//             titleUnsigned: showUnsignedString(txtTitle),
//             status: txtStatus,
//             qty: txtQty
//         }
//     })
// }
// exports.update_0_0 = async(req, id) => {
//     const txtTitle = req.txtTitle;
//     const txtDescription = req.txtDescription;
//     const txtDetail = req.txtDetail;
//     const txtOldPrice = parseInt(req.txtOldPrice);
//     const txtSalePrice = parseInt(req.txtSalePrice);
//     const txtTheLoai = req.txtCategory;
//     const txtStatus = req.txtStatus;
//     const txtQty = req.txtQty;

//     const category1 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     if (!category1) {
//         await categoryCollection.create({
//             nameCategory: txtTheLoai
//         });
//     }
//     const category2 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
//     const id_category = ObjectId(category2._id);
//     await booksCollection.updateOne({ _id: ObjectId(id) }, {
//         $set: {
//             title: txtTitle,
//             decription: txtDescription,
//             detail: txtDetail,
//             oldPrice: txtOldPrice,
//             salePrice: txtSalePrice,
//             nameCategory: txtTheLoai,
//             categoryID: id_category,
//             titleUnsigned: showUnsignedString(txtTitle),
//             status: txtStatus,
//             qty: txtQty
//         }
//     })
// }

// exports.delete = async(id) => {
//     const book = await booksCollection.findOne({ _id: ObjectId(id) });
//     await book.updateOne({
//         isDeleted: true
//     });
// }