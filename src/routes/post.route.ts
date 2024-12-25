import { Router } from "express";
import { createPost, updatePost } from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);

export default router;