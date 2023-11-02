const CustomAPIError = require('../errors/custom-error')
const {StatusCodes} = require('http-status-codes')
const Books = require('../models/books')
const User = require('../models/users')


const addBook = async (req,res)=>{
  const {admin, userId} = req.user
  if(!admin){
    throw new CustomAPIError('this user has no access to this route', StatusCodes.UNAUTHORIZED)
  }
  req.body.genre = req.body.genre.split(', ').sort().join(', ')
  req.body.createdBy = userId
  const book = await Books.create(req.body)
  res.status(StatusCodes.CREATED).json({book})
}

const modifyBook = async (req, res)=>{
  const {params:{ id },user:{ admin }} = req
  if(!admin){
    throw new CustomAPIError('this user has no access to this route', StatusCodes.UNAUTHORIZED)
  }
  req.body.genre = req.body.genre.split(', ').sort().join(', ')
  const book = await Books.findByIdAndUpdate({_id:id}, req.body, { new: true, runValidators: true })
  res.status(StatusCodes.OK).json({book})
}

const modifyAdminAccess = async (req, res)=>{
  const {params:{ id }, user:{ admin }} = req
  if(!admin){
    throw new CustomAPIError('this user has no access to this route', StatusCodes.UNAUTHORIZED)
  }
  let user = await User.findOne({_id:id})
  if(!user){
    throw new CustomAPIError('No user by this email', StatusCodes.BAD_REQUEST)
  }
  const adimnState = user.admin?false:true
  user = await User.findByIdAndUpdate({_id:id},{admin: adimnState}, { new: true, runValidators: true })
  res.status(StatusCodes.OK).json({user})
}

const deleteBook = async(req, res)=>{
  const {params:{ id },user:{ admin }} = req
  if(!admin){
    throw new CustomAPIError('this user has no access to this route', StatusCodes.UNAUTHORIZED)
  }
  const book = await Books.findOneAndDelete({_id: id})
  res.status(StatusCodes.OK).json({msg:'book deleted succesfully', book})
}

const addBookToWishList = async (req, res)=>{
  const {user:{userId}, params:{id:bookId}} = req
  let book = await Books.findOne({_id:bookId})
  if(book.wishListedBy.includes(userId)){
    throw new CustomAPIError('user already has the book in library', StatusCodes.BAD_REQUEST)
  }
  book = await Books.findOneAndUpdate({_id:bookId},{ $push: {wishListedBy:userId} }, { new: true, runValidators: true })
  res.status(StatusCodes.OK).json({book})
}

const getWishListBooks = async(req, res)=>{
  const {userId} = req.user
  const books = await Books.find({wishListedBy:userId})
  res.status(StatusCodes.OK).json({count:books.length ,books})
}

const deleteWishlistedBook = async (req,res)=>{
  const {params:{id:bookId}, user:{userId}} = req
  let book = await Books.findOne({_id:bookId})
  if(!book.wishListedBy.includes(userId)){
    throw new CustomAPIError('this book doesnt exist in your library', StatusCodes.BAD_REQUEST)
  }
  const index = book.wishListedBy.indexOf(userId);
  book.wishListedBy.splice(index, 1)
  book = await Books.findByIdAndUpdate({_id:bookId},{wishListedBy: book.wishListedBy}, { new: true, runValidators: true })
  res.status(StatusCodes.OK).json({book})
}

module.exports = {
  addBook,
  deleteBook,
  modifyBook,
  modifyAdminAccess,
  addBookToWishList,
  getWishListBooks,
  deleteWishlistedBook
}