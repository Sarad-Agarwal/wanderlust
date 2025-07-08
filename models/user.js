const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");//this library will automatically add the fields of username and password(hashed and salted)

const userSchema = new Schema({
    email : {
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);//this plugin we have to declare here manually so that username and password can automatically be created in hashed and salted form

const User = mongoose.model("User",userSchema);
module.exports = User;