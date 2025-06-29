

import { NextFunction, Request, Response } from "express";
import { jwtVerify, JWTPayload } from "jose";

export interface AuthenticatedRequest extends Request {
    user? :{
        userId: string,
        email: string,
        role: string
    }
}
// We need to make sure who is making request ? " User" or "Super Admin"
// we will pass "user" data in request using middleware:
export const authenicateJWT = (req:AuthenticatedRequest, res: Response, next: NextFunction) =>{
    const accessToken = req.cookies.accessToken;

    if(!accessToken){
        res.status(401).json({
            success: false,
            error: 'Access token is not present',
        });
    }

    jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_SECRET))
    .then( res => {
        const payload = res.payload as JWTPayload & {
            userId: string,
            email: string,
            role: string
        }

        // append user in req:
        req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        }
        next();
    })
    .catch(e => {
        console.log(e);
        res.status(401).json({
            success: false,
            error: 'Access token is not present',
        });
    })

} 


export const isSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
    if(req?.user && req?.user?.role==='SUPER_ADMIN'){
        next();
    }
    else{
        res.status(403).json({
            success: false,
            error: 'Access denied, super admin access required',
        });
    }
}