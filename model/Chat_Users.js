const {model, Schema} = require("mongoose");



const ChatUsersSchema = new Schema({
    s_id:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    room:{
        type: String
    }
});


module.exports = ChatUsers = model("ChatUsers", ChatUsersSchema);