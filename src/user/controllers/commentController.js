const { ObjectId } = require('mongodb');

const commentModel = require('../models/commentModel');
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
exports.add_comment = async(req, res, next) => {
    const bookID = req.params.id;
    const nickname = req.body.nickname ? req.body.nickname: req.user.username;
    const content = req.body.content;
    
    if (await userModel.getNameUser(nickname))
    {
        const category =  await bookModel.listcategory();
        const bookID = req.params.id;
        const book = await bookModel.get(bookID);
        const bookCat = await bookModel.get_name_cat(book.catID);
        const relatedBook = await bookModel.getRelatedBooks(book.catID, bookID);
        const comment = book.comment ? book.comment:[];
        return res.render('./books/detail', 
        {   
            title: "Chi tiết",
            category,
            book,
            bookCat,
            relatedBook,
            countRelatedBooks: relatedBook.length,
            comment,
            show_active_2: "show active",
            err: "Nickname đã được sử dụng, vui lòng dùng tên khác",
            content
        });

    }
        
     // lấy cuốn sách từ id và thêm vào comment
    const book = await bookModel.get(bookID);
    const comment = book.comment ? book.comment : [];
    const cmt = {nickname: nickname, content: content, avatar: ""};
    comment.push(cmt);
    bookModel.add_comment(bookID, comment);

    res.redirect('../' + bookID);
};