import axios from 'axios';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { NextFunction, Response } from 'express';

dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const getPaypalAccessToken = async () => {
    const response = await axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token", "grant_type=client_credentials", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
            ).toString("base64")}`,
        }
    });


    return response.data?.access_token;
}

// createPaypalOrder:
export const createPaypalOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unexpect error occured while creating paypal order",
        })
    }

}

// capturePaypalOrder:
export const capturePaypalOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unexpect error occuredwhile capturing paypal order",
        })
    }

}

// createOrder:
export const createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unexpect error occured while creating order",
        })
    }

}
// getOrder:
export const getOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unexpect error occured while fetching order",
        })
    }

}
// updateOrderStatus:
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unexpect error occured while updating order status",
        })
    }

}
// getAllOrders:
export const getAllOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unexpect error occured while fetching all order",
        })
    }

}

// getOrdersByUserId:
export const getOrdersByUserId = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unexpect error occured while fetching order by userid",
        })
    }

}

