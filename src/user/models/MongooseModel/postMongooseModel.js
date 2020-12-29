const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = mongoose;

const book = new Schema(
{
    title: String,
    unsigned_title: String,
    cover: String,
    oldPrice: String,
    basePrice: String,
    detail: String,
    descript: String,
    author: String,
    status: String,
    catogory: String,
    catID: ObjectId,
    isDeleted: Boolean
},
  {collection: 'Books'}
  );

  book.plugin(mongoosePaginate);

  module.exports = mongoose.model('Books', book);