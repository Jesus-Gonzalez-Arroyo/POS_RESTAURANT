import { Router } from "express";
import { getSalesAll, saleCreate } from "../controllers/sales.controller";
import { authenticateToken } from '../middlewares/auth.middleware'

const router = Router();

router.get("/", authenticateToken, getSalesAll);
router.post("/", authenticateToken, saleCreate);

export default router;
