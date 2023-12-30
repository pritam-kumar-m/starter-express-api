import { Router } from "express";
import { register, login, logout, forgetPass } from "../controllers/auth.controller";
import { auth } from "../../../middleware/auth";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/re-set", auth, forgetPass);

export default router;
