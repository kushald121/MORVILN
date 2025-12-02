import { Router } from "express";
import { HeroController } from "../controllers/hero.controller";
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from "../middleware/admin.middleware";
import { upload } from "../middleware/multer";

const router = Router();

// Public
router.get("/hero", HeroController.listPublic);

// Admin
router.get("/admin/hero", authMiddleware, adminMiddleware, HeroController.listAdmin);
router.post("/admin/hero", authMiddleware, adminMiddleware, upload.single("image"), HeroController.create);
router.patch("/admin/hero/:id", authMiddleware, adminMiddleware, HeroController.updateMetadata);
router.patch("/admin/hero/:id/image", authMiddleware, adminMiddleware, upload.single("image"), HeroController.updateImage);
router.delete("/admin/hero/:id", authMiddleware, adminMiddleware, HeroController.remove);

export default router;
