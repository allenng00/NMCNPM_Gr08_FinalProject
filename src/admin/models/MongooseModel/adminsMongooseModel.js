const mongoose = require('mongoose');
const { Schema } = mongoose;

const admin = new Schema({
    username: String,
    password: String,
    imageProfile: String
}, { collection: 'Admins' });


module.exports = mongoose.model('Admins', admin);