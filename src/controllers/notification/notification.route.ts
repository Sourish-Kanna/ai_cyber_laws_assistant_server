import { Router } from "express";

import { update_notification,get_notifications } from "./notification.controller";

const router = Router();

router.post("/update", update_notification);
router.post("/get", get_notifications);

export default router;
