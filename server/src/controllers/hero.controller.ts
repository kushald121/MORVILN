import { Request, Response, NextFunction } from "express";
import { HeroService } from "../services/hero.service";

export const HeroController = {
  // Public
  async listPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await HeroService.listPublic();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  // Admin
  async listAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await HeroService.listAdmin();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req as any).file as Express.Multer.File | undefined;
      const record = await HeroService.createHeroImage(file, req.body);
      res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },

  async updateMetadata(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const record = await HeroService.updateMetadata(id, req.body);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },

  async updateImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const file = (req as any).file as Express.Multer.File | undefined;
      const record = await HeroService.updateImage(id, file);
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await HeroService.remove(id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
