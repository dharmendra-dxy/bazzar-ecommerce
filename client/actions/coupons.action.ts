'use server';

import { createCouponsRules } from "@/arcjet";
import { request } from "@arcjet/next";

export const protectCouponFormAction = async() => {

    const req = await request();
    const decision = await createCouponsRules.protect(req);

    if(decision.isDenied()){
        if(decision.reason.isBot()){
            return {
                error: 'Bot activity detected',
                success: false,
                status: 403,
            }
        }
        else if(decision.reason.isRateLimit()){
            return {
                error: 'Too many request, try again later',
                success: false,
                status: 403,
            }
        }
        else if(decision.reason.isShield()){
            return {
                error: 'Suspicious activity detected',
                success: false,
                status: 403,
            }
        }
    }

    return {
        success: true,
    }
}