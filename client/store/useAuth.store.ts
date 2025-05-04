import axios from 'axios';
import {create} from "zustand";
import {persist} from "zustand/middleware";

import { API_ROUTES } from '@/utils/api';

type User ={
    id: string,
    name: string | null,
    email : string,
    role: 'USER' | 'SUPER_ADMIN',
}

type AuthStore= {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    register: (name: string, email: string, password: string) => Promise<string | null>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<boolean>;
};

const axiosInstance = axios.create({
    baseURL : API_ROUTES.AUTH,
    withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
    persist(
        (set,get) => ({
            user: null,
            isLoading: false,
            error: null,
            register: async(name, email, password) => {
                set({isLoading: true, error: null});
                try {
                    const response = await axiosInstance.post('/register', {
                        name, email,password
                    })
                    
                    console.log("response: ", response);
                    set({isLoading: false});
                    return response?.data?.userId
                } 
                catch (error) {
                    set({
                        isLoading: false, 
                        error: axios.isAxiosError(error) ? error?.response?.data?.error ?? 'Registration failed': 'Registration failed'
                    });
                    return null;
                }
            },
            login: async(email, password) => {
                set({isLoading: true, error: null});
                try {
                    const response = await axiosInstance.post('/login', {
                         email,password
                    })
    
                    set({isLoading: false, user:response?.data?.user});
                    return true;
                } 
                catch (error) {
                    set({
                        isLoading: false, 
                        error: axios.isAxiosError(error) ? error?.response?.data?.error ?? 'Login failed': 'Login failed'
                    });
                    return false;
                }
            },
            logout: async() => {
                set({isLoading: true, error: null});
                try {
                    const response = await axiosInstance.post('/logout');
                    set({isLoading: false, user:null});
                } 
                catch (error) {
                    set({
                        isLoading: false, 
                        error: axios.isAxiosError(error) ? error?.response?.data?.error ?? 'Logout failed': 'Logout failed'
                    });
                }
            },
            refreshAccessToken: async() => {
                try{
                    const response = await axiosInstance.post('/refresh-token');
                    return true
                }
                catch(error){
                    console.log(error);
                    return false;
                }
            }
        }),        
        {
            name: 'auth-storage',
            partialize: (state) => ({user: state.user})
        }
    )
)
