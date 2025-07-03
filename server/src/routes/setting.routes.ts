import express from "express";
import { authenicateJWT, isSuperAdmin } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { 
    addFeaturedBanner, 
    fetchFeaturedBanner, 
    fetchFeaturedProducts, 
    updateFeaturedProducts 
} from "../controllers/setting.controller";


const router = express.Router();

router.get('/products', authenicateJWT,  fetchFeaturedProducts);
router.put('/update-products', authenicateJWT, isSuperAdmin, updateFeaturedProducts);

router.get('/banners', authenicateJWT, fetchFeaturedBanner);
router.post('/add-banners', authenicateJWT, isSuperAdmin, upload.array('images', 5) ,addFeaturedBanner);

export default router;