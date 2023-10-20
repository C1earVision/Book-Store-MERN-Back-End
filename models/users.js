const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Please provide a name'],
    minlength:5,
    maxlength:15,
  },
  email:{
    type:String,
    required: [true, 'Please provide email'],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'please provide a valid email'],
    unique: true,
  },
  password:{
    type:String,
    required: [true, 'Please provide password'],
    minlength:5,
    maxlength:25,
  },
  admin:{
    type:Boolean,
    default:false
  }
})

userSchema.methods.createJWT = function (){
  return jwt.sign({admin:this.admin ,userId:this._id, name:this.name}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME})
}

userSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (sentPass){
  const res = await bcrypt.compare(sentPass, this.password)
  return res
}




module.exports = mongoose.model('User', userSchema)
