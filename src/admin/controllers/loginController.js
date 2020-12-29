const userModel = require('../models/userModel');

exports.renderLogin = (req, res, next) => {
    res.render('./login/login', { title: 'login' });
};

exports.renderAdmin = async(req, res, next) => {
    const tmp = userModel.check(req, res);
    if (tmp == 1) {
        res.redirect('/home');
    } else {
        res.redirect('/');
    }
};