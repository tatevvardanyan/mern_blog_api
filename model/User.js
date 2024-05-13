const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        unique: true
    },
    fullName: {
        type: String,
        minlength: 2,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    v: {
        type: Number,
        default: 0
    }
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;

