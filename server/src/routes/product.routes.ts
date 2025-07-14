import express from "express";
import { authenicateJWT, isSuperAdmin } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { createProduct, deleteProduct, fetchAllProductForAdmin, getProductById, updateProduct,getFilteredProducts } from "../controllers/product.controller";

const router = express.Router();

router.post('/new', authenicateJWT, isSuperAdmin, upload.array("images", 5), createProduct);
router.get('/filtered-products', authenicateJWT, getFilteredProducts);
router.get('/all', authenicateJWT, isSuperAdmin, fetchAllProductForAdmin);
router.get('/:id', authenicateJWT, getProductById);
router.put('/:id', authenicateJWT, isSuperAdmin, updateProduct);
router.delete('/:id', authenicateJWT, isSuperAdmin, deleteProduct);



export default router;
