const {model, Schema} = require("mongoose");



const Group_Messages = new Schema({
    sender: {
        type: Object,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});


module.exports = Group_Messages = model("Group_Messages", Group_Messages);