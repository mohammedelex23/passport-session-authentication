require('dotenv').config()
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = mongoose.Schema({
    username : String,
    password : String
})

UserSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', UserSchema, 'users')

module.exports = User;