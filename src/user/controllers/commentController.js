const { ObjectId } = require('mongodb');

const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
exports.add_comment = async(req, res, next) => {
    const postID = req.params.id;
    const nickname = req.body.nickname ? req.body.nickname: req.user.username;
    const content = req.body.content;
    const post = await postModel.get(postID);
    const comment = post.comments ? post.comments:[];
    
    if ((await userModel.getNameUser(nickname) && !req.user) || nickname === "admin")
    {
        const category =  await postModel.listcategory();
        const postCat = await postModel.get_name_cat(post.categoryID);
        const perpage = 5;
        const current = parseInt(req.query.page) || 1;
        const comment = await postModel.listcomment(postID, current, perpage);
        const count_comment = post.comments.length || 0;    
        const pages = Math.ceil(count_comment/perpage); 
        const nextPage = current < pages ? (current+1): current;
        const prevPage = current > 1 ? (current-1): 1;
        const hasNextPage = current < pages;  
        const hasPreviousPage = current > 1;
        var avatar;
        for (id in comment)
        {
            avatar = await userModel.getProfilePicUser(comment[id].nickname);
            if (avatar)
                comment[id].imagePath = avatar;
        }

        return res.render('./posts/detail', 
        {   
            title: "Chi tiết",
            category,
            post,
            postCat,
            comment,
            nickname,
            show_active_2: "show active",
            err: "Nickname đã được sử dụng, vui lòng dùng tên khác",
            content,
            current,
            nextPage,
            prevPage,
            totalComments: count_comment,
            pages,
            hasNextPage,
            hasPreviousPage,
            lastPage: pages,
        });

    }
        
     // lấy bài viết từ id và thêm vào comment
    const cmt = {nickname: nickname, comment: content, imagePath: ""};
    comment.push(cmt);
    postModel.add_comment(postID, comment);

    res.redirect('../' + postID);
};