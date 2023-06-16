import { Router } from "express";
import { flights } from "../controllers/flights.controller.js";




const router = Router();

router.get('/flights/:id/passengers',flights)

export default router