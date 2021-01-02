const bookModel = require('../models/bookModel');
const adminModel = require('../models/adminModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');


exports.renderComment = async(req, res, next) => {
    const book = await bookModel.get(req.params.id);
    const comments = book.comments ? book.comments : [];
    for (var i in comments) {
        const admin = await adminModel.getUsername(comments[i].nickname);
        const user = await userModel.getUsername(comments[i].nickname);
        if (user)
            comments[i].imagePath = user.imageProfile;
        if (admin)
            comments[i].imagePath = admin.imageProfile;
    }
    res.render('./products/comments', { title: 'Danh sách bình luận', comments });
};

exports.add_comment = async(req, res, next) => {

    const nickname = req.user.username;
    const comment = req.body.comment;
    const bookID = req.params.id;

    await commentModel.add_comment(bookID, nickname, comment);

    res.redirect('../comments' + bookID);
};