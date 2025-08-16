import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// createAddress:
export const createAddress = async (req: AuthenticatedRequest, res:Response): Promise<void> => {
    try{
        const userId = req?.user?.userId;
        if(!userId){
            res.status(401).json({
                success:false,
                error: "User not authenticated",
            })
            return;
        }

        const {name, address, city, country, phone, postalCode, isDefault} = req.body;
        
    }
    catch(err){
        res.status(500).json({
            success:false,
            error: "Some error occurred while creating address"
        })
    }
}

// getAddresses:
export const getAddresses = async (req: AuthenticatedRequest, res:Response): Promise<void> => {
    try{
        const userId = req?.user?.userId;
        if(!userId){
            res.status(401).json({
                success:false,
                error: "User not authenticated",
            })
            return;
        }
    }
    catch(err){
        res.status(500).json({
            success:false,
            error: "Some error occurred while fetching address"
        })
    }
}

// deleteAddress:
export const deleteAddress = async (req: AuthenticatedRequest, res:Response): Promise<void> => {
    try{
        const userId = req?.user?.userId;
        if(!userId){
            res.status(401).json({
                success:false,
                error: "User not authenticated",
            })
            return;
        }
    }
    catch(err){
        res.status(500).json({
            success:false,
            error: "Some error occurred while deleting address"
        })
    }
}