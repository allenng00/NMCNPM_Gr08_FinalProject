const { render } = require('../app');
const { ObjectId } = require('mongodb');
const queryString = require('query-string');
const buildUrl = require('build-url');

const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');
const { Query } = require('mongoose');
const item_per_page = 2;

function showUnsignedString(search) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var input = search;
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function(m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}
exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    var nameCat =  "Thể loại";
    var catid = req.query.catid;


    if (catid)
    {
        var catID =  ObjectId(catid);
        var tmp_nameCat = await postModel.get_name_cat(catid);
    }
    if (tmp_nameCat)
       nameCat = tmp_nameCat;

    const filter = {};

    if (catid)
    {
        if (nameCat != "Tất cả")
            filter.catID = ObjectId(catid);
    }
    if (search)
    {
        filter.unsigned_title= new RegExp(showUnsignedString(search), 'i');
    }

    filter.isDeleted =  false;
    
    const paginate = await postModel.listpost(filter,page,item_per_page);
    const category =  await postModel.listcategory();
    //const listcatID = await postModel.getlistcatID(category);

    // const querystring = buildUrl('', {
    //     path: 'listpost',
    //     queryParams: {
    //       catID: 'id',
    //       id: listcatID
    //     }
    //   });
    const prevPageQueryString = {...req.query, page:paginate.prevPage};
    const nextPageQueryString = {...req.query, page:paginate.nextPage};
    // const catQueryString = { }
    
    res.render('./posts/listpost', {
        title: "Sách",
        posts: paginate.docs,
        totalPosts: paginate.totalDocs,
        category,
        nameCat,
        catID,
        nameSearch: search,
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        nextPageQueryString: queryString.stringify(nextPageQueryString),
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        prevPageQueryString: queryString.stringify(prevPageQueryString),
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: item_per_page,
        currentPage: paginate.page,
        //querystring: querystring
    })};


exports.detail = async (req, res, next) => {
    const category =  await postModel.listcategory();
    const postID = req.params.id;
    const post = await postModel.get(postID);
    const postCat = await postModel.get_name_cat(post.catID);
    const relatedPost = await postModel.getRelatedPosts(post.catID, postID);
    const comment = post.comment ? post.comment:[];
    var avatar;
    for (id in comment)
    {
        avatar = await userModel.getProfilePicUser(comment[id].nickname);
        if (avatar)
            comment[id].avatar = avatar;
    }
    
    res.render('./posts/detail', 
    {   
        title: "Chi tiết",
        category,
        post,
        postCat,
        relatedPost,
        countRelatedPosts: relatedPost.length,
        comment,
        show_active_1: "show active"
    });
  
};


exports.mypost = async(req, res, next) => {
 
    const mypost = await postModel.list_mypost(req.user.username);
    res.render('users/mypost',{title: 'Bài viết của tôi', mypost}); 
};

exports.addpost_page = async(req, res, next) => {
 
    res.render('posts/addpost',{title: 'Đóng góp bài viết'}); 
};

exports.addpost = async(req, res, next) => {
 
    const {title, nameCategory, description, detail, cover } = req.body;
    const category = await postModel.get_name_category(nameCategory);
    if (category)
    {
        
        await postModel.add_post(req, catID);
        res.render('posts/addpost',{title: 'Đóng góp bài viết', messageSuccess: "Đóng góp bài viết thành công"}); 
    }
    else
    {
        
        res.render('posts/addpost',{
            title: 'Đóng góp bài viết', 
            messageError: "Thể loại không tồn tại",
            title,
            nameCategory,
            description,
            detail,
            cover
        }); 
    }
    
};