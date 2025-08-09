import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { prisma } from "../server";


// [POST]: addToCart
export const addToCart = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const {productId, quantity, size, color} = req.body;

        if(!userId){
            res.status(401).json({
                success: false,
                error: "User needs to be authenticated",
            });
            return;
        }

        if(!productId || !quantity){
            res.status(300).json({
                success: false,
                error: "Please select Product or Quantity",
            });
            return;
        }

        const cart = await prisma.cart.upsert({
            where: {userId},
            create: {userId},
            update: {},
        });

        const cartItem = await prisma.cartItem.upsert({
            where: {
                cartId_productId_size_color: {
                    cartId: cart.id,
                    productId,
                    size: size || null,
                    color: color || null,
                }
            },
            update:{
                quantity: {increment: quantity}
            },
            create: {
                cartId: cart.id,
                productId,
                size,
                quantity,
                color
            }
        });

        const product = await prisma.product.findUnique({
            where: {id: productId},
            select: {
                name: true,
                price: true,
                images: true
            }
        });

        const response = {
            id: cartItem?.id,
            productId: cartItem?.productId,
            name: product?.name,
            price: product?.price,
            image: product?.images,
            color: cartItem?.color,
            size: cartItem?.size,
            quantity: cartItem?.quantity
        };

        res.status(200).json({
            success: true,
            message: "Successfully added to the cart",
            data: response
        });

    }
    catch(error){
        console.error("Error while register: ", error),
        res.status(500).json({
            success: false,
            error: "Some error occured while adding to cart",
        });
        return;
    }
}

// [GET]: fetchCart
export const fetchCart = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if(!userId){
            res.status(401).json({
                success: false,
                error: "User needs to be authenticated",
            });
        }
        
        const cart = await prisma.cart.findUnique({
            where: {userId},
            include: {
                items: true,
            }
        });

        if(!cart){
            res.status(404).json({
                success: false,
                error: "No item found in cart",
            });
            return;
        }

        const cartItemWithProducts = await Promise.all(
            cart?.items.map(async(item)=> {
                const product = await prisma.product.findUnique({
                    where: {id: item.productId},
                    select:{
                        name: true,
                        price: true,
                        images: true,
                    },
                })
                return {
                    id: item.id,
                    productId: item.productId,
                    name: product?.name,
                    price: product?.price,
                    images: product?.images[0],
                    sizes: item?.size
                    quantity: item?.quantity
                }
            })
        );

        res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                data:cartItemWithProducts,
            });

    }
    catch(error){
        console.error("Error while fetching cart: ", error),
        res.status(500).json({
            success: false,
            error: "Some error occured while fetching Cart ",
        });
        return;
    }
}

// [DELETE]: removeFromCart
export const removeFromCart = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if(!userId){
            res.status(401).json({
                success: false,
                error: "User needs to be authenticated",
            });
        }
    }
    catch(error){
        console.error("Error while removing from cart: ", error),
        res.status(500).json({
            success: false,
            error: "Some error occured while removing from Cart ",
        });
        return;
    }
}

// [UPDATE]: updateCartItemQuantity
export const updateCartItemQuantity = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if(!userId){
            res.status(401).json({
                success: false,
                error: "User needs to be authenticated",
            });
        }

    }
    catch(error){
        console.error("Error while updating Cart item quantity: ", error),
        res.status(500).json({
            success: false,
            error: "Some error occured while updating Cart item quantity",
        });
        return;
    }
}

// [POST]: clearCart
export const clearCart = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if(!userId){
            res.status(401).json({
                success: false,
                error: "User needs to be authenticated",
            });
        }

    }
    catch(error){
        console.error("Error while clearing cart: ", error),
        res.status(500).json({
            success: false,
            error: "Some error occured while clearing cart",
        });
        return;
    }
}