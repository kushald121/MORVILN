import { Pool } from 'pg';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'instagram' | 'email';
  providerId?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'instagram' | 'email';
  providerId?: string;
}

class UserModel {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    const query = `
      INSERT INTO users (email, name, avatar, provider, provider_id, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      userData.email,
      userData.name,
      userData.avatar,
      userData.provider,
      userData.providerId,
      true // OAuth users are verified by default
    ];

    const result = await this.pool.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    
    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  async findUserByProvider(provider: string, providerId: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE provider = $1 AND provider_id = $2';
    const result = await this.pool.query(query, [provider, providerId]);
    
    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name) {
      fields.push(`name = $${paramCount}`);
      values.push(updates.name);
      paramCount++;
    }
    if (updates.avatar) {
      fields.push(`avatar = $${paramCount}`);
      values.push(updates.avatar);
      paramCount++;
    }
    if (updates.provider) {
      fields.push(`provider = $${paramCount}`);
      values.push(updates.provider);
      paramCount++;
    }
    if (updates.providerId) {
      fields.push(`provider_id = $${paramCount}`);
      values.push(updates.providerId);
      paramCount++;
    }

    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    paramCount++;

    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      avatar: row.avatar,
      provider: row.provider,
      providerId: row.provider_id,
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export default new UserModel();