const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const adminCollection = require('./MongooseModel/adminMongooseModel');

/**
 * Check for valid username and password, return admin info if valid
 * @param {*} username 
 * @param {*} password 
 */
exports.checkCredential = async(username, password) => {
    const admin = await adminCollection.findOne({ username: username });
    if (!admin)
        return false;
    let checkPassword = await bcrypt.compare(password, admin.password);
    if (checkPassword) {
        return admin;
    }
    return false;
}

exports.getAdmin = async(id) => {
    const user = await adminCollection.findOne({ _id: ObjectId(id) });
    return user;
}

exports.saveProfile = async(req, id) => {
    const txtImage = req.imagePath;
    if (!txtImage) {
        const user = await adminCollection.findOne({ _id: ObjectId(id) });
        txtImage = user.imageProfile;
    }
    await adminCollection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            imageProfile: txtImage
        }
    });
}