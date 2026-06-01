import express from 'express'
import { GenerateProduct,SearchDate, SearchProduct,getSr,deleteProduct} from '../controllers/product.controller.js'


const router = express.Router()



router.get("/sr", getSr)
router.post("/generate", GenerateProduct)
router.post("/searchDate", SearchDate)
router.post("/search", SearchProduct)
router.delete("/product/:SrNo", deleteProduct)


export default router
