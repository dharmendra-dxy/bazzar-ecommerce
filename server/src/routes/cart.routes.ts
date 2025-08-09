import express from "express";
import { authenicateJWT } from "../middlewares/auth.middleware";
import { addToCart, clearEntireCart, fetchCart, removeFromCart, updateCartItemQuantity } from "../controllers/cart.controller";

const router = express.Router();

router.get('/fetch-cart',authenicateJWT, fetchCart);
router.post('/add-to-cart',authenicateJWT, addToCart);
router.delete('/clear-cart',authenicateJWT, clearEntireCart);
router.delete('/remove/:id',authenicateJWT, removeFromCart);
router.put('/update/:id',authenicateJWT, updateCartItemQuantity);

export default router;