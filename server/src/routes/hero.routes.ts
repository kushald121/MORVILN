import { Router } from "express";
import { HeroController } from "../controllers/hero.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";
import { upload } from "../middleware/multer";

const router = Router();

// Public
router.get("/hero", HeroController.listPublic);

// Admin
router.get("/admin/hero", authenticate, isAdmin, HeroController.listAdmin);
router.post("/admin/hero", authenticate, isAdmin, upload.single("image"), HeroController.create);
router.patch("/admin/hero/:id", authenticate, isAdmin, HeroController.updateMetadata);
router.patch("/admin/hero/:id/image", authenticate, isAdmin, upload.single("image"), HeroController.updateImage);
router.delete("/admin/hero/:id", authenticate, isAdmin, HeroController.remove);

export default router;
