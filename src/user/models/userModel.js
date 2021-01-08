const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const userCollection = require('./MongooseModel/userMongooseModel');

exports.menu = async(id) => {
    //console.log('model db');
    //const booksCollection = db().collection('Books');
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    return user;
}

exports.getUsername = async(username) => {
    return await usersCollection.findOne({ username: username });
}

exports.update_profile = async(req, id) => {
    const txtFirstName = req.txtFirstName;
    const txtLastName = req.txtLastName;
    const txtEmail = req.txtEmail;
    const txtProfilePic = req.txtProfilePic;
    const txtAddress = req.txtAddress;
    const txtPhone = req.txtPhone;

    await userCollection.update({ _id: ObjectId(id) }, {
        firstName: txtFirstName,
        lastName: txtLastName,
        email: txtEmail,
        imageProfile: txtProfilePic,
        address: txtAddress,
        phone: txtPhone,
    })
}

exports.addUser = async(newUser) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            let user = new userCollection({
                username: newUser.username,
                email: newUser.email,
                password: hash,
                status: "Normal"
            });
            user
                .save()
                .then((doc) => {})
                .then((err) => {
                    console.log(err);
                });
        });
    });
    return;
}

/**
 * Check for valid username and password, return user info if valid
 * @param {*} username 
 * @param {*} password 
 */
exports.checkCredential = async(username, password) => {
    const user = await userCollection.findOne({ username: username });
    if (!user)
        return false;
    let checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword)
        return user;
    return false;
};

exports.checkIsBlocked = async(username) => {
    const user = await userCollection.findOne({ username: username });
    if (user.status === "Blocked")
        return true;
    return false;
}

exports.getUser = (id) => {
    return userCollection.findOne({ _id: id });
}

exports.getNameUser = (username) => {
    const kt = userCollection.findOne({ username: username });
    if (!kt)
        return false;
    return kt;
}


exports.getProfilePicUser = async(username)=>{
    const user = await userCollection.findOne({username: username});
    if (user)
        return user.imageProfile;
    else 
        return null;
}
exports.createCart = async(id, cart) => {

    await userCollection.updateOne({ _id: ObjectId(id) }, { cart: cart })
}