const mongoose = require('mongoose');

const uri = process.env.URI || "mongodb+srv://khangtin:khangtin123@cluster0.zye8a.mongodb.net/BookStore";
//"mongodb+srv://khangtin:khangtin123@cluster0.zye8a.mongodb.net/test?authSource=admin&replicaSet=atlas-cspk7y-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

exports.mongoose = async() => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("DB is connected");
    } catch (error) {
        console.error(error);
    }
}

console.log('RUNNING DB...');