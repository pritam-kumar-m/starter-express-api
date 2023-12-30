import express from "express";
import { PrismaClient } from "@prisma/client";
import connectToMongo from "../database/db";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";

export const prisma = new PrismaClient();
connectToMongo();

const app = express();
app.use(
  cors({
    credentials: true,
  })
);
app.get('/',(req,res)=>{
  res.status(200).json("test data")
})
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


// API routes
import authRoutes from './modules/auth/routes/auth.route';
import vendorRoutes from './modules/Bills/Vendors/routes/vendor.route'
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vendor', vendorRoutes);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`);
});