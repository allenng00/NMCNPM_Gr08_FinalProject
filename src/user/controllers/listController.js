const { render } = require('../app');
const { ObjectId } = require('mongodb');
const queryString = require('query-string');
const buildUrl = require('build-url');

const bookModel = require('../models/bookModel');
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
        var tmp_nameCat = await bookModel.get_name_cat(catid);
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
    
    const paginate = await bookModel.listbook(filter,page,item_per_page);
    const category =  await bookModel.listcategory();
    //const listcatID = await bookModel.getlistcatID(category);

    // const querystring = buildUrl('', {
    //     path: 'listbook',
    //     queryParams: {
    //       catID: 'id',
    //       id: listcatID
    //     }
    //   });
    const prevPageQueryString = {...req.query, page:paginate.prevPage};
    const nextPageQueryString = {...req.query, page:paginate.nextPage};
    // const catQueryString = { }
    
    res.render('./books/listbook', {
        title: "Sách",
        books: paginate.docs,
        totalBooks: paginate.totalDocs,
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
    const category =  await bookModel.listcategory();
    const bookID = req.params.id;
    const book = await bookModel.get(bookID);
    const bookCat = await bookModel.get_name_cat(book.catID);
    const relatedBook = await bookModel.getRelatedBooks(book.catID, bookID);
    const comment = book.comment ? book.comment:[];
    var avatar;
    for (id in comment)
    {
        avatar = await userModel.getProfilePicUser(comment[id].nickname);
        if (avatar)
            comment[id].avatar = avatar;
    }
    
    res.render('./books/detail', 
    {   
        title: "Chi tiết",
        category,
        book,
        bookCat,
        relatedBook,
        countRelatedBooks: relatedBook.length,
        comment,
        show_active_1: "show active"
    });
  
};

// exports.index = (req, res, next) => {
//     // Get books from model
//     const books =  bookModel.list();
//     // Pass data to view to display list of books
//     res.render('list', {books});
// };

// exports.detail = (req,res, next) => {
    
//     res.render('detail', bookModel.get(parseInt(req.params.id))) ;
//};
