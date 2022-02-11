const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors/index')

const authenticatedMiddleware = async (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new UnauthenticatedError('Login first')
    }
    const token = authHeader.split(' ')[1]

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = {
            userId: user.userId,
            name: user.name
        }
        next()
    }catch (err) {
        throw new UnauthenticatedError('invalid token')
    }

}

module.exports = authenticatedMiddleware