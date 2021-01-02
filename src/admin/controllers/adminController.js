const formidable = require('formidable');
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


const adminCollection = require('../models/MongooseModel/adminMongooseModel');
const adminModel = require('../models/adminModel');

cloudinary.config({
    cloud_name: 'ptudw',
    api_key: '565745748995287',
    api_secret: '4uJ07atrvww7jJ0-BBVUodS1Q98'
});


exports.renderLogin = (req, res, next) => {
    const message = req.flash('error');

    res.render('./admin/login', {
        title: 'Đăng nhập',
        fade: "fade",
        message: message,
        hasError: message.length > 0
    });
};

exports.renderProfile = async(req, res, next) => {
    res.render('./admin/profile', { title: 'Thông tin cá nhân' });
};



exports.saveProfile = async(req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const coverImage = files.imagePath;
        if (coverImage && coverImage.size > 0) {
            cloudinary.uploader.upload(coverImage.path, function(err, result) {
                fields.imagePath = result.url;

                adminModel.saveProfile(fields, req.params.id).then(() => {
                    res.redirect('./profile/' + req.params.id);
                });
            });
        } else {
            res.redirect('./profile/' + req.params.id);
        }
    });
}