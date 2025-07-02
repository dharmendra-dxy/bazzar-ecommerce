import { Request, Response } from "express";
import { prisma } from "../server";

// createCoupon [POST]:
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
    try{
        const {
            code,
            discountPercent,
            startDate,
            endDate,
            usageLimit
        } = req.body;

        const newCoupon = await prisma.coupon.create({
            data: {
                code,
                discountPercent,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                usageLimit: parseInt(usageLimit),
                usageCount: 0
            }
        });

        res.status(200).json({
            success: true,
            message: "Coupon created succesfully",
            coupon: newCoupon
        })

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Error while creating coupon",
        })
    }
}

// fetchAllCoupon [GET]:
export const fetchAllCoupon = async (req: Request, res: Response): Promise<void> => {
    try{
        const coupons = await prisma.coupon.findMany({
            orderBy: {createdAt: 'asc'}
        });
        res.status(200).json({
            success: true,
            message: "Coupons fetched succesfully",
            coupon: coupons
        })

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Error while fetching all coupon",
        })
    }
}

// deleteCoupon:
export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
    try{
        const {id} = req.params;
        const coupon = await prisma.coupon.delete({
            where: {id},
        })
        res.status(200).json({
            success: true,
            message: "Coupons deleted succesfully",
            coupon
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Error while deleting coupon",
        })
    }
}