const { ObjectId } = require('mongodb');

const usersCollection = require('./MongooseModel/usersMongooseModel');

exports.listUser = async(filter, pageNumber, itemPerPage) => {
    let users = await usersCollection.paginate(filter, {
        page: pageNumber,
        limit: itemPerPage,
    });
    return users;
}

exports.get = async(id) => {
    const user = await usersCollection.findOne({ _id: ObjectId(id) })
    return user;
}

exports.close = async(id) => {
    await usersCollection.updateOne({ _id: ObjectId(id) }, {
        status: "Khoá"
    })
}

exports.open = async(id) => {
    await usersCollection.updateOne({ _id: ObjectId(id) }, {
        status: "Mở"
    })
}