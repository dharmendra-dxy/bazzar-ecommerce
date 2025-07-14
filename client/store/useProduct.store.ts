import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Product {
    id: string,                  
    name: string,          
    brand: string,         
    description: string,   
    category: string,      
    gender: string,        
    sizes: string[],         
    colors: string[],        
    price: number,         
    stock: number,         
    soldCount: number,     
    rating?: number,        
    images: string[],   
    isFeatured: boolean,    
}

interface ProductState{
    products: Product[],
    isLoding: boolean,
    error: string | null,
    currentPage:number, 
    totalPages:number, 
    totalCount:number, 
    fetchAllProductsForAdmin: () => Promise<void>,
    createProduct: (productData: FormData)=> Promise<Product>,
    updateProduct: (id:string, productData:FormData)=> Promise<Product>,
    deleteProduct: (id:string)=> Promise<boolean>,
    getProduct: (id:string) => Promise<Product | null>,
    fetchFilteredProducts: (params: {
        page?: number;
        limit?: number;
        categories?: string[];
        sizes?: string[];
        colors?: string[];
        brands?: string[];
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => Promise<void>,
    setCurrentPage: (page: number)=> void,
}

export const useProductStore = create<ProductState>((set,get)=>({
    products: [],
    isLoding: true,
    error: null,
    currentPage:1, 
    totalPages:1, 
    totalCount:0, 

    fetchAllProductsForAdmin: async() => {
        set({isLoding: true, error: null});
        try{
            const response = await axios.get(`${API_ROUTES.PRODCUTS}/all`,{
                withCredentials: true,
            });
            set({products: response.data.products, isLoding:false});
        }
        catch(e){
            set({isLoding: false, error: 'Failed to fetch all products'});
        }
    },

    createProduct: async(productData: FormData) => {
        set({isLoding: true, error: null});
        try{
            const response = await axios.post(`${API_ROUTES.PRODCUTS}/new`, productData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            set({isLoding:false});
            return response?.data?.product;
        }
        catch(e){
            set({isLoding: false, error: 'Failed to create new product'});
        }
    },

    updateProduct: async(id: string, productData: FormData) => {
        set({isLoding: true, error: null});
        try{
            const response = await axios.put(`${API_ROUTES.PRODCUTS}/${id}`, productData, {
                withCredentials: true,
                headers: {
                    // 'Content-Type': 'multipart/form-data', -> used when handling images, not required for update
                    'Content-Type': 'application/json',
                }
            });

            set({isLoding:false});
            return response?.data?.product;
        }
        catch(e){
            set({isLoding: false, error: 'Failed to update product'});
        }
    },

    deleteProduct: async(id: string) => {
        set({isLoding: true, error: null});
        try{
            const response = await axios.delete(`${API_ROUTES.PRODCUTS}/${id}`, {
                withCredentials: true,
            });
            set({isLoding:false});
            return response.data?.success;
        }
        catch(e){
            set({isLoding: false, error: 'Failed to delete product'});
        }
    },

    getProduct: async(id: string) => {
        set({isLoding: true, error: null});
        try{
            const response = await axios.get(`${API_ROUTES.PRODCUTS}/${id}`, {
                withCredentials: true,
            });

            set({ isLoding:false});
            return response.data?.product;
        }
        catch(e){
            set({isLoding: false, error: 'Failed to get a product'});
            return null;
        }
    },

    fetchFilteredProducts: async (params) => {
        set({isLoding: true, error: null});
        try{
            const queryParams = {
                ...params,
                categories: params.categories?.join(','),
                sizes: params.sizes?.join(','),
                colors: params.colors?.join(','),
                brands: params.brands?.join(','),
            }
            const response = await axios.get(
                `${API_ROUTES.PRODCUTS}/filtered-products`,
                {
                    params: queryParams,
                    withCredentials: true,
                }
            );

            set({
                isLoding: false, 
                products: response?.data?.products,
                currentPage: response?.data?.currentPage,
                totalPages: response?.data?.totalPages,
                totalCount: response?.data?.totalCount,
            })
        }
        catch(e){
            set({isLoding: false, error: 'Failed to get a product'});
        }
    },

    setCurrentPage: (page: number) => {
        set({currentPage: page});
    }
})
)