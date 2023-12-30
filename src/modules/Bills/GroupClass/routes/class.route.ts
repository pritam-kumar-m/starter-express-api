import { Router } from "express";
import { GroupClassCreate } from "../controllers/class.controller";
import { auth } from "../../../../middleware/auth";
const router = Router();

router.post("/add", auth, GroupClassCreate);

export default router;
