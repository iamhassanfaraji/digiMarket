const router = require('express').Router()

const category = require('../controllers/product').category
const product = require('../controllers/product').product
const productDetailPatterns = require('../controllers/product').productDetailPatterns

// product category
router.post('/category/read', ...category.read())
router.post('/category/readById', ...category.readById())

//product
router.post('/read', ...product.read())
router.post('/readById', ...product.readById())


//productDetails
router.post('/productDPs/read', ...productDetailPatterns.read())
router.post('/productDPs/readById', ...productDetailPatterns.readById())


module.exports = router