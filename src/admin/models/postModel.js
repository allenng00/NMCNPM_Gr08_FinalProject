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

exports.checkTitle = async(title) => {
    const books = await postsCollection.find({});
    for (var i in books) {
        const titleUnsigned = books[i].titleUnsigned.toLowerCase();
        books[i].titleUnsigned = titleUnsigned;
        if (books[i].titleUnsigned === title)
            return null;
    }
    return 1;
};

exports.checkTitle_2 = async(title, id) => {
    const books = await postsCollection.find({ _id: { $ne: ObjectId(id) } });
    for (var i in books) {
        const titleUnsigned = books[i].titleUnsigned.toLowerCase();
        books[i].titleUnsigned = titleUnsigned;
        if (books[i].titleUnsigned === title)
            return null;
    }
    return 1;
};

exports.post = async(req) => {
    const txtTitle = req.txtTitle;
    const txtImagePath = req.txtImagePath;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const listImages = req.txtImagePath_more;
    const txtAuthor = req.txtAuthor;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });

    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }

    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.create({
        cover: txtImagePath,
        title: txtTitle,
        listImages: listImages,
        descriptions: txtDescription,
        detail: txtDetail,
        isDeleted: false,
        nameCategory: txtTheLoai,
        categoryID: id_category,
        titleUnsigned: showUnsignedString(txtTitle),
        status: txtStatus,
        author: txtAuthor,
        ownBy: "admin",
        status2: "Đã duyệt"
    });
}

exports.update_1_1 = async(req, id, arr) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const txtAuthor = req.txtAuthor;

    const txtImagePath = req.txtImagePath;
    const listImages = req.txtImagePath_more;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        cover: txtImagePath,
        title: txtTitle,
        listImages: listImages,
        descriptions: txtDescription,
        detail: txtDetail,
        nameCategory: txtTheLoai,
        categoryID: id_category,
        titleUnsigned: showUnsignedString(txtTitle),
        status: txtStatus,
        author: txtAuthor,
    })
}

exports.update_1_0 = async(req, id, arr) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const txtAuthor = req.txtAuthor;
    const listImages = req.txtImagePath_more;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            title: txtTitle,
            listImages: listImages,
            descriptions: txtDescription,
            detail: txtDetail,
            nameCategory: txtTheLoai,
            categoryID: id_category,
            titleUnsigned: showUnsignedString(txtTitle),
            status: txtStatus,
            author: txtAuthor,
        }
    })
}

exports.update_0_1 = async(req, id) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const txtAuthor = req.txtAuthor;
    const txtImagePath = req.txtImagePath;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            title: txtTitle,
            cover: txtImagePath,
            descriptions: txtDescription,
            detail: txtDetail,
            nameCategory: txtTheLoai,
            categoryID: id_category,
            titleUnsigned: showUnsignedString(txtTitle),
            status: txtStatus,
            author: txtAuthor,
        }
    })
}

exports.update_0_0 = async(req, id) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const txtAuthor = req.txtAuthor;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            title: txtTitle,
            descriptions: txtDescription,
            detail: txtDetail,
            nameCategory: txtTheLoai,
            categoryID: id_category,
            titleUnsigned: showUnsignedString(txtTitle),
            status: txtStatus,
            author: txtAuthor,
        }
    })
}

exports.update_1_1_2 = async(req, id, arr) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const txtAuthor = req.txtAuthor;

    const txtImagePath = req.txtImagePath;
    const listImages = req.txtImagePath_more;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        cover: txtImagePath,
        title: txtTitle,
        listImages: listImages,
        descriptions: txtDescription,
        detail: txtDetail,
        nameCategory: txtTheLoai,
        categoryID: id_category,
        titleUnsigned: showUnsignedString(txtTitle),
        status: txtStatus,
        author: txtAuthor,
        status2: "Đã duyệt"
    })
}

exports.update_1_0_2 = async(req, id, arr) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const txtAuthor = req.txtAuthor;
    const listImages = req.txtImagePath_more;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            title: txtTitle,
            listImages: listImages,
            descriptions: txtDescription,
            detail: txtDetail,
            nameCategory: txtTheLoai,
            categoryID: id_category,
            titleUnsigned: showUnsignedString(txtTitle),
            status: txtStatus,
            author: txtAuthor,
            status2: "Đã duyệt"
        }
    })
}

exports.update_0_1_2 = async(req, id) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const txtAuthor = req.txtAuthor;
    const txtImagePath = req.txtImagePath;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            title: txtTitle,
            cover: txtImagePath,
            descriptions: txtDescription,
            detail: txtDetail,
            nameCategory: txtTheLoai,
            categoryID: id_category,
            titleUnsigned: showUnsignedString(txtTitle),
            status: txtStatus,
            author: txtAuthor,
            status2: "Đã duyệt"
        }
    })
}

exports.update_0_0_2 = async(req, id) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;
    const txtAuthor = req.txtAuthor;

    const category1 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoriesCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoriesCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            title: txtTitle,
            descriptions: txtDescription,
            detail: txtDetail,
            nameCategory: txtTheLoai,
            categoryID: id_category,
            titleUnsigned: showUnsignedString(txtTitle),
            status: txtStatus,
            author: txtAuthor,
            status2: "Đã duyệt"
        }
    })
}

// exports.delete = async(id) => {
//     const book = await postsCollection.findOne({ _id: ObjectId(id) });
//     await book.updateOne({
//         isDeleted: true
//     });
// }

// exports.list = async() => {
//     const books = await postsCollection.find({}).toArray();
//     return books;
// }

// exports.listBookTop10 = async(filter) => {
//     let books = await postsCollection.paginate(filter, {
//         page: 1,
//         limit: 10,
//         sort: { qtySelled: -1 },
//     });
//     return books;
// }