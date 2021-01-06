const postModel = require('../models/postModel');
const adminModel = require('../models/adminModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');

exports.renderComment = async(req, res, next) => {
    const post = await postModel.get(req.params.id);
    const perPage = 5;
    const page = parseInt(req.query.page) || 1;

    const comments = await commentModel.listComment(req.params.id, page, perPage);
    const count_comment = post.comments.length || 0;
    const pages = Math.ceil(count_comment / perPage);
    const nextPage = page < pages ? (page + 1) : page;
    const prevPage = page > 1 ? (page - 1) : 1;
    const hasNextPage = page < pages;
    const hasPreviousPage = page > 1;
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
    res.render('./posts/comments', {
        title: 'Danh sách bình luận',
        comments: comments,
        postID: post._id,
        hasNextPage,
        nextPage,
        totalComments: count_comment,
        hasPreviousPage,
        prevPage,
        lastPage: pages,
        currentPage: page
    });
};

exports.renderComment2 = async(req, res, next) => {
    const post = await postModel.get(req.params.id);
    const perPage = 5;
    const page = parseInt(req.query.page) || 1;

    const comments = await commentModel.listComment(req.params.id, page, perPage);
    const count_comment = post.comments.length || 0;
    const pages = Math.ceil(count_comment / perPage);
    const nextPage = page < pages ? (page + 1) : page;
    const prevPage = page > 1 ? (page - 1) : 1;
    const hasNextPage = page < pages;
    const hasPreviousPage = page > 1;
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
    res.render('./posts/comments2', {
        title: 'Danh sách bình luận',
        comments: comments,
        postID: post._id,
        hasNextPage,
        nextPage,
        totalComments: count_comment,
        hasPreviousPage,
        prevPage,
        lastPage: pages,
        currentPage: page
    });
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