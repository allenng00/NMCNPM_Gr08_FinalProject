const mongoose = require('mongoose');
const { Schema } = mongoose;

const admin = new Schema({
    username: String,
    password: String,
    imageProfile: String
}, { collection: 'Admin' });


module.exports = mongoose.model('Admin', admin);