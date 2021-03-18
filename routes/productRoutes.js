import express, { Router } from 'express'
const router = express.Router()
import {
  getProductById,
  getProducts,
  deleteProductById,
  addProduct,
  updateProductById,
  createProductReview,
  getTopProduct
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, admin, addProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProduct)
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProductById)
  .put(protect, admin, updateProductById)

export default router
