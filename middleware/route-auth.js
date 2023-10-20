const User = require('../models/users')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom-error')

const auth = async (req,res,next)=>{
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new CustomAPIError('Unothorized Access', StatusCodes.UNAUTHORIZED)
  }
  const token = authHeader.split(' ')[1]
  try {
    const payLoad = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {admin:payLoad.admin , userId:payLoad.userId, name:payLoad.name}
    next()
  } catch (error) {
    throw new CustomAPIError('Authorization Error', StatusCodes.UNAUTHORIZED)
  }
}

module.exports = auth