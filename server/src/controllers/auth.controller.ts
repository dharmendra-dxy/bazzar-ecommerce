import { prisma } from "../server";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";

function generateToken(userId:string,email:string, role:string){
    const JWT_SECRET=process.env.JWT_SECRET;

    // accessToken:
    const accessToken = jwt.sign({userId, email, role}, JWT_SECRET!, {expiresIn: '60min'});

    // refreshToken:
    const refreshToken = uuidv4();

    return {accessToken, refreshToken};
}

async function setTokens(res:Response, accessToken:string,  refreshToken:string){
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: 'strict',
        maxAge: 60*60*1000, //i.e. 60 mins
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: 'strict',
        maxAge: 7*24*60*60*1000, //i.e. 7 days
    });
}

// register controller:
export const register = async (req: Request, res: Response): Promise<void>=>{
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            res.status(400).json({
                success: false,
                error: "Some inputs are missing",
            });
            return;
        }

        // check for exisiting user:
        const exisitingUser = await prisma.user.findUnique({
            where: {email},
        })

        if(exisitingUser){
            res.status(400).json({
                success: false,
                error: "User already exist with email",
            });
            return;
        }

        // if user do not exisit, create it:
        // const salt = process.env.BCRYPT_SALT!;
        const salt=10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            }
        });
        
        res.status(201).json({
            success: true,
            message: 'User registered succesfully',
            userId: user.id,
        });
        return;

    }
    catch(error){
        console.error("Error while register: ", error),
        res.status(500).json({
            error: "Registration failed",
        });
        return;
    }
}

// login controller:
export const login = async (req:Request, res:Response): Promise<void> => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({
                success: false,
                error: "Some inputs are missing",
            });
            return;
        }

        // check for exisiting user:
        const currentUser = await prisma.user.findUnique({
            where: {email},
        })

        if(!currentUser || !(await bcrypt.compare(password,currentUser?.password))){
            res.status(400).json({
                success: false,
                error: "User do not exist or wrong credentials",
            });
            return;
        }

        // user exists then :create accesToken and refreshToken for user:
        const {accessToken, refreshToken} = generateToken(currentUser.id, currentUser.email, currentUser.role);

        // set out token:
        setTokens(res, accessToken, refreshToken);

        res.status(200).json({
            success: true,
            message: 'User login successfull',
            user: {
                id: currentUser?.id,
                name: currentUser?.name,
                email: currentUser?.email,
                role: currentUser?.role,
            }
        })
    }
    catch(error){
        console.error("Error while login: ", error),
        res.status(500).json({
            error: "Login failed",
        });
    }
}

// refreshAccessToken controllers:
export const refreshAccessToken = async (req:Request, res:Response): Promise<void> =>{
    // get our refreshToken:
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        res.status(401).json({
            success: false,
            error: "Invalid refresh token",
        });
        return;
    }

    try {
        // get user by refreshToken:
        const user = await prisma.user.findFirst({
            where: {refreshToken},
        });

        if(!user){
            res.status(401).json({
                success: false,
                error: "User not found",
            });
            return;
        }

        // generate token (as to refresh):
        const {accessToken, refreshToken: newRefreshToken} = generateToken(user.id, user.email, user.role);

        // set token:
        setTokens(res, accessToken, newRefreshToken);

        res.status(200).json({
            success: true,
            message: "Refresh token re-freshed succesfully",
        });
        return;
    } 
    catch (error) {
        console.error("Refresh token error: ", error),
        res.status(500).json({
            error: "Login failed",
        });
    }
}

// logout controller:
export const logout = async (req:Request, res:Response): Promise<void> => {
    // clear tokens:
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
        success: true,
        message: "User logged out succesfully",
    })

}