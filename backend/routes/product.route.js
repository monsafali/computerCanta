import express from 'express'
import { GenerateProduct,SearchDate, SearchProduct } from '../controllers/product.controller.js'


const router = express.Router()



router.post("/generate", GenerateProduct)
router.post("/searchDate", SearchDate)
router.post("/search", SearchProduct)

export default router
