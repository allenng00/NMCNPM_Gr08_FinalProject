const mongoose = require('mongoose');
const { Schema } = mongoose;

const category = new Schema({
    nameCategory: String
}, { collection: 'Category' });

module.exports = mongoose.model('Category', category);