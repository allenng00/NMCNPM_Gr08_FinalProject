const { ObjectId } = require('mongodb');

const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
exports.add_comment = async(req, res, next) => {
    const postID = req.params.id;
    const nickname = req.body.nickname ? req.body.nickname: req.user.username;
    const content = req.body.content;
    
    if (await userModel.getNameUser(nickname))
    {
        const category =  await postModel.listcategory();
        const postID = req.params.id;
        const post = await postModel.get(postID);
        const postCat = await postModel.get_name_cat(post.catID);
        const relatedPost = await postModel.getRelatedPosts(post.catID, postID);
        const comment = post.comment ? post.comment:[];
        return res.render('./posts/detail', 
        {   
            title: "Chi tiết",
            category,
            post,
            postCat,
            relatedPost,
            countRelatedPosts: relatedPost.length,
            comment,
            show_active_2: "show active",
            err: "Nickname đã được sử dụng, vui lòng dùng tên khác",
            content
        });

    }
        
     // lấy cuốn sách từ id và thêm vào comment
    const post = await postModel.get(postID);
    const comment = post.comment ? post.comment : [];
    const cmt = {nickname: nickname, content: content, avatar: ""};
    comment.push(cmt);
    postModel.add_comment(postID, comment);

    res.redirect('../' + postID);
};