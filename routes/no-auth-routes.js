const {getAllBooks, getBook} = require('../controllers/no-auth')

const express = require('express')
const router = express.Router()

router.route('/books').get(getAllBooks)
router.route('/books/:id').get(getBook)

module.exports = router