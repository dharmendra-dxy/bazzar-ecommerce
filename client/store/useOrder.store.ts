import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  couponId?: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentMethod: "CREDIT_CARD";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  couponId?: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentMethod: "CREDIT_CARD";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateOrderData {
  userId: string;
  addressId: string;
  items: Omit<OrderItem, "id">[];
  couponId?: string;
  total: number;
  paymentMethod: "CREDIT_CARD";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
}

interface OrderStore {
  currentOrder: Order | null;
  isLoading: boolean;
  isPaymentProcessing?: boolean;
  userOrders?: Order[];
  adminOrders?: AdminOrder[];
  error: string | null;
  createPayPalOrder: (items: any[], total: number) => Promise<string | null>;
  capturePayPalOrder: (orderId: string) => Promise<any | null>;
  createFinalOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  getOrder: (orderId: string) => Promise<Order | null>;
  updateOrderStatus?: (
    orderId: string,
    status: Order["status"]
  ) => Promise<boolean>;
  getAllOrders: () => Promise<Order[] | null>;
  getOrdersByUserId: () => Promise<Order[] | null>;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderStore> ((set,get) => ({
    currentOrder: null,
    isLoading: false,
    error: null,
    createPayPalOrder: async(items, total) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.post(`/${API_ROUTES.ORDERS}/create-paypal-order`, {items, total}, {
                withCredentials: true
            });

            set({isLoading: false})
            return response?.data?.data?.id;
        }
        catch(err){
            set({isLoading: false,error: "Falied to create Paypal order"})
            return null;
        }
    },

    capturePayPalOrder: async (orderId: string) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.post(`/${API_ROUTES.ORDERS}/capture-paypal-order`, {orderId}, {withCredentials: true});

            set({isLoading: false})
            return response?.data?.data;
        }
         catch(err){
            set({isLoading: false,error: "Falied to capture Paypal order"})
            return null;
        }
    },

    createFinalOrder: async (orderData) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.post(`/${API_ROUTES.ORDERS}/create-final-order`, {orderData}, {withCredentials: true});

            set({isLoading: false, currentOrder: response?.data?.data})
            return response?.data?.data;
        }
         catch(err){
            set({isLoading: false,error: "Falied to create order"})
            return null;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.put(`/${API_ROUTES.ORDERS}/${orderId}/update-order`, {status}, {withCredentials: true});

            set((state) => ({
                currentOrder: state.currentOrder && state.currentOrder.id === orderId ? 
                { ...state.currentOrder, status } : state.currentOrder ,
                isLoading: false,
            }))
            return true;
        }
         catch(err){
            set({isLoading: false,error: "Falied to update order status"})
            return false;
        }
    },

    getOrder: async (orderId) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.get(`/${API_ROUTES.ORDERS}/get-order/${orderId}`, {withCredentials: true});

            set({isLoading: false, currentOrder: response?.data?.data})
            return response?.data?.data;
        }
         catch(err){
            set({isLoading: false,error: "Falied to get all order"})
            return null;
        }
    },

    getAllOrders: async () => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.get(`/${API_ROUTES.ORDERS}/get-all-order`, {withCredentials: true});

            set({isLoading: false})
            return response?.data?.data;
        }
         catch(err){
            set({isLoading: false,error: "Falied to get all order"})
            return null;
        }
    },

    getOrdersByUserId: async () => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.get(`/${API_ROUTES.ORDERS}/get-order-by-userid`, {withCredentials: true});

            set({isLoading: false})
            return response?.data?.data;
        }
         catch(err){
            set({isLoading: false,error: "Falied to get order by userid"})
            return null;
        }
    },

    setCurrentOrder: (order) => set({currentOrder: order}),


}))