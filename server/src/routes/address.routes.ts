import express from "express";
import { authenicateJWT } from "../middlewares/auth.middleware";
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/address.controller";

const router = express.Router();

router.use(authenicateJWT);
router.get('/fetch-all-address',getAddresses); 
router.post('/add-address',createAddress); 
router.put('/update-address/:id',updateAddress);
router.delete('/delete-address/:id',deleteAddress);

export default router;