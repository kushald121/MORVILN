import supabase, { supabaseAdmin } from "../config/supabaseclient";

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

const TABLE_NAME = "hero_images";

export const HeroImageModel = {
  async create(payload: Partial<HeroImage>): Promise<HeroImage> {
    if (!supabaseAdmin) {
      throw new Error("Database not configured");
    }

    const {
      title = null,
      subtitle = null,
      link_url = null,
      media_url,
      cloudinary_public_id = null,
      is_active = true,
      sort_order = 0,
    } = payload;

    if (!media_url) {
      throw new Error("media_url is required");
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .insert({
        title,
        subtitle,
        link_url,
        media_url,
        cloudinary_public_id,
        is_active,
        sort_order,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating hero image:", error);
      throw new Error(`Failed to create hero image: ${error.message}`);
    }

    return data as HeroImage;
  },

  async findAll(includeInactive = true): Promise<HeroImage[]> {
    if (!supabase) {
      return [];
    }

    let query = supabase.from(TABLE_NAME).select("*");

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    query = query.order("sort_order", { ascending: true }).order("created_at", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching hero images:", error);
      throw new Error(`Failed to fetch hero images: ${error.message}`);
    }

    return (data || []) as HeroImage[];
  },

  async findActiveOrdered(): Promise<HeroImage[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching active hero images:", error);
      throw new Error(`Failed to fetch active hero images: ${error.message}`);
    }

    return (data || []) as HeroImage[];
  },

  async findById(id: string): Promise<HeroImage | null> {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      console.error("Error fetching hero image by id:", error);
      throw new Error(`Failed to fetch hero image: ${error.message}`);
    }

    return (data as HeroImage) || null;
  },

  async update(id: string, payload: Partial<HeroImage>): Promise<HeroImage | null> {
    if (!supabaseAdmin) {
      throw new Error("Database not configured");
    }

    if (!payload || Object.keys(payload).length === 0) {
      return await this.findById(id);
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error updating hero image:", error);
      throw new Error(`Failed to update hero image: ${error.message}`);
    }

    return (data as HeroImage) || null;
  },

  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error("Database not configured");
    }

    const { error } = await supabaseAdmin.from(TABLE_NAME).delete().eq("id", id);

    if (error) {
      console.error("Error deleting hero image:", error);
      throw new Error(`Failed to delete hero image: ${error.message}`);
    }
  },
};
