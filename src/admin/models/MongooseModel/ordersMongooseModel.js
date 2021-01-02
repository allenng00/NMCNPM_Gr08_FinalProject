const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');


const order = new Schema({
    order: Object,
    status: String,
    name: String,
    address: String,
    phone: String,
    email: String,
    user: String
}, { collection: 'Orders' });

order.plugin(mongoosePaginate);

module.exports = mongoose.model('Orders', order)