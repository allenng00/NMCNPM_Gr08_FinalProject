const { ObjectId} = require('mongodb');
const postsCollection = require('./MongooseModel/postMongooseModel');
const categoryCollection = require ('./MongooseModel/categoryMongooseModel');

exports.listcategory = async () => {
    //console.log('model db');
    //const postsCollection = db().collection('Books');
    const cat = await categoryCollection.find({});
    return cat;
}

exports.getlistcatID = async (listcategory) =>{
    var res = [];
    await listcategory.forEach(element => {
        res.push(element._id);
        console.log(element._id.toString());
        console.log(res);
    });
    return res;
}
exports.get_name_cat = async (id) => {
    const nameCat = await categoryCollection.findOne({_id: ObjectId(id)});
    return nameCat.catogory;
}

exports.list = async () => {
    console.log('model db');
    //const postsCollection = db().collection('Books');
    const posts = await postsCollection.find({isDeleted: false});
    //console.dir(posts);
    return posts;
}
exports.listpost = async (filter, pageNumber, itemPerPage) => {
    //const postsCollection = db().collection('Books');
    let posts = await postsCollection.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return posts;
}

exports.get = async (id) => {
    //const postsCollection = db().collection('Books');
    const post = await postsCollection.findOne({_id: ObjectId(id)})
    return post;
}

exports.getRelatedBooks = async (catID, postID) => {
    //const postsCollection = db().collection('Books');
    const listRelatedBooks = await postsCollection.find({catID: ObjectId(catID), _id: {$ne:  ObjectId(postID)}});
    if (listRelatedBooks.length>=1)
    {
        return listRelatedBooks;
    }
        
    else    
        return false;
}


// exports.list = () => posts;

// exports.get = (id) => posts.find(b=>b.id ===id);