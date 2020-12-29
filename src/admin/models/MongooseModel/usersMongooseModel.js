const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
    name: String,
    username: String,
    password: String,
    address: String,
    phone: String,
    imageProfile: String
}, { collection: 'Users' });


module.exports = mongoose.model('Users', user);