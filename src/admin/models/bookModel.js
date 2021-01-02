const formidable = require('formidable');
const { ObjectId } = require('mongodb');

const booksCollection = require('./MongooseModel/bookMongooseModel');
const categoryCollection = require('./MongooseModel/categoryMongooseModel');

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

exports.list = async() => {
    const books = await booksCollection.find({}).toArray();
    return books;
}

exports.listBook = async(filter, pageNumber, itemPerPage) => {
    let books = await booksCollection.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return books;
}

exports.get = async(id) => {
    const book = await booksCollection.findOne({ _id: ObjectId(id) })
    return book;
}

exports.listCategory = async() => {
    const category = await categoryCollection.find({});
    return category;
}

exports.post = async(req) => {
    const txtTitle = req.txtTitle;
    const txtImagePath = req.txtImagePath;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtOldPrice = req.txtOldPrice;
    const txtSalePrice = req.txtSalePrice;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;

    const category1 = await categoryCollection.findOne({ nameCategory: txtTheLoai });

    if (!category1) {
        await categoryCollection.create({
            nameCategory: txtTheLoai
        });
    }

    const category2 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);

    await booksCollection.create({
        cover: txtImagePath,
        title: txtTitle,
        decription: txtDescription,
        detail: txtDetail,
        oldPrice: txtOldPrice,
        salePrice: txtSalePrice,
        isDeleted: false,
        nameCategory: txtTheLoai,
        categoryID: id_category,
        titleUnsigned: showUnsignedString(txtTitle),
        status: txtStatus
    });
}

exports.update = async(req, id) => {
    const txtTitle = req.txtTitle;
    const txtImagePath = req.txtImagePath;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtOldPrice = req.txtOldPrice;
    const txtSalePrice = req.txtSalePrice;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;

    if (!txtImagePath) {
        const book = await booksCollection.findOne({ _id: ObjectId(id) });
        txtImagePath = book.cover;
    }

    const category1 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoryCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);
    await booksCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            cover: txtImagePath,
            title: txtTitle,
            decription: txtDescription,
            detail: txtDetail,
            oldPrice: txtOldPrice,
            salePrice: txtSalePrice,
            nameCategory: txtTheLoai,
            categoryID: id_category,
            titleUnsigned: showUnsignedString(txtTitle),
            status: txtStatus
        }
    })
}

exports.update_no_image = async(req, id) => {
    const txtTitle = req.txtTitle;
    const txtDescription = req.txtDescription;
    const txtDetail = req.txtDetail;
    const txtOldPrice = req.txtOldPrice;
    const txtSalePrice = req.txtSalePrice;
    const txtTheLoai = req.txtCategory;
    const txtStatus = req.txtStatus;

    const category1 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
    if (!category1) {
        await categoryCollection.create({
            nameCategory: txtTheLoai
        });
    }
    const category2 = await categoryCollection.findOne({ nameCategory: txtTheLoai });
    const id_category = ObjectId(category2._id);
    await booksCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            title: txtTitle,
            decription: txtDescription,
            detail: txtDetail,
            oldPrice: txtOldPrice,
            salePrice: txtSalePrice,
            nameCategory: txtTheLoai,
            categoryID: id_category,
            titleUnsigned: showUnsignedString(txtTitle),
            status: txtStatus
        }
    })
}

exports.delete = async(id) => {
    const book = await booksCollection.findOne({ _id: ObjectId(id) });
    await book.updateOne({
        isDeleted: true
    });
}