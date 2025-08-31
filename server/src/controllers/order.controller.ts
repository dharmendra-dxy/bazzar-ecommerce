import axios from 'axios';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { NextFunction, Response } from 'express';
import {v4 as uuidv4} from "uuid";
import { prisma } from '../server';

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
        const {items, total} = req.body;

        const access_token = await getPaypalAccessToken();

        const paypalItems= items.map((item:any) => ({
            name: item.name,
            description: item.description,
            sku: item.id,
            unit_amount: {
                currency_code: 'INR',
                value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
            category: "PHYSICAL_GOODS", 
        }));

        const itemTotal = paypalItems.reduce((sum:any, item:any) => sum+ parseFloat(item.unit_amount.value) * parseInt(item.quantity), 0);

        const response = await axios.post("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code : "INR", 
                        value: total.toFixed(2),
                        breakdown:{
                            item_total:{
                                currency_code : "INR",
                                value: itemTotal.toFixed(2),
                            }
                        }
                    },
                    items: paypalItems
                }
            ]
        },
        {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${access_token}`,
                "PayPal-Request-ID": uuidv4(),
            }
        }
    );

    res.status(200).json({
        success: true,
        message: "Payment succesfull",
        data: response.data,
    })

    }
    catch(err){
        res.status(500).json({
            success: false,
            error: "Unexpect error occured while creating paypal order",
        })
    }

}

// capturePaypalOrder:
export const capturePaypalOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{
        const {orderId} = req.body;

        const access_token = await getPaypalAccessToken();

        const response = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${access_token}`,
            }            
        });

        res.status(200).json({
            success: true,
            message: "Captured Paypal order succesfull",
            data: response.data,
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            error: "Unexpect error occuredwhile capturing paypal order",
        })
    }

}

// createFinalOrder:
export const createFinalOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

        const {items, addressId, couponId, total, paymentId} = req.body;

        const userId = req.user?.userId
        if(!userId){
            res.status(401).json({
                success: false,
                error: "Un-authenticated user",
            });
            return;
        }

        // start our transaction:
        
        const order = await prisma.$transaction(async (prisma) => {
            // create new order:
            const newOrder = await prisma.order.create({
                data: {
                    userId,
                    addressId,
                    couponId,
                    total,
                    paymentMethod: 'CREDIT_CARD',
                    paymentStatus: 'COMPLETED',
                    paymentId,
                    items: {
                        create: items.map((item:any) => {
                            productId: item.productId,
                            productName: item.productName,
                            productCategory: item.productCategory,
                            quantity: item.quantity,
                            size: item.size,
                            color: item.color,
                            price: item.price,
                        })
                    }
                },
                include: {
                    items: true,
                }
            });

            // update product when Order is created:
            for(const item of items){
                await prisma.product.update({
                    where: {id: item.productId},
                    data:{
                        stock: {decrement: item.quantity},
                        soldCount: {increment: item.quantity},
                    }
                })
            }

            // delete the cartItem:
            await prisma.cartItem.deleteMany({
                where: {cart : {userId}},
            });

            // delete the cart:
            await prisma.cart.delete({
                where: {userId}
            });

            // update the coupon (if used)
            if(couponId){
                await prisma.coupon.update({
                    where: {id: couponId},
                    data: {
                        usageCount: {increment: 1}
                    },
                })
            }
        })

        res.status(200).json({
            success: true,
            message: "order created successfully",
            data: order,
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            error: "Unexpect error occured while creating order",
        })
    }

}
// getOrder:
export const getOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

        const {orderId} = req.params;

        const userId = req.user?.userId
        if(!userId){
            res.status(401).json({
                success: false,
                error: "Un-authenticated user",
            });
            return;
        }

        const order = await prisma.order.findFirst({
            where: {id: orderId, userId},
            include: {
                items:true,
                address: true,
                coupon: true
            }
        });

        res.status(200).json({
            success: true,
            message: "order fetched successfully",
            data: order,
        });

    }
    catch(err){
        res.status(500).json({
            success: false,
            error: "Unexpect error occured while fetching order",
        })
    }

}
// updateOrderStatus:
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{
        const {orderId} = req.params;
        const {status} = req.body;

        const userId = req.user?.userId
        if(!userId){
            res.status(401).json({
                success: false,
                error: "Un-authenticated user",
            });
            return;
        }

        const updateOrder = await prisma.order.updateMany({
            where: {id:orderId, userId},
            data:{
                status,
            }
        });

        res.status(200).json({
            success: true,
            message: "order status updated successfully",
            data: updateOrder,
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            error: "Unexpect error occured while updating order status",
        })
    }

}
// getAllOrdersForAdmin:
export const getAllOrdersForAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

        const userId = req.user?.userId
        if(!userId){
            res.status(401).json({
                success: false,
                error: "Un-authenticated user",
            });
            return;
        }

        const orders = await prisma.order.findMany({
            include: {
                items: true,
                address: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "order fetched successfully",
            data: orders,
        });

    }
    catch(err){
        res.status(500).json({
            success: false,
            error: "Unexpect error occured while fetching all order",
        })
    }

}

// getOrdersByUserId:
export const getOrdersByUserId = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try{

        const userId = req.user?.userId
        if(!userId){
            res.status(401).json({
                success: false,
                error: "Un-authenticated user",
            });
            return;
        }

        const orders = await prisma.order.findMany({
            where: {userId},
            include:{
                items: true,
                address: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        res.status(200).json({
            success: true,
            message: "order fetched successfully",
            data: orders,
        });

    }
    catch(err){
        res.status(500).json({
            success: false,
            error: "Unexpect error occured while fetching order by userid",
        })
    }

}

