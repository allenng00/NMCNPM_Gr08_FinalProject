const formidable = require('formidable');
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const bcrypt = require('bcrypt');

const adminModel = require('../models/adminModel');

cloudinary.config({
    cloud_name: 'dpzszugjp',
    api_key: '163377278981499',
    api_secret: 'mQ8tpbcRdL84rx8Azz_VtCAJRZ0'
});

function showUnsignedString(search) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var input = search;
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function(m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}

exports.renderLogin = (req, res, next) => {
    const message = req.flash('error');

    res.render('./admins/login', {
        title: 'Đăng nhập',
        fade: "fade",
        message: message,
        hasError: message.length > 0
    });
};

exports.renderProfile = async(req, res, next) => {
    res.render('./admins/profile', { title: 'Thông tin cá nhân' });
};

exports.saveProfile = async(req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const coverImage = files.imagePath;
        const imageType = ["image/png", "image/jpeg"];
        if (coverImage && coverImage.size > 0) {
            if (imageType.indexOf(coverImage.type) >= 0) {
                cloudinary.uploader.upload(coverImage.path, function(err, result) {
                    fields.imagePath = result.url;

                    adminModel.saveProfile(fields, req.params.id).then(() => {
                        res.redirect('./profile/' + req.params.id);
                    });
                });
            } else {
                res.render('./admins/profile', { title: 'Thông tin cá nhân', messageImage: "Phải là file ảnh!" });
            }
        } else {
            res.redirect('./profile/' + req.params.id);
        }
    });
}

exports.renderChangePassword = async(req, res, next) => {
    res.render('./admins/changePassword', { title: 'Đổi mật khẩu' });
};

exports.changePassword = async(req, res, next) => {
    const { passwordOld, password, rePassword } = req.body;
    try {
        let checkPassword = await bcrypt.compare(passwordOld, req.user.password);
        if (checkPassword) {
            req.checkBody('password', 'check').isLength({ min: 8 });
            const err = req.validationErrors();
            if (err) {
                throw ('Mật khẩu phải có ít nhất 8 ký tự!');
            } else {
                if (password === showUnsignedString(password)) {
                    if (!password.includes(" ")) {
                        if (password === rePassword) {
                            await adminModel.changeAdmin(password, req.user._id);
                            req.logOut();
                            res.redirect('/');
                        } else {
                            throw ('Mật khẩu và mật khẩu nhập lại không giống nhau!');
                        }
                    } else {
                        throw ('Mật khẩu không được có khoảng trắng');
                    }
                } else {
                    throw ('Mật khẩu không được có dấu!');
                }
            }
        } else
            throw ('Sai mật khẩu!');
    } catch (err) {
        res.render('admins/changePassword', { title: "Đổi mật khẩu", err: err, hasError: err.length > 0 });
        return;
    }
};