const userModel = require('../models/userModel');

exports.renderLogin = (req, res, next) => {
    const message = req.flash('error');

    res.render('./login/login', {
        title: 'Đăng nhập',
        fade: "fade",
        message: message,
        hasError: message.length > 0
    });
};