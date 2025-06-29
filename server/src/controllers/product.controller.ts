
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";


// Create a Product [POST]
export const createProduct = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{
    try {
        

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
        

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            error: "Some error Occured while creating product",
        })
    }
}



// Get a Single Product {id}
export const getProductById = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{
    try {
        

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            error: "Some error Occured while creating product",
        })
    }
}


// Update a Product [ADMIN]
export const updateProduct = async (req: AuthenticatedRequest, res:Response): Promise<void> =>{
    try {
        

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
        

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            error: "Some error Occured while creating product",
        })
    }
}


// Fetch Product with Filter [CLIENT]



