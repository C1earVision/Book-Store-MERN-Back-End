const {
  addBook, 
  deleteBook, 
  modifyBook, 
  modifyAdminAccess, 
  addBookToWishList,
  getWishListBooks,
  deleteWishlistedBook
} = require('../controllers/req-auth')

const express = require('express')
const router = express.Router()

router.route('/admin').post(addBook).patch(modifyAdminAccess)
router.route('/admin/:id').delete(deleteBook).patch(modifyBook)
router.route('/wishlist/:id').post(addBookToWishList).patch(deleteWishlistedBook)
router.route('/wishlist').get(getWishListBooks)
module.exports = router