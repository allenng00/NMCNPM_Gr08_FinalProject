const passport = require('passport');
LocalStrategy = require('passport-local').Strategy;

const adminModel = require('../models/adminModel');

passport.use(new LocalStrategy({ passReqToCallback: true },
    async function(req, username, password, done) {
        const user = await adminModel.checkCredential(username, password);

        if (!user)
            return done(null, false, { message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    adminModel.getAdmin(id).then((user, err) => {
        done(err, user);
    })
});

module.exports = passport;