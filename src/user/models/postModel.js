const { ObjectId } = require('mongodb');
const postsCollection = require('./MongooseModel/postMongooseModel');
const categoryCollection = require('./MongooseModel/categoryMongooseModel');

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
// lấy ra danh sách thể loại bài viết
exports.listcategory = async() => {
    const cat = await categoryCollection.find();
    return cat;
}

//
exports.getlistcatID = async(listcategory) => {
    var res = [];
    await listcategory.forEach(element => {
        res.push(element._id);
        console.log(element._id.toString());
        console.log(res);
    });
    return res;
}

exports.listComment = async(id, page, perPage) => {
    const arr_comment = await postsCollection.findOne({ _id: ObjectId(id) }).select("comments");
    const comments = arr_comment.comments.slice(perPage * (page - 1), perPage * page);
    return comments;
}

// lấy tên của 1 thể loại thông qua id
exports.get_name_cat = async(id) => {
    const nameCat = await categoryCollection.findOne({ _id: ObjectId(id) });
    return nameCat.nameCategory;
}

// lấy tên của 1 thể loại thông qua name
exports.get_name_category = async(category) => {
    const nameCat = await categoryCollection.findOne({ nameCategory: category });
    return nameCat;
}

// lấy danh sách các bài viết
exports.list = async() => {
    console.log('model db');
    const posts = await postsCollection.find({ isDeleted: false });
    return posts;
}

// lấy danh sách các bài viết
exports.listWithStatus = async(status) => {
    const posts = await postsCollection.find({ isDeleted: false, status: status });
    return posts;
}

// danh sách các bài viết sau khi filter, paging
exports.listpost = async(filter, pageNumber, itemPerPage, sort) => {
    const sortOrderArr = [1, -1];
    let posts = await postsCollection.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
        sort: { titleUnsigned: sortOrderArr[sort] }
    });
    return posts;
}

// danh sách bài viết của 1 tài khoản
// exports.list_mypost = async (filter, pageNumber, itemPerPage, username) => {
//     const mypost = await postsCollection.find({author: username});
//     return mypost;
// }


// lấy 1 bài viết qua id
exports.get = async(id) => {
    //const postsCollection = db().collection('posts');
    const post = await postsCollection.findOne({ _id: ObjectId(id) })
    if (post)
        return post;
    return false;
}

exports.get_related = async(id, postID) => {
    //const postsCollection = db().collection('posts');
    const post = await postsCollection.find({ categoryID: ObjectId(id), _id: {$ne:  ObjectId(postID)} })
    return post;
}

// 
exports.getRelatedPosts = async(catID, postID) => {
    //const postsCollection = db().collection('posts');
    const listRelatedPosts = await postsCollection.find({ catID: ObjectId(catID), _id: { $ne: ObjectId(postID) } });
    if (listRelatedPosts.length >= 1) {
        return listRelatedPosts;
    } else
        return false;
}


// thêm 1 comment vào bài viết id 
exports.add_comment = async(id, cmt) => {

    await postsCollection.updateOne({ _id: ObjectId(id) }, { comments: cmt })
}

// đóng góp bài viết
exports.add_post = async(req, username) => {

    const { txtTitle, nameCategory, description, detail, cover, listImages } = req;
    const cat = await categoryCollection.findOne({ nameCategory: nameCategory });
    const catID = cat._id;
    await postsCollection.create({
        cover: cover,
        title: txtTitle,
        listImages: listImages,
        descriptions: description,
        detail: detail,
        isDeleted: false,
        nameCategory: nameCategory,
        categoryID: ObjectId(catID),
        titleUnsigned: showUnsignedString(txtTitle),
        author: username,
        status2: "Đợi duyệt",
        ownBy: "user"
    });
}

exports.listcomment = async (postID, page, perPage) => {

    const arr_comment = await postsCollection.findOne({ _id: ObjectId(postID) }).select("comments");
    const comment = arr_comment.comments.slice(perPage * (page-1), perPage*page);
    return comment;
}
