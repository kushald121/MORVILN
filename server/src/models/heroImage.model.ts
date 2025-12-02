import db from "../config/database";

export interface HeroImage {
  id: string;
  title: string | null;
  subtitle: string | null;
  link_url: string | null;
  media_url: string;
  cloudinary_public_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const HeroImageModel = {
  async create(payload: Partial<HeroImage>): Promise<HeroImage> {
    const {
      title = null,
      subtitle = null,
      link_url = null,
      media_url,
      cloudinary_public_id = null,
      is_active = true,
      sort_order = 0,
    } = payload;

    const { rows } = await db.query<HeroImage>(
      `INSERT INTO hero_images (title, subtitle, link_url, media_url, cloudinary_public_id, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, subtitle, link_url, media_url, cloudinary_public_id, is_active, sort_order]
    );
    return rows[0];
  },

  async findAll(includeInactive = true): Promise<HeroImage[]> {
    const where = includeInactive ? "" : "WHERE is_active = TRUE";
    const { rows } = await db.query<HeroImage>(
      `SELECT * FROM hero_images ${where} ORDER BY sort_order ASC, created_at ASC`
    );
    return rows;
  },

  async findActiveOrdered(): Promise<HeroImage[]> {
    const { rows } = await db.query<HeroImage>(
      `SELECT * FROM hero_images WHERE is_active = TRUE ORDER BY sort_order ASC, created_at ASC`
    );
    return rows;
  },

  async findById(id: string): Promise<HeroImage | null> {
    const { rows } = await db.query<HeroImage>(
      `SELECT * FROM hero_images WHERE id = $1 LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async update(id: string, payload: Partial<HeroImage>): Promise<HeroImage | null> {
    // Build dynamic update
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(payload)) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }
    if (fields.length === 0) {
      const current = await this.findById(id);
      return current;
    }
    values.push(id);

    const { rows } = await db.query<HeroImage>(
      `UPDATE hero_images SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async delete(id: string): Promise<void> {
    await db.query(`DELETE FROM hero_images WHERE id = $1`, [id]);
  }
};
