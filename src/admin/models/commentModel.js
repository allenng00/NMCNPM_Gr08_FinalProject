const { ObjectId } = require('mongodb');

const booksCollection = require('./MongooseModel/bookMongooseModel');



exports.add_comment = async(id, nickname, comment) => {
    const cmt = { nickname: nickname, comment: comment, imagePath: "" };
    const book = await booksCollection.findOne({ _id: ObjectId(id) });
    const comments = book.comments ? book.comments : [];
    comments.push(cmt);
    await booksCollection.updateOne({ _id: ObjectId(id) }, {
        comments: comments
    })
}