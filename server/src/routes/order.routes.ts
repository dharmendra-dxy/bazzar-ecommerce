import express from "express";
import { authenicateJWT, isSuperAdmin } from "../middlewares/auth.middleware";
import { capturePaypalOrder, createFinalOrder, createPaypalOrder, getAllOrdersForAdmin, getOrder, getOrdersByUserId } from "../controllers/order.controller";
import { updateAddress } from "../controllers/address.controller";


const router = express.Router();

router.use(authenicateJWT);

router.post("/create-paypal-order", createPaypalOrder);
router.post("/capture-paypal-order", capturePaypalOrder);
router.post("/create-final-order", createFinalOrder);

router.get("/get-order", getOrder);
router.get("/get-order-by-userid", getOrdersByUserId);
router.get("/get-all-order", isSuperAdmin,getAllOrdersForAdmin);

router.put("/:orderId/update-order", updateAddress);


export default router;