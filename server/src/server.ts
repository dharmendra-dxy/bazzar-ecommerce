import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes';
import addressRoutes from './routes/address.routes';
import cartRoutes from './routes/cart.routes';
import couponRoutes from './routes/coupon.routes';
import orderRoutes from './routes/order.routes';
import productRoutes from './routes/product.routes';
import settingRoutes from './routes/setting.routes';

dotenv.config();
const app = express();
const PORT=process.env.PORT ?? 3001;

// prisma client:
export const prisma = new PrismaClient();

// configure cors options:
const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingRoutes);
app.get('/', (req,res) =>{ 
    res.json({ message:"Hello from bazaar"});
})

app.listen(PORT, ()=>{
    console.log(`Server is running at: http://localhost:${PORT}`);
});

process.on('SIGINT', async()=>{
    await prisma.$disconnect();
    process.exit();
})