const { ObjectId} = require('mongodb');
const booksCollection = require('./MongooseModel/bookMongooseModel');
const categoryCollection = require ('./MongooseModel/categoryMongooseModel');

exports.listcategory = async () => {
    //console.log('model db');
    //const booksCollection = db().collection('Books');
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
    //const booksCollection = db().collection('Books');
    const books = await booksCollection.find({isDeleted: false});
    //console.dir(books);
    return books;
}
exports.listbook = async (filter, pageNumber, itemPerPage) => {
    //const booksCollection = db().collection('Books');
    let books = await booksCollection.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return books;
}

exports.get = async (id) => {
    //const booksCollection = db().collection('Books');
    const book = await booksCollection.findOne({_id: ObjectId(id)})
    return book;
}

exports.getRelatedBooks = async (catID, bookID) => {
    //const booksCollection = db().collection('Books');
    const listRelatedBooks = await booksCollection.find({catID: ObjectId(catID), _id: {$ne:  ObjectId(bookID)}});
    if (listRelatedBooks.length>=1)
    {
        return listRelatedBooks;
    }
        
    else    
        return false;
}


// exports.list = () => books;

// exports.get = (id) => books.find(b=>b.id ===id);