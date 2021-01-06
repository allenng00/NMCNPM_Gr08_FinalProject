const mongoose = require('mongoose');
const { Schema } = mongoose;

const category = new Schema({
    nameCategory: String
}, { collection: 'Categories' });

module.exports = mongoose.model('Categories', category);