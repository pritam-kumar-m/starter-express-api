import { Router } from "express";
import { saleTaxCreate } from "../controller/sale-tax.controller";
import { auth } from "../../../../middleware/auth";
const router = Router();

router.post("/add", auth, saleTaxCreate);

export default router;
