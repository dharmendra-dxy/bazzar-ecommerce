import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import couponRoutes from './routes/coupon.routes';
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
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
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