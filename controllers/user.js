const statusCode = require('http-status-codes')

const { BadRequestError, UnauthenticatedError } = require('../errors/index')
const userModel = require('../models/user')

const register = async (req, res)=>{
    const user = await userModel.create(req.body)
    res.status(statusCode.CREATED).json({
        user:{name:user.name},
        "message": "registered successfully."
    })
}

const login = async (req, res)=>{
    const { email, password} = req.body
    // if(!email || !password){
    //     throw new BadRequestError("email and password required")
    // }
    const user = await userModel.findOne({email:email})
    if(!user){
        throw new UnauthenticatedError("Invalid Credentials")
    }
    // console.log(!user.comparePassword(password))
    if(await user.comparePassword(password)){
        const token = user.createJwt()
        return res.status(statusCode.OK).json({
            user:{
                name: user.name
            },
            token: token
        })
    }
    throw new UnauthenticatedError("Invalid Credentials")
}


module.exports = {
    register,
    login,
}