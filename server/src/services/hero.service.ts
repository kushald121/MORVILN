import { v2 as cloudinary } from "cloudinary";
import { HeroImageModel } from "../models/heroImage.model";
import { Readable } from "stream";

// Helper to upload a buffer to Cloudinary using upload_stream
async function uploadToCloudinary(buffer: Buffer, folder = "hero") {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Cloudinary upload failed"));
        resolve({ secure_url: result.secure_url!, public_id: result.public_id! });
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

export const HeroService = {
  async createHeroImage(file: Express.Multer.File | undefined, body: any) {
    if (!file) throw new Error("Image file is required");

    const { title, subtitle, link_url } = body || {};
    const sort_order = body?.sort_order ? Number(body.sort_order) : 0;
    const is_active = typeof body?.is_active !== "undefined" ? String(body.is_active) === "true" : true;

    const { secure_url, public_id } = await uploadToCloudinary(file.buffer, "morviln/hero");

    return HeroImageModel.create({
      title: title ?? null,
      subtitle: subtitle ?? null,
      link_url: link_url ?? null,
      media_url: secure_url,
      cloudinary_public_id: public_id,
      is_active,
      sort_order,
    });
  },

  async listPublic() {
    return HeroImageModel.findActiveOrdered();
  },

  async listAdmin() {
    return HeroImageModel.findAll(true);
  },

  async updateMetadata(id: string, body: any) {
    const payload: any = {};
    if (typeof body.title !== "undefined") payload.title = body.title ?? null;
    if (typeof body.subtitle !== "undefined") payload.subtitle = body.subtitle ?? null;
    if (typeof body.link_url !== "undefined") payload.link_url = body.link_url ?? null;
    if (typeof body.is_active !== "undefined") payload.is_active = String(body.is_active) === "true";
    if (typeof body.sort_order !== "undefined") payload.sort_order = Number(body.sort_order);
    return HeroImageModel.update(id, payload);
  },

  async updateImage(id: string, file: Express.Multer.File | undefined) {
    if (!file) throw new Error("Image file is required");
    const existing = await HeroImageModel.findById(id);
    if (!existing) throw new Error("Hero image not found");

    // destroy old asset if present
    if (existing.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(existing.cloudinary_public_id);
      } catch {}
    }

    const { secure_url, public_id } = await uploadToCloudinary(file.buffer, "morviln/hero");

    return HeroImageModel.update(id, {
      media_url: secure_url,
      cloudinary_public_id: public_id,
    });
  },

  async remove(id: string) {
    const existing = await HeroImageModel.findById(id);
    if (!existing) return;
    if (existing.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(existing.cloudinary_public_id);
      } catch {}
    }
    await HeroImageModel.delete(id);
  }
};
