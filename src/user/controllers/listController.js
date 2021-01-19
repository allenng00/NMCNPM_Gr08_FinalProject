const { render } = require('../app');
const { ObjectId } = require('mongodb');
const queryString = require('query-string');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');
const item_per_page = 5;

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
exports.index = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    const sort = parseInt(req.query.sort) || 0;
    const nameSortArr = ["Từ A->Z", "Từ Z->A"];

    var nameCat;
    var catid = req.query.catid;


    if (catid) {
        var catID = ObjectId(catid);
        var tmp_nameCat = await postModel.get_name_cat(catid);
    }
    if (tmp_nameCat)
        nameCat = tmp_nameCat;

    var filter = { isDeleted: false, status2: "Đã duyệt" };

    console.log(nameCat);

    if (catid) {
        if (nameCat != "Tất cả") {
            if (search) {
                const searchval = new RegExp(search, 'i');
                const searchval1 = new RegExp(showUnsignedString(search), 'i');
                filter = {
                    $or: [
                        { title: searchval },
                        { detail: searchval },
                        { description: searchval },
                        { titleUnsigned: searchval1 }
                    ],
                    categoryID: ObjectId(catid),
                    isDeleted: false,
                    status2: "Đã duyệt"
                };
            } else
                filter = { categoryID: ObjectId(catid), isDeleted: false, status2: "Đã duyệt" };
        } else {
            if (search) {
                const searchval = new RegExp(search, 'i');
                const searchval1 = new RegExp(showUnsignedString(search), 'i');
                filter = {
                    $or: [
                        { title: searchval },
                        { detail: searchval },
                        { description: searchval },
                        { titleUnsigned: searchval1 }
                    ],
                    isDeleted: false,
                    status2: "Đã duyệt"
                };
            }

        }
    } else {
        if (search) {
            const searchval = new RegExp(search, 'i');
            const searchval1 = new RegExp(showUnsignedString(search), 'i');
            filter = {
                $or: [
                    { title: searchval },
                    { detail: searchval },
                    { description: searchval },
                    { titleUnsigned: searchval1 }
                ],
                isDeleted: false,
                status2: "Đã duyệt"
            };
        }
    }

    let hasCat = false;
    if (nameCat != "Tất cả")
    {
        hasCat = true;
    }
    const paginate = await postModel.listpost(filter, page, item_per_page, sort);
    const category = await postModel.listcategory();
    const prevPageQueryString = {...req.query, page: paginate.prevPage };
    const nextPageQueryString = {...req.query, page: paginate.nextPage };

    res.render('./posts/listpost', {
        title: "Danh mục bài viết",
        posts: paginate.docs,
        totalPosts: paginate.totalDocs,
        category,
        search,
        nameCat,
        hasCat,
        nameSort: nameSortArr[sort],
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
    });
};


exports.detail = async(req, res, next) => {
    const category = await postModel.listcategory();
    const postID = req.params.id;
    const post = await postModel.get(postID);

    if (post)
    {
    const postCatRelated = await postModel.get_related(post.categoryID, postID);  
    const search = req.query.search;
    if (search)
    {
        res.redirect('/listpost?search='+search);
    }
      // tính toán phân trang bình luận
      const perpage = 4;
      const current = parseInt(req.query.page) || 1;
      const comment = await postModel.listcomment(postID, current, perpage);
      const count_comment = post.comments.length || 0;    
      const pages = Math.ceil(count_comment/perpage); 
      const nextPage = current < pages ? (current+1): current;
      const prevPage = current > 1 ? (current-1): 1;
      const hasNextPage = current < pages;  
      const hasPreviousPage = current > 1;
  
      // tìm avatar của người bình luận nếu có
      var avatar;
      for (id in comment)
      {
          avatar = await userModel.getProfilePicUser(comment[id].nickname);
          if (avatar)
              comment[id].imagePath = avatar;
      }
  
      res.render('posts/detail', 
      {   
          title: "Chi tiết",
          category,
          post,
          postID,
          postCatRelated,
          comment,
          current,
          nextPage,
          prevPage,
          totalComments: count_comment,
          pages,
          hasNextPage,
          hasPreviousPage,
          lastPage: pages,
          show_active_2: "show active"
      });
    }
    else
        res.render('error');
    
  };
  
exports.detail_mypost = async(req, res, next) => {
    const category = await postModel.listcategory();
    console.log("hello");
    const postID = req.params.id;
    const post = await postModel.get(postID);
    const postCat = await postModel.get_name_cat(post.categoryID);

    res.render('./posts/detailMypost', {
        title: "Chi tiết",
        category,
        post,
        postCat,
        show_active_1: "show active"
    });

};

exports.mypost = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const status = parseInt(req.query.status) || 0;
    const nameStatus = ["Tất cả", "Đợi duyệt", "Đã duyệt"];
    const filter = {};
    filter.isDeleted = false;
    filter.author = req.user.username;
    if (status) {
        filter.status2 = nameStatus[status];
    }

    const paginate = await postModel.listpost(filter, page, item_per_page, 0);
    const prevPageQueryString = {...req.query, page: paginate.prevPage };
    const nextPageQueryString = {...req.query, page: paginate.nextPage };

    res.render('posts/mypost', {
        title: 'Bài viết của tôi',
        nameStatus: nameStatus[status],
        posts: paginate.docs,
        totalPosts: paginate.totalDocs,
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        nextPageQueryString: queryString.stringify(nextPageQueryString),
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        prevPageQueryString: queryString.stringify(prevPageQueryString),
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: item_per_page,
        currentPage: paginate.page,
    });
};

exports.addpost_page = async(req, res, next) => {

    const category =  await postModel.listcategory_1();
    res.render('posts/addpost', { title: 'Đóng góp bài viết', category });
};

exports.addpost = async(req, res, next) => {
    
    const form = formidable({ multiples: true });
    const category =  await postModel.listcategory_1();
    var arr = [];
    form.parse(req, async(err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        const { txtTitle, nameCategory, description, detail, optionCat} = fields;
       
        //const category = await postModel.get_name_category(nameCategory);
        // if (category) {
        //     // do nothing
        // } else {
        //     return res.render('posts/addpost', {
        //         title: 'Đóng góp bài viết',
        //         messageError: "Thể loại không tồn tại",
        //         txtTitle,
        //         nameCategory,
        //         description,
        //         detail
        //     });
        // }

        // kiểm tra ảnh
        const coverImage = files.cover;
       
        const imageType = ["image/png", "image/jpeg"];

        if (imageType.indexOf(coverImage.type) >= 0) // cover là 1 ảnh
        {
            console.log("hello");
            cloudinary.uploader.upload(coverImage.path, function(err, result) {
                fields.cover = result.url;
                postModel.add_post(fields, req.user.username).then(() => {
                    return res.render('posts/addpost', { title: 'Đóng góp bài viết', messageSuccess: "Đóng góp bài viết thành công, bài viết được xem xét bởi admin", category });
                });
            });
        }
        else // ko phải ảnh
        {
            return res.render('posts/addpost', {
                title: "Đóng góp bài viết",
                messageError: "Chỉ được chọn ảnh",
                txtTitle,
                description,
                detail,
                nameCategory
            });
        }

    });

};