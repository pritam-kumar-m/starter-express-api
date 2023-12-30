import { Router } from "express";
import { accountTypeCreate } from "../controllers/type.controller";
import { auth } from "../../../../middleware/auth";
const router = Router();

router.post("/add", auth, accountTypeCreate);

export default router;
