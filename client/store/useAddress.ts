import axios from "axios";
import { API_ROUTES } from "@/utils/api";
import { create } from "zustand";

export interface Address{
    id: string,
    name: string,
    address: string, 
    city: string, 
    country: string, 
    phone: string, 
    postalCode: string, 
    isDefault: boolean,
}

interface addressStore {
    addresses : Address[],
    isLoading: boolean,
    error: string | null,
    fetchAllAddresses: () => Promise<boolean>,
    createAddress: (address: Omit<Address, 'id'>) => Promise<Address | null>,
    updateAddress: (id: string, address:Partial<Address>)=> Promise<Address | null>
    deleteAddress: (id: string)=> Promise<boolean>
}

export const useAddressStore = create<addressStore>((set, get) => ({
    addresses: [],
    isLoading: false,
    error: null,
    fetchAllAddresses: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.get(`${API_ROUTES.ADDRESS}/fetch-all-address`, {
                withCredentials: true,
            });

            set({isLoading: false, addresses: response?.data?.result});
            return true;
        }
        catch (err) {
            set({isLoading: false, error:'Failed to fetch all address'});
            return false;
        }
    },
    createAddress: async (address) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_ROUTES.ADDRESS}/add-address`, address,{
                withCredentials: true,
            });

            const newAddress = response?.data?.result;

            set((state) => ({
                addresses: [newAddress, ...state.addresses],
                isLoading: false,
            }));

            return newAddress;
        }
        catch (err) {
            set({isLoading: false, error:'Failed to create address'});
            return null;
        }
    },
    updateAddress: async (id:string, address) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.put(`${API_ROUTES.ADDRESS}/update-address/${id}`, address,{
                withCredentials: true,
            });

            const updatedAddress = response?.data?.result;

            set((state) => ({
                addresses: state.addresses.map((item) => item.id===id ? updatedAddress : item),
                isLoading: false,
            }))
            return updatedAddress;
        }
        catch (err) {
            set({isLoading: false, error:'Failed to update address'});
            return null;
        }
    },
    deleteAddress: async (id:string) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.delete(`${API_ROUTES.ADDRESS}/delete-address/${id}`,{
                withCredentials: true,
            });

            set((state) => ({
                addresses: state.addresses.filter(item => item.id !== id),
                isLoading: false,
            }));
            return true;
        }
        catch (err) {
            set({isLoading: false, error:'Failed to delete address'});
            return false;
        }
    },
}))