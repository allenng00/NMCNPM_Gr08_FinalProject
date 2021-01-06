const { ObjectId } = require('mongodb');

const postsCollection = require('./MongooseModel/postsMongooseModel');

exports.add_comment = async(id, nickname, comment) => {
    const post = await postsCollection.findOne({ _id: ObjectId(id) });
    const comments = post.comments ? post.comments : [];
    const cmt = { nickname: nickname, comment: comment, imagePath: "" };
    comments.push(cmt);
    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        comments: comments
    })
}

exports.delete = async(id, index) => {
    const post = await postsCollection.findOne({ _id: ObjectId(id) });
    var comments = post.comments ? post.comments : [];
    comments.splice(index, 1);
    if (!comments.length)
        comments = null;
    await postsCollection.updateOne({ _id: ObjectId(id) }, {
        comments: comments
    })
}

exports.listComment = async(id, page, perPage) => {
    const arr_comment = await postsCollection.findOne({ _id: ObjectId(id) }).select("comments");
    const comments = arr_comment.comments.slice(perPage * (page - 1), perPage * page);
    return comments;
}