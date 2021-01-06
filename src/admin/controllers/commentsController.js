const postModel = require('../models/postModel');
const adminModel = require('../models/adminModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');

exports.renderComment = async(req, res, next) => {
    const post = await postModel.get(req.params.id);
    const comments = post.comments ? post.comments : [];
    for (var i in comments) {
        const admin = await adminModel.getUsername(comments[i].nickname);
        const user = await userModel.getUsername(comments[i].nickname);
        if (user)
            comments[i].imagePath = user.imageProfile;
        if (admin)
            comments[i].imagePath = admin.imageProfile;
    }
    for (var i in comments)
        comments[i].postID = post._id;
    res.render('./posts/comments', { title: 'Danh sách bình luận', comments: comments });
};

exports.add_comment = async(req, res, next) => {

    const nickname = req.user.username;
    const comment = req.body.comment;
    const postID = req.params.id;

    await commentModel.add_comment(postID, nickname, comment);

    res.redirect('../comments/' + postID);
};

exports.delete = async(req, res, next) => {
    const postID = req.params.id;
    const index = req.params.index;

    await commentModel.delete(postID, index);

    res.redirect('../../' + postID);
};