import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { error } from "console";
import { create } from "zustand";

interface FeaturedBanner{
    id: string,
    imageUrl: string,
}

interface FeaturedProduct{
    id: string,
    name: string,
    price: string,
    images: string[],
}

interface SettingState {
    banners: FeaturedBanner[],
    products: FeaturedProduct[],
    isLoading: boolean,
    error: string | null,
    fetchFeaturedBanners: () => Promise<void>
    fetchFeaturedProducts: () => Promise<void>
    addFeaturedBanners: (files:File[] ) => Promise<boolean>
    updateFeaturedProducts: (productIds: string[]) => Promise<boolean>
}

export const useSettingStore = create<SettingState>((set,get) =>({
    banners: [],
    products: [],
    isLoading: false,
    error:null,
    fetchFeaturedBanners: async () => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.get(`${API_ROUTES.SETTINGS}/banners`, {
                withCredentials: true,
            });

            set({banners: response?.data?.banner, isLoading:false});
        }
        catch(e){
            console.log(e);
            set({isLoading: false, error: 'Failed to fetch featured banners'});
        }
    },

    fetchFeaturedProducts: async () => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.get(`${API_ROUTES.SETTINGS}/products`, {
                withCredentials: true,
            });

            set({products: response?.data?.product, isLoading:false});
        }
        catch(e){
            console.log(e);
            set({isLoading: false, error: 'Failed to fetch featured products'});
        }
    },

    addFeaturedBanners: async (files: File[]) => {
        set({isLoading: true, error: null});
        try{

            const formData = new FormData();
        
            files.forEach(file => formData.append('images', file));

            const response = await axios.post(`${API_ROUTES.SETTINGS}/add-banners`, formData ,{
                withCredentials: true,
                headers: {
                    'Content-Type' : 'multipart/form-data',
                },
            });

            set({isLoading:false});
            return response?.data?.success;
        }
        catch(e){
            console.log(e);
            set({isLoading: false, error: 'Failed to add featured banners'});
            return false;
        }
    },

    updateFeaturedProducts: async (productIds: string[]) => {
        set({isLoading: true, error: null});
        try{

            const response = await axios.put(`${API_ROUTES.SETTINGS}/update-products`,{productIds}, {
                withCredentials: true,
            });

            set({isLoading:false});
            return response?.data?.success;
        }
        catch(e){
            console.log(e);
            set({isLoading: false, error: 'Failed to update featured products'});
            return false;
        }
    },
}))