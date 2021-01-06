const { ObjectId} = require('mongodb');
//const commentCollection = require('./MongooseModel/commentMongooseModel');
const userModel = require('../models/userModel');
module.exports = function Comment(oldComment){
    
    //this.items = oldComment.items || {};
    // this.totalQty =oldComment.totalQty || 0;
    // this.totalPrice =oldComment.totalPrice || 0;
    this.items = oldComment || [];
    this.add = function (id, nickname, content){
        const cmt = {nickname: nickname, content: content, avatar: ""};
        this.items.push(cmt);
    };
    
    this.generateArray =async function (){
        var arr = [];
        let user, item;

        for (var id in this.items)
        {
            item = this.items[id];
            // user = await userModel.getNameUser(item.nickname);
            // if (user)
            //     item.avatar = user.imageProfile;

           
            arr.push(item);
        }
       
        return arr;
      
    };
};
// exports.add_comment = async(bookID, nickname, content)=>{

//     //const listComment = commentCollection.find({bookID: bookID});
//     await commentCollection.create({
//         userID: ObjectId(newOrder.id),
//         bookID: bookID,
//         nickname: nickname,
//         content: content
//     });
// };