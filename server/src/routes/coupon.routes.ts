import express from "express";
import { createCoupon, deleteCoupon, fetchAllCoupon } from "../controllers/coupon.controller";
import { authenicateJWT, isSuperAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/all', authenicateJWT, isSuperAdmin,fetchAllCoupon);
router.post('/new', authenicateJWT, isSuperAdmin, createCoupon);
router.delete('/:id', authenicateJWT, isSuperAdmin, deleteCoupon);

export default router;