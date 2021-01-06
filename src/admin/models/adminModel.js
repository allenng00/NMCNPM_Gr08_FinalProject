const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const adminsCollection = require('./MongooseModel/adminsMongooseModel');

/**
 * Check for valid username and password, return admin info if valid
 * @param {*} username 
 * @param {*} password 
 */
exports.checkCredential = async(username, password) => {
    const admin = await adminsCollection.findOne({ username: username });
    if (!admin)
        return false;
    let checkPassword = await bcrypt.compare(password, admin.password);
    if (checkPassword) {
        return admin;
    }
    return false;
}

exports.getAdmin = async(id) => {
    const user = await adminsCollection.findOne({ _id: ObjectId(id) });
    return user;
}

exports.getUsername = async(username) => {
    const user = await adminsCollection.findOne({ username: username });
    return user;
}

exports.saveProfile = async(req, id) => {
    const txtImage = req.imagePath;
    if (!txtImage) {
        const user = await adminsCollection.findOne({ _id: ObjectId(id) });
        txtImage = user.imageProfile;
    }
    await adminsCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            imageProfile: txtImage
        }
    });
}

exports.changeAdmin = async(password, id) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            let user = adminsCollection.updateOne({ _id: ObjectId(id) }, {
                password: hash
            });
            user
                .updateOne()
                .then((doc) => {})
                .then((err) => {
                    console.log(err);
                });
        });
    });
    return;
}