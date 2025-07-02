import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Coupon {
    id: string,
    code: string,
    discountPercent: number,
    startDate: string,
    endDate: string,
    usageLimit: number,
    usageCount: number,
}

interface CouponStore {
    coupons: Coupon[],
    isLoading: boolean,
    error: string | null,
    fetchCoupon: () => Promise<void>,
    createCoupon : (coupon: Omit<Coupon, 'id' | 'usageCount'>) => Promise<Coupon | null>,
    deleteCoupon : (id:string) => Promise<boolean>,
}

export const useCouponStore = create<CouponStore>((set,get)=>({
    coupons: [],
    isLoading: false,
    error: null,
    fetchCoupon: async ()=>{
        set({isLoading: true, error:null});
        try{
            const response = await axios.get(`${API_ROUTES.COUPONS}/all`,{
                withCredentials: true,
            });

            set({coupons: response.data?.coupon, isLoading: false});
        }
        catch(err){
            set({isLoading: false, error:'Failed to fetch coupons'});   
        }
    },
    
    createCoupon: async(coupon) => {
        set({isLoading: true, error:null});
        try{
            const response = await axios.post(`${API_ROUTES.COUPONS}/new`, coupon, {
                withCredentials: true,
            });

            set({isLoading: false});
            return response.data?.coupon;
        }
        catch(err){
            set({isLoading: false, error:'Failed to create coupons'}); 
            return null;  
        }
    },

    deleteCoupon: async(id: string) => {
        set({isLoading: true, error:null});
        try{
            const response = await axios.delete(`${API_ROUTES.COUPONS}/${id}`, {
                withCredentials: true,
            });
            set({isLoading: false});
            return response.data?.success;
        }
        catch(err){
            set({isLoading: false, error:'Failed to create coupons'}); 
            return false;  
        }

    }
})
)