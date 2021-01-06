// const { ObjectId } = require('mongodb');

// const booksCollection = require('./MongooseModel/bookMongooseModel');



// exports.add_comment = async(id, nickname, comment) => {
//     const book = await booksCollection.findOne({ _id: ObjectId(id) });
//     const comments = book.comments ? book.comments : [];
//     const cmt = { nickname: nickname, comment: comment, imagePath: "" };
//     comments.push(cmt);
//     await booksCollection.updateOne({ _id: ObjectId(id) }, {
//         comments: comments
//     })
// }

// exports.delete = async(id, index) => {
//     const book = await booksCollection.findOne({ _id: ObjectId(id) });
//     var comments = book.comments ? book.comments : [];
//     comments.splice(index, 1);
//     if (!comments.length)
//         comments = null;
//     await booksCollection.updateOne({ _id: ObjectId(id) }, {
//         comments: comments
//     })
// }