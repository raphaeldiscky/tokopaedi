const express = require('express')
const {
  getProductById,
  getProducts,
  deleteProductById,
  addProduct,
  updateProductById,
  createProductReview,
  getTopProduct
} = require('../controllers/productController')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, addProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProduct)
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProductById)
  .put(protect, admin, updateProductById)

module.exports = router
