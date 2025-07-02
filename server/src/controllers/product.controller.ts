
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from 'fs';


// Create a Product [POST]
export const createProduct = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{
    try {
        const {
            name,          
            brand,         
            description,   
            category,      
            gender,        
            sizes,        
            colors,        
            price,         
            stock, 
        } = req.body;

        
        // get images file (multiple):
        const files = req.files as Express.Multer.File[];

        // upload all images to cloudinary:
        const uploadPromises = files.map(file => cloudinary.uploader.upload(file.path, {
            folder: 'ecommerce',
            })
        );

        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => result.secure_url);

        const newProduct = await prisma.product.create({
            data: {
                name,
                brand,         
                description,   
                category,      
                gender,        
                sizes: sizes.split(','),        
                colors: colors.split(','),        
                price: parseFloat(price),         
                stock: parseFloat(stock),
                images:  imageUrls,
                soldCount: 0,
                rating: 0,

            }
        })

        // when images are uploaded to cloudinary, delete images from local:
        // clean the uploaded files:
        files.forEach(file => fs.unlinkSync(file.path));

        res.status(200).json({
            success: true,
            message: "Product created succesfully",
            product: newProduct, 
        })


    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            error: "Some error Occured while creating product",
        })
    }
}

// Fetch All product [ADMIN]
export const fetchAllProductForAdmin = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{
    try {
        const products = await prisma.product.findMany({});

        res.status(200).json({
            success: true,
            message: "All products fetched succesfull",
            products
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            error: "Some error Occured",
        })
    }
}


// Get a Single Product {id}
export const getProductById = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{

    try {
        // get id from params:
        const {id} = req.params;

        const product = await prisma.product.findUnique({
            where: {id}
        });

        if(!product){
            res.status(404).json({
                success: false,
                error: "No product found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Product found succesfully",
            product
        })


    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            error: "Some error Occured",
        })
    }
}


// Update a Product [ADMIN]
export const updateProduct = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{
    try {
        // [TODO] : implement image update functionality

        const {id} = req.params;

        const {
            name,          
            brand,         
            description,   
            category,      
            gender,        
            sizes,        
            colors,        
            price,         
            stock,
            rating
        } = req.body;

        const product = await prisma.product.update({
            where: {id},
            data:{
                name,          
                brand,         
                description,   
                category,      
                gender,        
                sizes:sizes.split(','),        
                colors:colors.split(','),        
                price: parseFloat(price),         
                stock: parseInt(stock),
                rating: parseInt(rating),
            }
        });

        res.status(200).json({
            success: true,
            message: "Product updated succesfully",
            product, 
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            error: "Some error Occured while creating product",
        })
    }
}


// Delete a product [ADMIN]
export const deleteProduct = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{
    try {
        const {id} = req.params;

        const product = await prisma.product.delete({
            where: {id},
        });

        res.status(200).json({
            success: true,
            message: "Product deleted succesfully",
            product, 
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            error: "Some error Occured while creating product",
        })
    }
}


// Fetch Product with Filter [CLIENT]



