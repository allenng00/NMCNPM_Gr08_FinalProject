const { ObjectId} = require('mongodb');
const postsCollection = require('./MongooseModel/postMongooseModel');
const categoryCollection = require ('./MongooseModel/categoryMongooseModel');
const postMongooseModel = require('./MongooseModel/postMongooseModel');

// lấy ra danh sách thể loại bài viết
exports.listcategory = async () => {
    //console.log('model db');
    //const postsCollection = db().collection('Posts');
    const cat = await categoryCollection.find({});
    return cat;
}

//
exports.getlistcatID = async (listcategory) =>{
    var res = [];
    await listcategory.forEach(element => {
        res.push(element._id);
        console.log(element._id.toString());
        console.log(res);
    });
    return res;
}

// lấy tên của 1 thể loại thông qua id
exports.get_name_cat = async (id) => {
    const nameCat = await categoryCollection.findOne({_id: ObjectId(id)});
    return nameCat.catogory;
}

// lấy tên của 1 thể loại thông qua name
exports.get_name_category = async (category) => {
    const nameCat = await categoryCollection.findOne({nameCategory: category});
    return nameCat._id;
}

// lấy danh sách các bài viết
exports.list = async () => {
    console.log('model db');
    const posts = await postsCollection.find({isDeleted: false});
    return posts;
}

// danh sách các bài viết sau khi filter, paging
exports.listpost = async (filter, pageNumber, itemPerPage) => {
    //const postsCollection = db().collection('posts');
    let posts = await postsCollection.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return posts;
}

// danh sách bài viết của 1 tài khoản
exports.list_mypost = async (username) => {
    const mypost = await postsCollection.find({ author: username});
    return mypost;
}


// lấy 1 bài viết qua id
exports.get = async (id) => {
    //const postsCollection = db().collection('posts');
    const post = await postsCollection.findOne({_id: ObjectId(id)})
    return post;
}


// 
exports.getRelatedPosts = async (catID, postID) => {
    //const postsCollection = db().collection('posts');
    const listRelatedPosts = await postsCollection.find({catID: ObjectId(catID), _id: {$ne:  ObjectId(postID)}});
    if (listRelatedPosts.length>=1)
    {
        return listRelatedPosts;
    }
        
    else    
        return false;
}


// thêm 1 comment vào bài viết id 
exports.add_comment = async (id, cmt) => {

    await postsCollection.updateOne(   
        {_id: ObjectId(id)},
        {comment: cmt}
    )
}

// đóng góp bài viết
exports.add_post = async (req) => {

    const {title, nameCategory, description, detail, cover, listImages } = req;
    const catID = await categoryCollection.findOne({nameCategory: nameCategory})._id;

    await postsCollection.create({
        cover: cover,
        title: title,
        listImages: listImages,
        descriptions: description,
        detail: detail,
        isDeleted: false,
        nameCategory: nameCategory,
        categoryID: catID,
        titleUnsigned: showUnsignedString(title),
        author: req.user.username,
    });
}