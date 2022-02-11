require('dotenv').config()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "name is required"],
        minlength: 5,
        maxlength: 30,
    },
    email:{
        type: String,
        required: [true, "email is required"],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "provide a valid email address"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "please provide a password"],
        minlength: 8,
    }
})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJwt = function(){
    return jwt.sign(
        {userId:this._id, name:this.name},
        process.env.JWT_SECRET_KEY,
        {expiresIn: process.env.JWT_LIFETIME})
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('user', userSchema)