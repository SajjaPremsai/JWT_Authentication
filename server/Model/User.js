const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Todos: { body: String }
});


const UserModel = mongoose.model("User",UserSchema)

module.exports = UserModel