import { Router } from "express";
import {getAllUser,createUser} from './user.controller'

const router = Router();

router.get("/users", getAllUser);
router.post("/users", createUser);

export default router;