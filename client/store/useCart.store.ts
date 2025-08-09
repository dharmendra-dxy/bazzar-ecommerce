import axios from "axios";
import debounce from "lodash/debounce";
import { API_ROUTES } from "@/utils/api";
import { create } from "zustand";


export interface CartItem {
    id: string,
    productId: string,
    name: string,
    price: string,
    image: string,
    color: string,
    size: string,
    quantity: string,
}

interface cartStore {
    items : CartItem[],
    isLoading: boolean,
    error: string | null,
    fetchCart: () => Promise<void>,
    addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>,
    removeFromCart: (id: string)=> Promise<void>
    updateCartQuantity: (id: string, quantity:number)=> Promise<void>
    clearCart: ()=> Promise<void>
}

export const useCartStore = create<cartStore>((set, get) => {

    const debounceUpdateCartQuantity = debounce(
        async(id:string, quantity:number) => {
            try{
                await axios.put(`${API_ROUTES.CARTS}/update/${id}`,{quantity}, {
                    withCredentials: true,
                });
            }
            catch(err){
                set({isLoading: false, error:"Failed to update cart item quantity"})
            }
        }
    )

    return{
        items: [],
        isLoading: false,
        error: null,
        fetchCart: async () => {
            set({isLoading: true, error: null});

            try{
                const response = await axios.get(`${API_ROUTES.CARTS}/fetch-cart`, {
                    withCredentials: true,
                });

                set({isLoading: false, items: response?.data?.data})

            }
            catch(err){
                set({isLoading: false, error:'Failed to fetch cart'});   
            }
        },
        addToCart: async (item) => {
            set({isLoading: true, error: null});

            try{
                const response = await axios.post(`${API_ROUTES.CARTS}/add-to-cart`,item, {
                    withCredentials: true,
                });

                set((state) => ({
                    items: [...state.items, response.data.data],
                    isLoading:false,
                }))

            }
            catch(err){
                set({isLoading: false, error:'Failed to add to cart'});   
            }
        },
        removeFromCart: async (id:string) => {
            set({isLoading: true, error: null});

            try{
                await axios.delete(`${API_ROUTES.CARTS}/remove/${id}`, {
                    withCredentials: true,
                });

                set((state) => ({
                    items: state.items.filter((item) => item.id!==id),
                    isLoading:false,
                }))

            }
            catch(err){
                set({isLoading: false, error:'Failed to remove from cart'});   
            }
        },
        updateCartQuantity: async (id, quantity) => {
            set((state) => ({
                items: state.items.map((cartItem) => cartItem?.id===id ? {...cartItem, quantity}: cartItem)
            }));

            debounceUpdateCartQuantity(id,quantity);
        },
        clearCart: async () => {
            set({isLoading: true, error: null});

            try{
                await axios.post(`${API_ROUTES.CARTS}/clear-cart`, {
                    withCredentials: true,
                });

                set((state) => ({
                    items: [],
                    isLoading:false,
                }))

            }
            catch(err){
                set({isLoading: false, error:'Failed to clear cart'});   
            }
        },
    }
})
