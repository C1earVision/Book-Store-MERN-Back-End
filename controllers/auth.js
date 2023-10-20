const CustomAPIError = require('../errors/custom-error')
const {StatusCodes} = require('http-status-codes')
const User = require('../models/users')

const register = async (req,res)=>{
  const user = await User.create({...req.body})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user, token})
}

const login = async (req,res)=>{
  const {email ,password} = req.body
  const user = await User.findOne({email})
  if(!user){
    throw new CustomAPIError('Email or password wrong', StatusCodes.UNAUTHORIZED)
  }
  const passIsMatch = await user.comparePassword(password)
  if(!passIsMatch){
    throw new CustomAPIError('Password doesnt match', StatusCodes.UNAUTHORIZED)
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({user, token})
}


module.exports = {
  register,
  login
}