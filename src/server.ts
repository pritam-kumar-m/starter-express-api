import express from "express";
import { PrismaClient } from "@prisma/client";
import connectToMongo from "../database/db";
import bodyParser from "body-parser";
export const prisma = new PrismaClient();
connectToMongo();

const port = process.env.PORT;
const app = express();
app.use(bodyParser.json());

app.get("/data", (req, res) => {
  return res.status(200).json("test data");
 });

// API routes
import authRoutes from "./modules/auth/routes/auth.route";
import vendorRoutes from "./modules/Bills/Vendors/routes/vendor.route";
import accountType from "./modules/Accounts/AccountType/routes/type.route";
import saleTax from "./modules/Accounts/SaleTaxCode/routes/sale.tax.controller";
import groupClass from "./modules/Bills/GroupClass/routes/class.route";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/account-type", accountType);
app.use("/api/v1/sale-tax", saleTax);
app.use("/api/v1/group-class", groupClass);

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`);
});
