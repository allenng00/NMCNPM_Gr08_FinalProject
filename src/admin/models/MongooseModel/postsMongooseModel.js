const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;
const { ObjectId } = require('mongodb');

const post = new Schema({
    title: String, // tên
    author: String, // Người đăng
    descriptions: String, // mô tả ngắn
    detail: String, //Chi tiết
    cover: String, // ảnh chính
    listImages: Array, //list ảnh phụ
    isDeleted: Boolean, // xoá thì false, chưa xoá thì true
    nameCategory: String, // tên phân loại
    categoryID: ObjectId, // ID phân loại
    titleUnsigned: String, // tên không dấu
    status: String, // Trang thái để hiện ra home page của user (hot, nhiêu tương tác)
    comments: Array, // Danh sách cmt
    ownBy: String // sở hữu bởi admin or user
}, { collection: 'Posts' });

post.plugin(mongoosePaginate);

module.exports = mongoose.model('Posts', post);