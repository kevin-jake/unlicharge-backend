import express from "express";
import { getUsers, updateUserInformation } from "../controllers/users.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.use(checkAuth);

/* READ */
router.get("/:profileId", getUsers);

/* UPDATE */
router.patch("/:profileId", updateUserInformation);

export default router;
