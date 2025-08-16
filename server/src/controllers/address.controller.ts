import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { prisma } from "../server";

// createAddress [POST]:
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

        if(isDefault){
            await prisma.address.updateMany({
                where: {userId},
                data: {
                    isDefault: false,
                }
            })
        }   

        const newAddress = await prisma.address.create({
            data: {
                userId,
                name,
                address, 
                city, 
                country, 
                phone, 
                postalCode, 
                isDefault: isDefault ?? false,
            },
        });

        res.status(200).json({
            success:true,
            message: "Address created succesfully",
            result: newAddress
        });
        return;
    }
    catch(err){
        res.status(500).json({
            success:false,
            error: "Some error occurred while creating address"
        })
    }
}

// getAddresses [GET]:
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

        const addresses = await prisma.address.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'},
        });

        if(!addresses){
            res.status(301).json({
                success:false,
                error: "No address found",
            })
            return;
        }

        res.status(200).json({
            success:true,
            message: "Address fetched succesfully",
            result: addresses
        });
        return;
    }
    catch(err){
        res.status(500).json({
            success:false,
            error: "Some error occurred while fetching address"
        })
    }
}

// updateAddress [PUT]:
export const updateAddress = async (req: AuthenticatedRequest, res:Response): Promise<void> => {
    try{
        const userId = req?.user?.userId;
        const {id} = req.params;

        if(!userId){
            res.status(401).json({
                success:false,
                error: "User not authenticated",
            })
            return;
        }

        if(!id){
            res.status(404).json({
                success:false,
                error: "no address id found",
            })
            return;
        }

        // find address by id:
        const exsistingAddress = await prisma.address.findUnique({
            where: {id, userId},
        });

        if(!exsistingAddress){
            res.status(404).json({
                success:false,
                error: "no address found with provided id",
            })
            return;
        }

        const {name, address, city, country, phone, postalCode, isDefault} = req.body;

        if(isDefault){
            await prisma.address.updateMany({
                where: {userId},
                data: {
                    isDefault: false,
                }
            })
        }   

        const updatedAddress = await prisma.address.update({
            where: {id, userId},
            data: {
                name,
                address, 
                city, 
                country, 
                phone, 
                postalCode, 
                isDefault: isDefault ?? false,
            },
        });

        res.status(200).json({
            success:true,
            message: "Address updated succesfully",
            result: updatedAddress
        });
        return;


    }
    catch(err){
        res.status(500).json({
            success:false,
            error: "Some error occurred while deleting address"
        })
    }
}

// deleteAddress [DELETE]:
export const deleteAddress = async (req: AuthenticatedRequest, res:Response): Promise<void> => {
    try{
        const userId = req?.user?.userId;
        const {id} = req.params;

        if(!userId){
            res.status(401).json({
                success:false,
                error: "User not authenticated",
            })
            return;
        }

        if(!id){
            res.status(404).json({
                success:false,
                error: "no address id found",
            })
            return;
        }

        // find address by id:
        const exsistingAddress = await prisma.address.findUnique({
            where: {id, userId},
        });

        if(!exsistingAddress){
            res.status(404).json({
                success:false,
                error: "no address found with provided id",
            })
            return;
        }

        await prisma.address.delete({
            where: {id},
        });

        res.status(200).json({
            success:true,
            message: "Address deleted succesfully",
        });
        return;


    }
    catch(err){
        res.status(500).json({
            success:false,
            error: "Some error occurred while deleting address"
        })
    }
}