const CustomAPIError = require('../errors/custom-error')
const {StatusCodes} = require('http-status-codes')
const Books = require('../models/books')

const getAllBooks = async (req, res)=>{
  const {name, author, genre, sort, numericFilters} = req.query
  const querys = {}
  if(name){
    querys.name = { $regex: name, $options: 'i'}
  }
  if(author){
    querys.author = author
  }
  if(genre){
    querys.genre = { $regex: genre, $options: 'i'}
  }
  let result = Books.find(querys)
  if(sort){
    sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  }else{
    result = result.sort('-createdAt')
  }
  if(numericFilters){
    const operatorMapper = {
      '>':'$gt',
      '>=':'$gte',
      '=':'$eq',
      '<':'lt',
      '<=':'lte'
    }
    const regEx = /\b(<|>|>=|=|<=)\b/g
    let filters = numericFilters.replace(regEx,(match)=>`-${operatorMapper[match]}-`)
    const options = ['price'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        querys[field] = { [field]: {[operator]: Number(value)} };
        result = result.find(querys[field])
      }
    });
  }
  const page = Number(req.query.page) || 1
  const limit = 3
  const loadmore = page * limit
  result = result.limit(loadmore)

  const books = await result 
  res.status(200).json({count: books.length, books})

}

const getBook = async (req, res)=>{

  const {id} = req.params

  if(!id){
    throw new CustomAPIError('Please provide the id of the book', StatusCodes.BAD_REQUEST)
  }

  const book = await Books.findOne({_id:id})
  res.status(StatusCodes.OK).json({book})
}

module.exports = {
  getAllBooks,
  getBook,
}