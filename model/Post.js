const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostShema = new Schema({
    title: {
        type: String
    },
    summery: {
        type: String
    },
    content: {
        type: String
    },
    cover: {
        type: String

    },
    author: {
        type: Schema.Types.ObjectId, ref: "User"
    }
}, {
    timestamps: true
});

const PostModel = model("Post", PostShema);
module.exports = PostModel;