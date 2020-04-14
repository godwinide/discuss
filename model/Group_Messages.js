const {model, Schema} = require("mongoose");



const MessagesSchema = new Schema({
    username:{
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: false
    }
});


module.exports = Messages = model("Messages", MessagesSchema);