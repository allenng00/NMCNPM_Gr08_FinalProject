const userModel = require('../models/userModel');
const fs = require('fs');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');

exports.index = (req, res, next) => {
    res.render('users/login',{title: 'Đăng Nhập'});
};

exports.profile = async(req, res, next) => {
 
     res.render('users/profile',{title: 'Profile'}); 
};

exports.update_profile = async(req, res, next) => {
    
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }
        const coverImage = files.txtProfilePic;
        if (coverImage && coverImage.size > 0) {
            // const filename = coverImage.path.split('\\').pop() + '.' + coverImage.name.split('.').pop();
            // fs.renameSync(coverImage.path, process.env.USER_IMAGE_FOLDER + '\\' + filename);
            // fields.txtProfilePic =  '\\images\\users\\' + filename;
            cloudinary.uploader.upload(coverImage.path,function(err, result){
                fields.txtProfilePic = result.url;
                userModel.update_profile(fields,req.params.id).then(()=>{
                    res.redirect('../../');
                    });
            });
        }
        //  // Update books from model
        // console.log(tmp);
        // userModel.update_profile(fields,ID).then(()=>{
        // res.redirect('../../');
        // });
        
      });
};

exports.addUser = async (req, res) => {
    // const username = req.body.username;
    // const email = req.body.email;
    // const password = req.body.password;

    const {username, email, password} = req.body;

    const newUser = {
        username,
        email,
        password
    };

    console.log (newUser);

    try {
        req.checkBody('password','Mật khẩu phải có ít nhất 8 kí tự').isLength({min:8});
        const err = req.validationErrors();
        if (err)
        {
            throw("Mật khẩu phải có ít nhất 8 kí tự");
            return;
        }
            
        const check = await userModel.getNameUser(username);
        if (!check)
        {
            await userModel.addUser(newUser);
            res.redirect('/users/login');
        }
        else 
        {
            throw("Lỗi không thể tạo tài khoản do tên đăng nhập hoặc email đã tồn tại");
            return;
        }
        
    }
    catch (err)
    {
        const message = err;
        res.render('users/register',{title: "Register", message, hasErr: message.length >0, username, email, password });
        return;
    }
};



// exports.logout = async (req, res, next) => {
//     // Get books from model
//     //const books = bookModel.list();
//     // Pass data to view to display list of books
//     await res.render('account');
// };

// exports.register = async (req, res, next) => {
//     // Get books from model
//     //const books = bookModel.list();
//     // Pass data to view to display list of books
//     await res.render('account');
// };