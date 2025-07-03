import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from 'fs';

// addFeaturedBanner [POST]
export const addFeaturedBanner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try{
        const files = req.files as Express.Multer.File[];

        if(!files || files.length===0){
            res.status(404).json({
                success: false,
                error: 'No Files found',
            });
            return;
        }

        const uploadPromise = files.map(file => cloudinary.uploader.upload(file.path, {
            folder: 'ecommerce-feature-banner'
        }));

        const uploadResult = await Promise.all(uploadPromise);

        const banners = await Promise.all(uploadResult.map(res => prisma.featureBanner.create({
            data: {
                imageUrl: res.secure_url
            }
        })));

        // clean files :
        files.forEach(file => fs.unlinkSync(file.path));

        res.status(201).json({
            success: true,
            message: 'Featured banner added suucessfully',
            banner: banners
        });

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            error: 'Failed to add feature banner',
        })
    }
}

// fetchFeaturedBanner [GET]
export const fetchFeaturedBanner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try{
        const banners = await prisma.featureBanner.findMany({
            orderBy: {createdAt: 'desc'},
        })

        res.status(200).json({
            success: true,
            message: 'Featured banner fetched successfully',
            banner: banners
        });

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch feature banner',
        })
    }
}

// updateFeaturedProducts [PUT]
export const updateFeaturedProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try{
        const {productIds} = req.body;

        if(!Array.isArray(productIds) || productIds.length>8){
            res.status(400).json({
                success: false,
                error: 'Invalid Product Ids or too many request',
            });
            return;
        }

        // reset all products to not featured:
        await prisma.product.updateMany({
            data:{
                isFeatured: false,
            }
        });

        // set seleted products as featured:
        const products = await prisma.product.updateMany({
            where: {id: {in: productIds}},
            data: {isFeatured: true},
        });

        res.status(200).json({
            success: true,
            message: 'Updated Featured products successfully',
            product: products
        }); 

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            error: 'Failed to update feature products',
        })
    }
}


// fetchFeaturedProducts [GET]
export const fetchFeaturedProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try{
        const products = await prisma.product.findMany({
            where: {isFeatured: true},
        });

        res.status(200).json({
            success: true,
            message: 'Fetched Featured products successfully',
            product: products
        }); 
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch feature products',
        })
    }
}