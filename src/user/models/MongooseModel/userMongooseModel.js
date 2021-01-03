const mongoose = require('mongoose');
const { stringify } = require('query-string');
const {Schema} = mongoose;

const user = new Schema(
{
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    profilePic: String,
    cart: Object, 
    status: String
},
  {collection: 'Users'}
  );

  module.exports = mongoose.model('Users', user);